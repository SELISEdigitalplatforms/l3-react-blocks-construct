/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
// Note: CJS deprecation warning is informational and doesn't affect functionality.
// It occurs when dependencies use the legacy CommonJS Vite API instead of ES modules.
// This is expected during the migration period from CRA to Vite.
export default defineConfig({
  plugins: [react()],

  // Path aliases to match tsconfig paths
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    host: true,
    open: false,
    allowedHosts: true, // ✅ works for all tenants/domains
  },

  // Build configuration
  build: {
    outDir: 'build', // Keep same output directory as CRA
    sourcemap: true,
    chunkSizeWarningLimit: 700, // Increase limit since gzipped sizes are acceptable
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
          ],
        },
      },
    },
  },

  // Environment variables configuration
  // Vite automatically loads .env files and exposes variables prefixed with VITE_
  envPrefix: 'VITE_',

  // CSS configuration
  css: {
    postcss: './postcss.config.js', // Use existing PostCSS config
  },

  // Vitest test configuration
  test: {
    globals: true, // so you can use 'describe', 'it', 'expect' without importing
    environment: 'jsdom', // simulates browser for React components
    setupFiles: ['./vitest.polyfills.ts', './vitest.setup.ts'], // polyfills must load first
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'], // include all source files
      exclude: [
        'src/**/*.spec.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.model.ts',
        'src/**/*.module.ts',
        'src/**/*.d.ts',
        'src/assets/**',
        'node_modules/**',
      ],
    },
    include: ['**/*.spec.{ts,tsx}'],
    // Mock file imports (images, CSS, etc.)
    // server.deps.inline removed (not needed unless you have ESM/CJS issues)
  },

  // optimizeDeps.include removed (not needed unless you have pre-bundling issues)
});
