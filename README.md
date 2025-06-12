# Library Management System

A full-stack library management system built with React, Node.js, Express, and MongoDB.

## Features

- Add new books to the library
- View all books in the library
- Search books by title, author, or ISBN
- Borrow and return books
- Track book status and borrower information

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd library-system
```

2. Install backend dependencies:
```bash
cd Backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../Frontend
npm install
```

4. Create a `.env` file in the Backend directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/library_system
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
cd Backend
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd Frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book
- `GET /api/books/search?query=<search-term>` - Search books
- `PATCH /api/books/:id/borrow` - Borrow a book
- `PATCH /api/books/:id/return` - Return a book
- `DELETE /api/books/:id` - Delete a book

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose 