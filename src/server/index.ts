import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import http from 'http'; // Import http for local dev server
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware (keep as is)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });
  next();
});

// Initialize routes and static serving
// This needs to be done when the module loads so the exported app is configured.

// Register API routes
registerRoutes(app); // Assuming registerRoutes now just modifies the app instance

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  // Consider logging the error here as well, e.g., console.error(err);
  // throw err; // Re-throwing can sometimes stop the Vercel function prematurely
});

// Setup Vite for development OR serve static files for production
if (process.env.NODE_ENV === "development") {
  // For local development, we still need to start a server.
  // We'll create an http server and pass it to setupVite.
  const server = http.createServer(app);
  setupVite(app, server).then(() => { // setupVite might be async if it starts the server
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    server.listen(port, '0.0.0.0', () => { // Added host '0.0.0.0'
      log(`Development server listening on port ${port}`);
    });
  }).catch(err => {
    log(`Error starting dev server: ${err}`, 'error');
    process.exit(1);
  });
} else {
  // For production (Vercel), just configure app to serve static files.
  // Vercel handles the actual server listening.
  serveStatic(app);
}

// Export the app for Vercel
export default app;
