import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // to import tailwind css
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],  //installing tailwindcss plugin
})
