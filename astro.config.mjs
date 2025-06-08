// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'static',  // Using static output for simpler deployment
  integrations: [
    react(), 
    tailwind({
      // Optimize Tailwind for production
      applyBaseStyles: false,
    }),
    mdx({
      // MDX options for blog content
      remarkPlugins: ['remark-toc'],
      drafts: true, // Allow draft posts during development
    })
  ],
  vite: {
    // Optimize build
    build: {
      // Minimize JS bundles
      minify: 'terser',
      // Configure external packages that shouldn't be bundled
      rollupOptions: {
        external: ['ws']
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
        '@shared': '/src/shared',
        '@server': '/src/server',
        '@client': '/src/client',
        '@components': '/src/components',
      }
    }
  },
  adapter: node({
    mode: 'standalone',
  }),
});
