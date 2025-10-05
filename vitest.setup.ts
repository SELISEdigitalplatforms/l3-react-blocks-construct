import '@testing-library/jest-dom';
import { vi, beforeAll } from 'vitest';

// Browser API polyfills
Object.defineProperty(global, 'ResizeObserver', {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

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

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
});

// Jest compatibility - provide jest global for existing tests
Object.defineProperty(globalThis, 'jest', {
  value: {
    fn: vi.fn,
    mock: vi.mock,
    unmock: vi.unmock,
    clearAllMocks: vi.clearAllMocks,
    resetAllMocks: vi.resetAllMocks,
    restoreAllMocks: vi.restoreAllMocks,
    spyOn: vi.spyOn,
    // Timer functions
    useFakeTimers: vi.useFakeTimers,
    useRealTimers: vi.useRealTimers,
    advanceTimersByTime: vi.advanceTimersByTime,
    runOnlyPendingTimers: vi.runOnlyPendingTimers,
    runAllTimers: vi.runAllTimers,
    // Additional jest compatibility
    clearAllTimers: vi.clearAllTimers,
  },
});

// Set up environment variables for tests
beforeAll(() => {
  // Define import.meta.env for test environment
  Object.defineProperty(import.meta, 'env', {
    value: {
      VITE_CAPTCHA_SITE_KEY: process.env.VITE_CAPTCHA_SITE_KEY || 'test-site-key',
      VITE_CAPTCHA_TYPE: process.env.VITE_CAPTCHA_TYPE || 'reCaptcha',
      // Add other environment variables as needed
      VITE_PUBLIC_BACKEND_URL:
        process.env.VITE_PUBLIC_BACKEND_URL || 'https://dev-api.seliseblocks.com',
      VITE_PUBLIC_X_BLOCKS_KEY:
        process.env.VITE_PUBLIC_X_BLOCKS_KEY || 'cf18dc87904c4e1485639242cda4a026',
      VITE_PUBLIC_BLOCKS_API_URL:
        process.env.VITE_PUBLIC_BLOCKS_API_URL || 'https://dev-api.seliseblocks.com',
      VITE_PUBLIC_API_URL: process.env.VITE_PUBLIC_API_URL || 'https://dev-api.seliseblocks.com',
    },
    configurable: true,
  });
});
