import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Path aliases to match tsconfig paths
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    // Test environment
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./vitest.setup.ts'],
    
    // Test file patterns
    include: ['**/*.spec.{ts,tsx}'],
    
    // Global test configuration
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      reportsDirectory: 'coverage',
      include: [
        'src/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/**/*.spec.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.model.ts',
        'src/**/*.module.ts',
        'src/**/*.d.ts',
        'node_modules/**',
      ],
    },

    // Mock configuration
    // Vitest will automatically mock files based on file extensions
    // No need for complex moduleNameMapper like Jest
  },

  // Environment variables (Vitest automatically handles import.meta.env)
  // Support both VITE_ and REACT_APP_ prefixes during migration
  envPrefix: ['VITE_', 'REACT_APP_'],
  
  // Define global constants for compatibility
  define: {
    global: 'globalThis',
  },
})