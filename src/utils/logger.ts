/**
 * Environment-aware logger — debug/log calls are no-ops in production builds.
 * Detects dev mode from either Vite (`import.meta.env.DEV`) or Node-shaped
 * environments (`process.env.NODE_ENV === 'development'`).
 *
 * Usage:
 *   import { logger } from '@ingradient/ui'
 *   logger.debug('[MyModule]', 'verbose info', data)
 *   logger.warn('[MyModule]', 'something fishy', err)
 */

function isDevMode(): boolean {
  try {
    // Vite / esbuild
    if (typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
      return true
    }
  } catch {
    /* import.meta unavailable in CJS */
  }
  // Avoid pulling in @types/node by reaching through globalThis.
  const proc = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process
  if (proc?.env?.NODE_ENV === 'development') {
    return true
  }
  return false
}

const noop = (..._args: unknown[]) => {
  /* no-op */
}
const dev = isDevMode()

export const logger = {
  debug: dev ? console.debug.bind(console) : noop,
  log: dev ? console.log.bind(console) : noop,
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
}
