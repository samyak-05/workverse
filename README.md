# LinkedIn Clone (Workverse)

A full-stack MERN social networking project (LinkedIn-like) with user auth, posts, connections, notifications, and real-time features using Socket.IO.

## Repository Structure

- `backend/` — Express API, MongoDB models, controllers, routes
- `frontend/` — React + Vite frontend, Tailwind CSS

## Features

- User signup / signin with JWT stored in HttpOnly cookie
- Create, read, update posts
- Connect with other users (network)
- Notifications and real-time updates via Socket.IO
- Profile editing and image uploads (Cloudinary)

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Socket.IO
- Frontend: React, Vite, Tailwind CSS, Axios

## Prerequisites

- Node.js (16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

## Environment Variables

Create a `.env` in `backend/` with at least:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `PORT` — backend port (optional)
- `NODE_ENV` — `development` or `production`
- Cloudinary (if used): `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

For the frontend, set `VITE_SERVER_URL` in `.env` (e.g. `VITE_SERVER_URL=http://localhost:4000`). See [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx#L1).

## Setup & Run (Development)

1. Backend

```bash
cd backend
npm install
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open frontend at the Vite dev URL (usually `http://localhost:5173`). The backend default port is `4000`.

## Important Notes

- Cookies & Authentication: The server sends the auth token as an HttpOnly cookie. API requests from the frontend must include credentials. In axios calls this requires `withCredentials: true` in the request config (third argument for `post`, second for `get`). Example usage in the app:

- Sign-out fix: ensure the client sends credentials when calling signout. See [frontend/src/components/Navbar.jsx](frontend/src/components/Navbar.jsx#L1) where the signout POST must be called as:

```js
axios.post(serverUrl + "/api/auth/signout", {}, { withCredentials: true })
```

This ensures the browser sends the cookie and the server can clear it.

- CORS: Backend allows credentials from the frontend origin. Confirm [backend/index.js](backend/index.js#L1) origin matches your frontend dev URL (`http://localhost:5173`).

## API (high-level)

- `POST /api/auth/signup` — create account
- `POST /api/auth/signin` — login (sets cookie)
- `POST /api/auth/signout` — clears cookie
- `GET /api/user/currentuser` — get logged-in user (requires cookie)
- `GET /api/user/search?query=` — search users
- `GET /api/post/getpost` — fetch posts

See controllers in `backend/controllers/` and routes in `backend/routes/` for full details.

## Troubleshooting

- If after signing out you are redirected to signin but a reload brings you back to home, ensure:
  - The frontend request uses `withCredentials: true` (see sign-out fix above).
  - Backend cookie is cleared with matching options: `httpOnly: true`, `secure` set to `process.env.NODE_ENV === 'production'`, and `sameSite` consistent with how the cookie was set (this project uses `sameSite: 'lax'`). Check [backend/controllers/authControllers.js](backend/controllers/authControllers.js#L1).

- Clear browser cookies and retry if behavior persists.

## Contributing

Feel free to open issues or submit PRs. Keep changes focused and document any API updates.

---
Created for educational purposes.
