# Issue Tracker – Server

This is the backend API for the Issue Tracker application. It provides RESTful endpoints for user authentication, issue management, filtering, and statistics, using Node.js, Express, and MongoDB.

## Features

- **User Authentication:** Secure registration and login using JWT and bcrypt for password hashing.
- **Issue Management:** Create, read, update, and delete issues via RESTful API endpoints.
- **Filtering & Search:** Query issues by status, priority, or keywords using efficient backend filtering.
- **Statistics:** Aggregates and serves real-time statistics for the dashboard.
- **Validation & Error Handling:** All input is validated on the server using Zod, with consistent error responses.
- **Protected Routes:** Middleware restricts access to authenticated users where required.

## API Routes

All routes are prefixed with `/api`.

### User Routes (`/api/user`)

| Method | Endpoint      | Description                                |
| ------ | ------------- | ------------------------------------------ |
| POST   | `/register`   | Register a new user                        |
| POST   | `/login`      | Log in a user and receive a JWT cookie     |
| POST   | `/logout`     | Log out the current user                   |
| GET    | `/me`         | Get the current user's profile             |
| PUT    | `/me`         | Update the current user's profile          |
| GET    | `/my-issues`  | Get all issues created by the current user |
| GET    | `/statistics` | Get statistics for the current user        |

### Issue Routes (`/api/issue`)

| Method | Endpoint    | Description                                |
| ------ | ----------- | ------------------------------------------ |
| POST   | `/`         | Create a new issue (authenticated)         |
| GET    | `/:issueID` | Get a specific issue by ID (authenticated) |
| PATCH  | `/:issueID` | Update an issue by ID (authenticated)      |
| DELETE | `/:issueID` | Delete an issue by ID (authenticated)      |

## Setup & Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the `server` directory with the following variables:

   ```env
   PORT=3000
   DATABASE_URL=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=client_url
   NODE_ENV=development_or_production
   ```

3. **Run in development mode:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Start the production server:**
   ```bash
   npm start
   ```

## Tech Stack

- **Node.js** & **Express** – REST API server
- **MongoDB** & **Mongoose** – Database and ODM
- **JWT** & **bcryptjs** – Authentication and password security
- **Zod** – Input validation
- **TypeScript** – Type safety

---

For more details on API usage, see the route files in `src/routes/` and controller logic in `src/controllers/`.
