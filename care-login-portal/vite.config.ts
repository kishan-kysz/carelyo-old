import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import dns from 'dns'
// https://vitejs.dev/config/

dns.setDefaultResultOrder('verbatim')
export default defineConfig({
  server: {
    open: true,
    port: 5510
  },

  plugins: [
    react(),
    svgrPlugin(),
    visualizer({
      emitFile: true
    })
  ]
})
