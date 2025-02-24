import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^components\/(.*)$/, replacement: '/src/components/$1' },
      { find: /^pages\/(.*)$/, replacement: '/src/pages/$1' },
      { find: /^features\/(.*)$/, replacement: '/src/features/$1' },
      { find: /^lib\/(.*)$/, replacement: '/src/lib/$1' },
      { find: /^hooks\/(.*)$/, replacement: '/src/hooks/$1' },
      { find: /^config\/(.*)$/, replacement: '/src/config/$1' },
      { find: /^constant\/(.*)$/, replacement: '/src/constant/$1' },
      { find: /^utils\/(.*)$/, replacement: '/src/utils/$1' },
      { find: /^models\/(.*)$/, replacement: '/src/models/$1' },
      { find: /^state\/(.*)$/, replacement: '/src/state/$1' },
      { find: /^styles\/(.*)$/, replacement: '/src/styles/$1' },
      { find: /^types\/(.*)$/, replacement: '/src/types/$1' },
      { find: /^assets\/(.*)$/, replacement: '/src/assets/$1' },
    ],
  },
  server: {
    port: 3000,
  },
});
