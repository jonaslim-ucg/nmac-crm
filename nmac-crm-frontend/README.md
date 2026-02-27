# NMAC CRM Frontend

React + TypeScript + Vite frontend for NMAC CRM. Dependencies are installed into this project’s `node_modules/` (no separate environment needed).

## Local setup

1. **Node version** (optional but recommended): Use Node 20. If you use [nvm](https://github.com/nvm-sh/nvm), run:
   ```bash
   nvm use
   ```
   (An `.nvmrc` file is included.)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment:** Create a `.env` file in the project root with:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```
   Use your real API URL for production.

4. **Run the dev server:**
   ```bash
   npm run dev
   ```
   App: http://localhost:5173

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

See **README.txt** for full project overview, tech stack, and structure.
