import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: false,
  splitting: false,
  outDir: 'lib',
  external: [
    'react',
    'react-dom',
    'styled-components',
    'lucide-react',
    '@ingradient/ui',
    '@ingradient/ui/brand',
    '@ingradient/ui/components',
    '@ingradient/ui/patterns',
    '@ingradient/ui/primitives',
    '@ingradient/ui/tokens',
    '@ingradient/ui/utils',
  ],
})
