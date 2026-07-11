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
- Pagination support for book listing
- Aggregation — most borrowed books and books by category
- Redis caching for frequently accessed data
- Rate limiting — 100 requests per 15 minutes globally, 5 login attempts per 15 minutes

## Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- Redis (ioredis)
- express-rate-limit

## API Endpoints

### Auth
- POST /api/auth/signup
- POST /api/auth/login (rate limited — 5 attempts per 15 min)

### Books
- GET /api/books (public, supports pagination ?page=1&limit=10)
- GET /api/books/getBooksByCategory (public)
- POST /api/books/add (admin only)
- PATCH /api/books/:id (admin only)
- DELETE /api/books/:id (admin only)

### Borrow
- POST /api/borrow/borrow (member)
- PATCH /api/borrow/:id/return (member)
- GET /api/borrow/history (member)
- GET /api/borrow/most-borrowed (public)

## Setup
1. Clone the repository
2. Install Redis: sudo apt install redis-server
3. Start Redis: sudo service redis start
4. Run npm install
5. Create .env file with MONGO_URI, JWT_SECRET, PORT
6. Run npm run dev
