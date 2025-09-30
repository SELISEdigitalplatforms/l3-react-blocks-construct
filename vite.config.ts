import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
// Note: CJS deprecation warning is informational and doesn't affect functionality.
// It occurs when dependencies use the legacy CommonJS Vite API instead of ES modules.
// This is expected during the migration period from CRA to Vite.
export default defineConfig({
  plugins: [react()],
  
  // Path aliases to match existing tsconfig paths
  resolve: {
    alias: {
      // Match the baseUrl and paths from tsconfig.json
      '@': path.resolve(__dirname, './src'),
      'assets': path.resolve(__dirname, './src/assets'),
      'components': path.resolve(__dirname, './src/components'),
      'config': path.resolve(__dirname, './src/config'),
      'context': path.resolve(__dirname, './src/context'),
      'features': path.resolve(__dirname, './src/features'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'lib': path.resolve(__dirname, './src/lib'),
      'constant': path.resolve(__dirname, './src/constant'),
      'models': path.resolve(__dirname, './src/models'),
      'pages': path.resolve(__dirname, './src/pages'),
      'providers': path.resolve(__dirname, './src/providers'),
      'state': path.resolve(__dirname, './src/state'),
      'styles': path.resolve(__dirname, './src/styles'),
      'types': path.resolve(__dirname, './src/types'),
      'utils': path.resolve(__dirname, './src/utils'),
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true, // Allow external connections
    open: false, // Don't auto-open browser (matches BROWSER=none from CRA)
  },

  // Build configuration
  build: {
    outDir: 'build', // Keep same output directory as CRA
    sourcemap: true,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar'],
        },
      },
    },
  },

  // Environment variables configuration
  // Vite automatically loads .env files and exposes variables prefixed with VITE_
  envPrefix: ['VITE_', 'REACT_APP_'], // Support both prefixes during migration
  
  // CSS configuration
  css: {
    postcss: './postcss.config.js', // Use existing PostCSS config
  },

  // Define global constants
  define: {
    // Some libraries expect this global
    global: 'globalThis',
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'clsx',
      'tailwind-merge',
    ],
  },
})