import path from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  // Load .env from repo root (nmac-crm/.env) so one file serves both API and frontend
  envDir: path.resolve(import.meta.dirname, '..'),
})