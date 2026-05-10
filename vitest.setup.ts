import '@testing-library/jest-dom/vitest'

// JSDOM lacks ResizeObserver — components like ImageViewer / Tabs use it.
// Provide a no-op implementation so render() doesn't throw.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
}
