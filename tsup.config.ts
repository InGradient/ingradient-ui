import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    tokens: 'src/tokens/index.ts',
    primitives: 'src/primitives/index.ts',
    components: 'src/components/index.ts',
    patterns: 'src/patterns/index.ts',
    brand: 'src/brand/index.tsx',
    hooks: 'src/hooks/index.ts',
    utils: 'src/utils/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: false,
  splitting: true,
  outDir: 'lib',
  external: ['react', 'react-dom', 'styled-components', 'lucide-react', 'recharts'],
})
