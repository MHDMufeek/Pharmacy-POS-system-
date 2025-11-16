# Pharmacy POS — Backend

This folder contains a simple Express + Mongoose backend scaffold for the Pharmacy POS system.

Quick start

1. Copy `.env.example` to `.env` and edit the values (MongoDB URI, JWT secret).

2. Install dependencies and start in development mode (PowerShell):

```powershell
cd backend
npm install
npm run dev
```

3. Server will run on port from `PORT` in `.env` (default 3000).

Implemented endpoints (initial)

- POST /api/auth/login  — login with { email, password }
- POST /api/auth/register — register new user (for testing)
- GET  /api/capabilities/users — get users list
- GET  /api/capabilities/assignments — get users with capabilities
- POST /api/capabilities/assign — assign a capability to a user (requires admin role)

Notes
- This scaffold uses MongoDB via Mongoose. For production use, provide a production MongoDB URI.
- On first run the server will create a seeded admin account if one doesn't exist (email: admin@local, password: Admin123!).
