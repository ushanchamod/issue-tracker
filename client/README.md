# Issue Tracker – Client

This is the frontend for the Issue Tracker application, built with React, TypeScript, Vite, and Tailwind CSS. It provides a modern, responsive user interface for managing issues, user authentication, and dashboard statistics.

## Features

- User registration and login
- Create, view, update, and delete issues
- Filter and search issues by status, priority, or keywords
- Dashboard with real-time statistics and charts
- Protected and guest routes for secure navigation
- Responsive UI with reusable components
- State management with Zustand
- Data fetching and caching with React Query
- Form validation with Zod and React Hook Form

## Main Pages

- **Login** – User authentication
- **Register** – New user registration
- **Dashboard** – View, filter, and manage issues; see statistics

## Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   - If needed, create a `.env` file in the `client` directory. Example:
     ```env
     VITE_API_URL=http://localhost:3000/api
     ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Preview the production build:**
   ```bash
   npm run preview
   ```

## Tech Stack

- **React** & **TypeScript** – UI and type safety
- **Vite** – Fast development and build tool
- **Tailwind CSS** – Utility-first CSS framework
- **Zustand** – State management
- **React Query** – Data fetching and caching
- **React Hook Form** & **Zod** – Form management and validation

---

For API details and backend setup, see the main project README and the `server/README.md`.
