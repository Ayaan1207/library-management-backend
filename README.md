# Library Management System API

A RESTful backend API for managing a library system built with Node.js, Express.js and MongoDB.

## 🌐 Live API
https://library-management-backend-production-d4ce.up.railway.app

## Features
- User authentication (signup/login) with JWT tokens
- Role based access control (admin/member)
- Book management — admins can add, update and delete books
- Members can borrow and return books
- Book availability tracked automatically when borrowed/returned
- Borrowing history for each member

## Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

## API Endpoints

### Auth
- POST /api/auth/signup
- POST /api/auth/login

### Books
- GET /api/books (public)
- POST /api/books/add (admin only)
- PATCH /api/books/:id (admin only)
- DELETE /api/books/:id (admin only)

### Borrow
- POST /api/borrow/borrow (member)
- PATCH /api/borrow/:id/return (member)
- GET /api/borrow/history (member)

## Setup
1. Clone the repository
2. Run npm install
3. Create .env file with MONGO_URI, JWT_SECRET, PORT
4. Run npm run dev
