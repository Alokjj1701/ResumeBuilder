import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // BACKEND_URL is a Node/server-side env var — NOT exposed to the browser
      // In Docker dev: set BACKEND_URL=http://backend:8080
      // Locally: defaults to http://localhost:8080
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
      '/auth': {
        target: process.env.BACKEND_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
