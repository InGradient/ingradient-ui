import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router', 'react-router-dom'],
          charts: ['recharts'],
          styling: ['styled-components', 'lucide-react'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3002,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3002,
    strictPort: true,
  },
})
