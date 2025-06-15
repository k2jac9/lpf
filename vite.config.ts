import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      '@aptos-labs/wallet-adapter-react',
      '@aptos-labs/wallet-adapter-petra',
      '@aptos-labs/wallet-adapter-martian'
    ]
  }
});