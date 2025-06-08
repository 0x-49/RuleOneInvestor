import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Get the directory of the current module (e.g., /path/to/project/dist when running dist/index.js)
  const currentModuleDir = path.dirname(new URL(import.meta.url).pathname);
  // Resolve the path to the 'public' directory containing Vite's build output
  const distPath = path.resolve(currentModuleDir, "public"); // Should be /path/to/project/dist/public

  log(`Production mode: Attempting to serve static files from: ${distPath}`, "vite-prod-setup");

  if (!fs.existsSync(distPath)) {
    log(`Error: Static assets directory not found: ${distPath}. Ensure client is built and 'dist/public' exists.`, "vite-prod-setup");
    // This is a critical error if the path is wrong or files are missing.
    app.use("*", (_req, res) => {
      res.status(500).send(`Server configuration error: Static assets path not found at ${distPath}. Please check server logs.`);
    });
    return; // Stop further middleware setup if base path is wrong
  }

  log(`Serving static content from ${distPath}`, "vite-prod-setup");
  app.use(express.static(distPath));

  // Fall through to index.html for SPA routing (handles client-side routes)
  app.use("*", (req, res) => {
    // This check is mostly a safeguard; API routes should be handled before this middleware.
    // Vercel's routing also directs /api/* to dist/index.js, where API routes are registered first.
    if (req.originalUrl.startsWith('/api/')) {
      // This should ideally not be hit if API routes are correctly registered before static serving.
      log(`Warning: SPA fallback received API-like path: ${req.originalUrl}`, "vite-prod-fallback");
      res.status(404).send('API route not found within SPA fallback.');
      return;
    }

    const indexPath = path.resolve(distPath, "index.html");
    log(`SPA fallback: Attempting to serve ${indexPath} for ${req.originalUrl}`, "vite-prod-fallback");

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      log(`Error: index.html not found at ${indexPath} for SPA fallback.`, "vite-prod-fallback");
      res.status(404).send(`SPA Fallback Error: Main application file (index.html) not found at ${indexPath}.`);
    }
  });
}
