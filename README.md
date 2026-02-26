# TaskFlow — Modern Full Stack Task Management

TaskFlow is a production-ready, security-first task management application built with the **MERN (MongoDB, Express, React, Node)** stack. It features a stunning glassmorphism UI, comprehensive JWT-based authentication, and enterprise-grade security practices.

---

## ✨ Features

### 💎 Premium Experience
- **Modern Landing Page**: High-conversion landing page with hero, features, stats, and call-to-action.
- **Glassmorphism UI**: A dark-themed, sleek design system using the Inter font for a premium feel.
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.

### 📋 Advanced Task Management
- **Smart Dashboard**: Visual stat cards for quick task overview.
- **Filtering & Search**: Debounced real-time search and status-based filtering (Todo, In Progress, Done).
- **Pagination**: Efficient server-side pagination for handling thousands of tasks.
- **CRUD 2.0**: Seamless creation, expansion, editing, and deletion of tasks with toast notifications.

### 🔐 Security & User Profiles
- **JWT Authentication**: Secure tokens stored in `httpOnly` cookies to mitigate XSS attacks.
- **AES-256 Encryption**: Encrypted sensitive data fields using standard cryptographic libraries.
- **Identity Management**: Editable user profiles with name, email, join date, and password change flows.
- **Rate Limiting**: Brute-force protection on all sensitive endpoints.

---

## 🛠️ Technology Stack

| Layer | Stack | Key Libraries |
|---|---|---|
| **Frontend** | React (Vite) | `lucide-react`, `react-router-dom`, `react-hook-form`, `axios`, `react-toastify` |
| **Backend** | Node.js (Express) | `jsonwebtoken`, `cookie-parser`, `helmet`, `bcryptjs`, `crypto-js`, `express-validator` |
| **Database** | MongoDB Atlas | `mongoose` |
| **Styling** | Vanilla CSS | Custom design tokens, glassmorphism, responsive utilities |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (for the database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task-Project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env based on .env.example
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create .env based on .env.example (pointing to backend URL)
   npm run dev
   ```

---

## 📂 Architecture

The project follows a clean **MVC (Model-View-Controller)** pattern on the backend and a **Component-based** architecture on the frontend.

- **Frontend Context**: `AuthContext.jsx` manages global user state and authentication persistence.
- **Backend Middleware**: Specialized handlers for Auth, Validation, Encryption, and Error Handling.
- **Database Indexing**: Compound indexing on `userId` and `title` for lightning-fast search performance.

---

## 📄 License

This project is licensed under the MIT License.

---

*Developed as part of a Technical Assessment.*
