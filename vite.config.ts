import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  // In development the app talks to the API in /server (npm run dev starts both).
  server: {
    proxy: { '/api': `http://localhost:${process.env.PORT ?? 8787}` },
  },
});
