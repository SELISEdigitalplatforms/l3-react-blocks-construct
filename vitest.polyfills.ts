/**
 * Critical polyfills that must be loaded BEFORE any other modules
 * This file runs before vitest.setup.ts to ensure polyfills are available
 * when webidl-conversions and other modules are loaded.
 */

// Polyfill ArrayBuffer.prototype.resizable for webidl-conversions
if (!Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'resizable')) {
  Object.defineProperty(ArrayBuffer.prototype, 'resizable', {
    get() {
      return false;
    },
    configurable: true,
    enumerable: true,
  });
}

// Polyfill SharedArrayBuffer.prototype.growable for webidl-conversions
if (
  typeof SharedArrayBuffer !== 'undefined' &&
  !Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'growable')
) {
  Object.defineProperty(SharedArrayBuffer.prototype, 'growable', {
    get() {
      return false;
    },
    configurable: true,
    enumerable: true,
  });
}
