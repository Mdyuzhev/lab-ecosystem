import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ВАЖНО: base должен совпадать с именем репозитория на GitHub
  // Измени 'lab-ecosystem' на имя твоего репозитория если оно отличается
  base: '/lab-ecosystem/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
