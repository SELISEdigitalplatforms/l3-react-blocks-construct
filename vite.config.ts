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
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor';
          }

          // Router
          if (id.includes('node_modules/react-router-dom/')) {
            return 'router';
          }

          // React Query
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'query';
          }

          // All Radix UI components in one chunk
          if (id.includes('node_modules/@radix-ui/')) {
            return 'ui';
          }

          // Form libraries
          if (
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/@hookform/') ||
            id.includes('node_modules/zod/')
          ) {
            return 'forms';
          }

          // Date/Time libraries
          if (
            id.includes('node_modules/date-fns') ||
            id.includes('node_modules/react-day-picker') ||
            id.includes('node_modules/react-big-calendar')
          ) {
            return 'datetime';
          }

          // Rich text editor
          if (id.includes('node_modules/quill')) {
            return 'editor';
          }

          // Charts
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }

          // Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }

          // i18n
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'i18n';
          }

          // DnD libraries
          if (id.includes('node_modules/@dnd-kit/') || id.includes('node_modules/react-dnd')) {
            return 'dnd';
          }

          // File handling
          if (
            id.includes('node_modules/react-dropzone') ||
            id.includes('node_modules/papaparse') ||
            id.includes('node_modules/html2canvas') ||
            id.includes('node_modules/jspdf')
          ) {
            return 'file-utils';
          }

          // Other utilities
          if (
            id.includes('node_modules/') &&
            (id.includes('clsx') ||
              id.includes('class-variance-authority') ||
              id.includes('tailwind-merge'))
          ) {
            return 'utils';
          }
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
