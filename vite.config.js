import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  // optional but helpful
  optimizeDeps: {
    include: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
})