import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/lessons/')) {
            const match = id.match(/\/lessons\/([^/.]+)/);
            if (match) return `lesson-${match[1]}`;
          }
        },
      },
    },
  },
});
