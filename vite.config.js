import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ✅ اضافه کن

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, 'src/api'), // ✅ alias به فولدر api
      '@components': path.resolve(__dirname, 'src/components'), // (اختیاری)
    },
  },
});
