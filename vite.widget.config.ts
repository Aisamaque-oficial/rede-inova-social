import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'public/widget',
    emptyOutDir: false, // Don't wipe the public folder
    lib: {
      entry: path.resolve(__dirname, 'src/widget/accessibility-element.tsx'),
      name: 'AcessibilidadeWidget',
      fileName: () => 'acessibilidade.js',
      formats: ['iife'] // Self-executing function so it works on any browser without a bundler
    },
    rollupOptions: {
      // Bundling everything inside (React, framer-motion, lucide-react)
      external: [],
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});
