// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import remarkToc from 'remark-toc';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  output: 'server',  // Changed to 'server' for compatibility with Node adapter
  integrations: [
    react(), 
    tailwind({
      // Optimize Tailwind for production
      applyBaseStyles: false,
    }),
    mdx({
      // MDX options for blog content
      remarkPlugins: [remarkToc]
      // Note: The 'drafts' option was removed as it's not a valid MDX option
    })
  ],
  vite: {
    // Optimize build
    build: {
      // Minimize JS bundles
      minify: 'terser',
      // Configure external packages that shouldn't be bundled
      rollupOptions: {
        external: ['ws', 'dotenv', 'dotenv/config', 'axios', '@google/generative-ai']
      },
    },
    // Better error messages during development
    server: {
      hmr: {
        overlay: true,
      },
    },
    // Resolve paths like @shared and @server
    resolve: {
      alias: {
        '@server': path.resolve('./src/server'),
        '@shared': path.resolve('./src/shared'),
        '@components': path.resolve('./src/components'),
        '@layouts': path.resolve('./src/layouts'),
        '@': path.resolve('./src'),
      }
    }
  },
  adapter: node({
    mode: 'standalone',
  }),
});
