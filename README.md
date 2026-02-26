# TaskFlow — Task Management Application

A production-ready **Full Stack Task Management Application** built with:
- 🚀 **Backend**: Node.js + Express.js + MongoDB
- ⚛️ **Frontend**: React.js (Vite)
- 🔐 **Auth**: JWT via httpOnly cookies + bcryptjs password hashing
- 🔒 **Security**: AES-256 encryption, Helmet, Rate Limiting, Input Validation
- 📡 **API**: RESTful API with Pagination, Filtering & Search

---

## Project Structure

```
Task-Project/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # authController, taskController
│   │   ├── middleware/       # auth (JWT), encryption (AES), validate, errorHandler
│   │   ├── models/          # User.js, Task.js (Mongoose)
│   │   └── routes/          # auth.js, tasks.js
│   ├── server.js            # Express app entry
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/             # axios client, auth.js, tasks.js
    │   ├── components/      # Navbar, TaskCard, TaskModal, ConfirmDialog, ProtectedRoute
    │   ├── context/         # AuthContext.jsx
    │   ├── hooks/           # useTasks.js
    │   ├── pages/           # LoginPage, RegisterPage, DashboardPage, NotFoundPage
    │   └── styles/          # global.css
    ├── .env.example
    └── index.html
```

---

## Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Environment Variables

### Backend `.env`
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | Token expiry (e.g., `7d`) |
| `AES_SECRET_KEY` | AES-256 encryption key (32 chars) |
| `CLIENT_URL` | Frontend URL for CORS |

### Frontend `.env`
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## API Documentation

### Authentication

#### `POST /api/auth/register`
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (201):**
```json
{ "success": true, "data": { "_id": "...", "name": "John Doe", "email": "john@example.com" } }
```
Sets `token` httpOnly cookie.

---

#### `POST /api/auth/login`
Login with email and password.

**Request:**
```json
{ "email": "john@example.com", "password": "password123" }
```
**Response (200):**
```json
{ "success": true, "data": { "_id": "...", "name": "John Doe", "email": "john@example.com" } }
```

---

#### `POST /api/auth/logout` *(protected)*
Clears the auth cookie.

#### `GET /api/auth/me` *(protected)*
Returns current user object.

---

### Tasks *(all protected)*

#### `GET /api/tasks`
List tasks with optional filters.

**Query Params:**
| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Per page (default: 10, max: 50) |
| `status` | string | `todo` \| `in-progress` \| `done` |
| `search` | string | Search by title (case-insensitive) |

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1, "totalPages": 3, "totalTasks": 27,
    "limit": 10, "hasNextPage": true, "hasPrevPage": false
  }
}
```

---

#### `POST /api/tasks`
Create a new task.

**Request:**
```json
{ "title": "Fix login bug", "description": "...", "status": "todo" }
```

#### `GET /api/tasks/:id`
Get a single task by ID.

#### `PUT /api/tasks/:id`
Update a task.

**Request:**
```json
{ "title": "Updated title", "status": "done" }
```

#### `DELETE /api/tasks/:id`
Delete a task.

**Response:**
```json
{ "success": true, "message": "Task deleted successfully." }
```

---

## Security Implementation

| Feature | Implementation |
|---|---|
| Password Hashing | bcryptjs with 12 salt rounds |
| Authentication | JWT stored in httpOnly, Secure, SameSite=Strict cookie |
| HTTP Security Headers | Helmet.js |
| Rate Limiting | express-rate-limit (20 req/15min on auth, 200 on API) |
| Payload Encryption | AES-256 via crypto-js |
| Input Validation | express-validator on all endpoints |
| Authorization | Users can only access their own tasks |
| CORS | Configured to only allow the frontend origin |

---

## Architecture

```
Client (React SPA)
     ↓ HTTPS + httpOnly Cookie (JWT)
Express.js Server
     ├── Helmet (security headers)
     ├── CORS (whitelist)
     ├── Rate Limiter
     ├── Cookie Parser
     ├── Auth Middleware (JWT verify)
     └── Routes
          ├── /api/auth → authController
          └── /api/tasks → taskController
                     ↓
               Mongoose ODM
                     ↓
               MongoDB Database
```
