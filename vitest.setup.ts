/**
 * Global test setup for Vitest
 *
 * - Polyfills browser APIs (ResizeObserver, matchMedia, scrollTo)
 * - Sets up global environment variables for tests
 * - Imports jest-dom matchers for better assertions
 *
 * This file is referenced in vite.config.ts as test.setupFiles.
 * Do not duplicate polyfills or env setup in individual test files.
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill ResizeObserver if not present
if (!global.ResizeObserver) {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

// Polyfill IntersectionObserver if not present
if (!global.IntersectionObserver) {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(),
  }));
}

// Polyfill matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Polyfill scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
});

// Set up environment variables for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_CAPTCHA_SITE_KEY: process.env.VITE_CAPTCHA_SITE_KEY || 'test-site-key',
    VITE_CAPTCHA_TYPE: process.env.VITE_CAPTCHA_TYPE || 'reCaptcha',
    // Add other environment variables as needed
    VITE_PUBLIC_BACKEND_URL:
      process.env.VITE_PUBLIC_BACKEND_URL || 'https://dev-api.seliseblocks.com',
    VITE_X_BLOCKS_KEY: process.env.VITE_X_BLOCKS_KEY || 'cf18dc87904c4e1485639242cda4a026',
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://dev-api.seliseblocks.com',
  },
  configurable: true,
});
