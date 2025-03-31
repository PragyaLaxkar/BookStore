# BookStore - Full Stack Book Selling Website

A modern book-selling website built with React.js, Node.js, Express.js, and MongoDB.

## Features
- Homepage with featured books and search functionality
- Book listing with category filters
- Book details page with reviews
- Shopping cart functionality
- Checkout system
- Admin panel for book and order management

## Tech Stack
- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT

## Project Structure
```
bookstore/
├── frontend/          # React frontend application
└── backend/          # Node.js + Express backend API
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with required environment variables
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```
