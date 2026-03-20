import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    legacy: 'src/legacy/index.ts',
    tokens: 'src/tokens/index.ts',
    primitives: 'src/primitives/index.ts',
    components: 'src/components/index.ts',
    patterns: 'src/patterns/index.ts',
    brand: 'src/brand/index.tsx',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: false,
  splitting: false,
  outDir: 'lib',
  external: ['react', 'react-dom', 'styled-components', 'lucide-react', 'recharts'],
})
