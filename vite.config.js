import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  },
  build: {
    // Otimizações de memória para Three.js
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
          lottie: ['@lottiefiles/lottie-player']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
