import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      '@aptos-labs/wallet-adapter-react',
      '@aptos-labs/wallet-adapter-core',
      '@aptos-labs/wallet-adapter-petra',
      '@aptos-labs/wallet-adapter-martian',
      '@aptos-labs/wallet-adapter-pontem',
      '@fewcha/aptos-wallet-adapter'
    ]
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
    }
  }
});