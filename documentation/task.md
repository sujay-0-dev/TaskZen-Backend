# Full Stack Task Management App — Task Checklist

## Planning
- [x] Review requirements from assessment document
- [x] Design project structure and architecture
- [x] Write implementation plan

## Backend (Node.js + Express + MongoDB)
- [x] Initialize Node.js project with package.json
- [x] Install dependencies (express, mongoose, bcryptjs, jsonwebtoken, cookie-parser, cors, dotenv, express-validator, helmet, crypto-js)
- [x] Set up project folder structure
- [x] Create .env file (template)
- [x] Connect MongoDB (mongoose)
- [x] Create User model (name, email, password)
- [x] Create Task model (title, description, status, createdAt, userId)
- [x] Auth middleware (JWT via httpOnly cookies)
- [x] AES encryption middleware for sensitive payloads
- [x] Auth routes: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout
- [x] Task routes: GET /api/tasks, POST /api/tasks, GET /api/tasks/:id, PUT /api/tasks/:id, DELETE /api/tasks/:id
- [x] Add pagination, filter by status, search by title in task listing
- [x] Input validation with express-validator
- [x] Structured error handling middleware
- [x] Helmet + CORS security setup
- [x] Rate limiting
- [x] Added /api/auth/profile and /api/auth/change-password endpoints

## Frontend (React.js + Vite)
- [x] Initialize React project with Vite
- [x] Install dependencies (axios, react-router-dom, react-hook-form, react-toastify, lucide-react)
- [x] Set up project structure (components, pages, hooks, context, api)
- [x] Design system (CSS variables, typography, colors)
- [x] AuthContext (JWT state management)
- [x] ProtectedRoute component
- [x] API client (axios with credentials)
- [x] Login page (form, validation, error handling)
- [x] Register page
- [x] Dashboard page (task list, filters, search, pagination)
- [x] Create/Edit Task modal
- [x] Task card component
- [x] Responsive layout (mobile + desktop)
- [x] Loading states, toast notifications
- [x] 404 page
- [x] Landing page with hero, features, and CTA
- [x] User Profile page with name editing and password change

## Documentation
- [x] README.md with setup instructions and architecture
- [x] API request/response documentation
- [x] .env.example files

## Verification
- [x] Test all auth flows (register, login, logout)
- [x] Test all task CRUD operations
- [x] Test pagination, filtering, and search
- [x] Test protected routes (unauthorized access)
- [x] Test responsive design
- [x] Verify production build (0 errors)
- [x] Verify Landing and Profile page layouts

