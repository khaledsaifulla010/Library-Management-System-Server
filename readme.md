# 📚 Library Management System Server

### A Library Management System API built using **Express**, **TypeScript**, and **MongoDB (Mongoose)**. This API allows managing books, borrowing operations, and provides robust validation, filtering, and reporting capabilities.

---

## 📚 Project Overview

### This Library Management System enables the creation, retrieval, update, deletion, and borrowing of books in a library. Key business rules such as copy availability and due date tracking are enforced at the data layer using **Mongoose validation, middleware, static methods, and aggregation pipelines**.

---

## 🚀 Features

- 📘 Add, retrieve, update, and delete books
- 🔍 Filter and sort books by genre and date
- 🧾 Borrow books with copy control and due date
- 📈 Aggregate reports on borrowed books
- ✅ Schema validation with meaningful error messages
- 🧠 Mongoose middlewares, statics, and instance methods
- 🔒 Business logic enforcement (e.g., copy deduction)

---

## 🧱 Technologies Used

- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **REST API architecture**
- **Vercel**

---

## 📌 API Endpoints Summary

### 📘 Book Endpoints

| Method | Endpoint             | Description                        | Request Body                                                             |
| ------ | -------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| POST   | `/api/books`         | Create a new book                  | `title`, `author`, `genre`, `isbn`, `description`, `copies`, `available` |
| GET    | `/api/books`         | Get all books (with filter & sort) | – Query params: `filter`, `sortBy`, `sort`, `limit`                      |
| GET    | `/api/books/:bookId` | Get a book by ID                   | –                                                                        |
| PUT    | `/api/books/:bookId` | Update book details (e.g., copies) | Partial update (e.g., `{ "copies": 10 }`)                                |
| DELETE | `/api/books/:bookId` | Delete a book by ID                | –                                                                        |

---

### 🔄 Borrow Endpoints

| Method | Endpoint      | Description                                         | Request Body                  |
| ------ | ------------- | --------------------------------------------------- | ----------------------------- |
| POST   | `/api/borrow` | Borrow a book (validates quantity and availability) | `book`, `quantity`, `dueDate` |
| GET    | `/api/borrow` | Get aggregated summary of borrowed books per title  | –                             |

## 🧰 Prerequisites

- Node.js ≥ 18.x
- MongoDB instance (local or Atlas)

## ⚙️ Configuration

Create a `.env` file at the root:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/librarydb
```

## 🛠️ Installation Steps

```bash
# Clone the repository
git clone https://github.com/khaledsaifulla010/Library-Management-System-Server.git
cd library-management-system-server

# Install dependencies
npm install

# Build the project
npm run build

# Start in production mode
npm start

# OR run in development mode
npm run dev
```

<p align="center"><strong>✅ Done with passion and precision by **Khaled Saifulla** .</strong></p>
