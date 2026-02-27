NMAC CRM – FRONTEND APPLICATION

## Live / Deploy
Set VITE_API_BASE_URL in .env to your API URL (e.g. your backend or Render/Heroku URL).

## Project overview
This is the frontend application for NMAC CRM.
It is built using modern technologies for performance, scalability, and a clean user experience.
The application connects to the NMAC CRM backend API for dynamic data management.

## Technologies used
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Redux (state management)
- React Router
- React Hook Form + Zod (form validation)
- Recharts (charts & analytics)
- SweetAlert2 & React Toastify (notifications)

## How to run the project
1. Open the project folder in a terminal.
2. (Optional) Use the same Node version: run "nvm use" if you have nvm; .nvmrc specifies Node 20.
3. Install dependencies:
   npm install
4. Create a .env file in the root folder and add:
   VITE_API_BASE_URL=http://localhost:8000
   (Use your actual API URL in production.)
5. Start the development server:
   npm run dev

The application will run at:
http://localhost:5173

## Build for production
To create a production build:
  npm run build
To preview the production build:
  npm run preview

## Project structure
src/
 ├── assets/         # Images and static files
 ├── components/     # Reusable components
 ├── pages/          # Page components
 ├── routes/         # Routing configuration
 ├── redux/          # Store, API services, hooks
 └── App.tsx

## Backend API
The frontend connects to the URL set in VITE_API_BASE_URL (default: http://localhost:8000 for local development).

## Notes
- Node.js v18 or later is recommended.
- Internet connection is required to connect to the backend API when not running locally.
- Do not commit or share the .env file publicly.
