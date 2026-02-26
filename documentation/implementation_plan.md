# Full Stack Task Management App — Implementation Plan

Build a production-ready **Task Management Application** with JWT authentication (httpOnly cookies), CRUD task operations with pagination/filtering/search, AES payload encryption, and a modern React frontend — using Node.js, Express, MongoDB, and Vite.

---

## Project Structure

```
Task-Project/
├── backend/
│   ├── src/
│   │   ├── config/       # DB connection, env config
│   │   ├── controllers/  # auth, task controllers
│   │   ├── middleware/   # auth, encryption, error, validation
│   │   ├── models/       # User, Task mongoose schemas
│   │   ├── routes/       # auth, task routes
│   │   └── utils/        # helpers (crypto, response formatter)
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/          # axios client + endpoint calls
    │   ├── components/   # reusable UI (TaskCard, Modal, Navbar, etc.)
    │   ├── context/      # AuthContext
    │   ├── hooks/        # useTasks, useAuth
    │   ├── pages/        # Login, Register, Dashboard, NotFound
    │   ├── routes/       # ProtectedRoute, AppRouter
    │   └── styles/       # global CSS, design tokens
    ├── .env.example
    ├── vite.config.js
    └── package.json
```

---

## Backend

### Security & Architecture
- JWT stored in **httpOnly, Secure, SameSite=Strict** cookies (not localStorage)
- Passwords hashed with **bcryptjs** (salt rounds 12)
- Sensitive payload fields (task title, desc) optionally **AES-256 encrypted** via `crypto-js`
- **helmet** for HTTP security headers
- **express-rate-limit** on auth endpoints
- **express-validator** for input sanitization
- Structured JSON error responses with proper HTTP status codes
- All secrets from `.env` — never hardcoded

### Models
**User**: `{ name, email (unique), password (hashed), createdAt }`  
**Task**: `{ title, description, status (enum: todo/in-progress/done), userId (ref: User), createdAt, updatedAt }`

### API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Register new user | ✗ |
| POST | `/api/auth/login` | Login, set cookie | ✗ |
| POST | `/api/auth/logout` | Clear cookie | ✓ |
| GET | `/api/auth/me` | Get current user | ✓ |
| GET | `/api/tasks` | List tasks (page, limit, status, search) | ✓ |
| POST | `/api/tasks` | Create task | ✓ |
| GET | `/api/tasks/:id` | Get single task | ✓ |
| PUT | `/api/tasks/:id` | Update task | ✓ |
| DELETE | `/api/tasks/:id` | Delete task | ✓ |

---

## Frontend

### Design System
- CSS custom properties for colors, spacing, typography
- Google Fonts: **Inter**
- Dark-mode-first with glassmorphism cards
- Smooth transitions and hover micro-animations
- Fully responsive (mobile-first grid)

### Pages & Components
- **LoginPage / RegisterPage** — form validation with react-hook-form, error toasts
- **DashboardPage** — task list with filter tabs (All/Todo/In-Progress/Done), search bar, pagination
- **TaskCard** — status badge, edit/delete actions, hover animations
- **TaskModal** — create/edit task with form validation
- **ProtectedRoute** — redirects unauthenticated users to login
- **AuthContext** — global auth state with `useContext`

---

## Verification Plan

### Automated (via Browser Subagent)
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to `http://localhost:5173`
4. Test: Register → Login → Create Task → Edit Task → Delete Task → Filter → Search → Logout

### API Testing (curl)
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Password123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@test.com","password":"Password123!"}'

# Get tasks
curl http://localhost:5000/api/tasks -b cookies.txt
```

### Manual Checks
- Verify httpOnly cookie is set after login (DevTools → Application → Cookies)
- Verify unauthorized access to `/api/tasks` returns 401
- Verify responsive layout on mobile viewport
