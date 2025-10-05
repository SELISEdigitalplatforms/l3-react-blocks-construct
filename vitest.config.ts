/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vite';
import viteConfig from './vite.config';
import path from 'path';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      globals: true,
      css: true,
      // Enable jest compatibility for easier migration
      pool: 'forks',
      coverage: {
        provider: 'v8',
        reporter: ['lcov', 'text'],
        reportsDirectory: 'coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.spec.{ts,tsx}',
          'src/**/*.test.{ts,tsx}',
          'src/**/*.model.ts',
          'src/**/*.module.ts',
          'src/**/*.d.ts',
          'src/stories/**',
          'src/assets/**',
          'node_modules/**',
        ],
      },
      include: ['**/*.spec.{ts,tsx}'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        assets: path.resolve(__dirname, './src/assets'),
        components: path.resolve(__dirname, './src/components'),
        features: path.resolve(__dirname, './src/features'),
        hooks: path.resolve(__dirname, './src/hooks'),
        lib: path.resolve(__dirname, './src/lib'),
        constant: path.resolve(__dirname, './src/constant'),
        config: path.resolve(__dirname, './src/config'),
        state: path.resolve(__dirname, './src/state'),
        styles: path.resolve(__dirname, './src/styles'),
        providers: path.resolve(__dirname, './src/providers'),
        pages: path.resolve(__dirname, './src/pages'),
      },
      // Mock file imports (images, CSS, etc.)
      server: {
        deps: {
          inline: ['uuid'],
        },
      },
    },
  })
);
