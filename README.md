# Task Manager - Full-Stack MERN Application

Welcome to the Task Manager, a full-stack MERN application built for managing tasks efficiently. This document provides a detailed project demo structure to showcase the app when hosted.

---

## ✨ Key Features

### Frontend (React + Vite)
- **User Authentication:** Secure sign-up and login.
- **Task Management:** Full CRUD functionality.
- **Task Filtering & Searching:** Filter tasks by title, description, or priority.
- **Status Toggling:** Mark tasks as complete/pending.
- **User Profile Management:** View/update profile and change passwords.
- **Performance Dashboard:** Visual representation of task completion.
- **Responsive Design:** Works seamlessly on all devices.
- **Protected Routes:** Only authenticated users can access the dashboard.

### Backend (Node.js + Express)
- **RESTful API:** For managing users and tasks.
- **JWT Authentication:** Secure endpoints with access and refresh tokens.
- **Password Hashing:** bcrypt used for secure password storage.
- **Validation:** Server-side validation with express-validator.
- **Modular Architecture:** Organized into controllers, models, routes, and middleware.
- **Custom Error Handling:** Standardized API responses.

---

## 🚀 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | React, Vite, React Router, Axios, Tailwind CSS |
| Backend  | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth     | JWT, bcrypt |
| Deployment | Render (or any similar platform) |

---

## 📁 Project Structure

```
frontend/  # React client
├── src/
│   ├── api/          # API service layer
│   ├── components/   # Reusable components
│   ├── pages/        # Page components (Home, Login, Signup)
│   └── utils/        # Client utilities and validation
└── package.json

backend/   # Node.js server
├── src/
│   ├── controllers/  # Request handling logic
│   ├── db/           # Database connection
│   ├── middlewares/  # Auth & error handling
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── utils/        # Helper functions
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Prince7reigns/AdihaOne-Interview-Project-n.git
cd AdihaOne-Interview-Project-n
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file:
```
PORT=8000
MONGO_URL="your_mongodb_connection_string"
DB_NAME="taskmanag"
ACCESS_TOKEN_SECRET="your_access_token_secret"
ACCESS_TOKEN_EXPIRY="1d"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
REFRESH_TOKEN_EXPIRY="10d"
```
Start backend server:
```bash
npm run dev
```
Server runs at [http://localhost:8000](http://localhost:8000)

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
App runs at [http://localhost:5173](http://localhost:5173)

---

## 🔧 API Endpoints
All task-related routes require JWT authentication.

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | /api/v1/auth/signup | Register new user |
| POST   | /api/v1/auth/login | Login user |
| POST   | /api/v1/auth/logout | Logout user |
| PUT    | /api/v1/auth/change-password | Change password |
| PUT    | /api/v1/auth/update-user | Update profile |
| GET    | /api/v1/tasks/gp | Get all tasks |
| POST   | /api/v1/tasks/gp | Create new task |
| GET    | /api/v1/tasks/:id/gp | Get task by ID |
| PUT    | /api/v1/tasks/:id/gp | Update task |
| DELETE | /api/v1/tasks/:id/gp | Delete task |
| POST   | /api/v1/tasks/:id/gp | Toggle task completion |

**Backend Host:** [https://task-manager-fbg3.onrender.com](https://task-manager-fbg3.onrender.com)

---

## 👤 Author
**Prince Yadav**  
GitHub: [@Prince7reigns](https://github.com/Prince7reigns)

---

## 🎬 Demo Link (Dummy Data)

App : [Task Manager App](https://task-manager-app-six-brown.vercel.app/)

