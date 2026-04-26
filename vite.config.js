import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensure relative paths for assets
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
