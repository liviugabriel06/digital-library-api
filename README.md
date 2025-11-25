# 📚 Digital Library API

**Digital Library API** is a robust RESTful backend service built with **Spring Boot 3**. It simulates a real-world library management system, featuring secure user authentication, role-based access control, and comprehensive inventory management with automatic stock tracking.

---

## 🌟 Key Features

* **Smart Stock Management:** The system distinguishes between `Total Copies` and `Available Copies`. Borrowing a book automatically decrements the available stock.
* **Transactional Integrity:** Uses `@Transactional` to ensure data consistency during borrowing and returning processes.
* **Validation Rules:**
    * Cannot borrow if stock is 0.
    * Cannot delete a book if it is currently borrowed.
    * Duplicate active loans for the same book are prevented.
* **Advanced Filtering:** Search books by Author, Genre, Year, or Availability status.

---

## 🛠️ Tech Stack

|      Component       |                Technology                |
|:--------------------:|:----------------------------------------:|
|     **Language**     |       Java 17 (JDK 21 compatible)        |
|    **Framework**     | Spring Boot 3 (Web, Data JPA, Security)  |
|     **Database**     |              PostgreSQL 18               |
| **Containerization** |                  Docker                  |
|    **Build Tool**    |                  Maven                   |
|     **Security**     |      Basic Authentication (BCrypt)       |




---




## 🚀 Setup & Execution

### 1. Database Configuration
The application relies on a PostgreSQL database running in a Docker container.

**Run the following command to start the DB:**
```bash
docker run --name digital-library-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=digitallibrary -p 5432:5432 -d postgres
```

### 2. Running the Application
1. Open the project in IntelliJ IDEA.

2. Locate DigitalLibraryApplication.java.

3. Run the class. The server will start on port 8080.

## 🔐 Security & User Roles
The API is secured using Basic Authentication. You must register users first to interact with the protected endpoints.


|  Role  | Username |         Password          |                         Access Level                          |
|:------:|:--------:|:-------------------------:|:-------------------------------------------------------------:|
| Admin  |  Admin   |       (your choice)       |           Full Control <br/>(Inventory Management)            |
|  User  | student  |       (your choice)       | Restricted <br/>(Borrowing, Returning,<br/> Searching and History) |

---

## 📡 API Endpoints
### 1. Authentication
|  Method  |    Endpoint    |                                Description                                |  Access   |
|:--------:|:--------------:|:-------------------------------------------------------------------------:|:---------:|
|  `POST`  | `/auth/register` | Register a new account. <br/> Body requiers: `username`, `password` and `role`. | 🌍 Public |


### 2. Book Management (Inventory)

Inventory endpoints for listing and managing books.

|  Method  |   Endpoint    |                                      Description                                       |  Access   |
|:--------:|:-------------:|:--------------------------------------------------------------------------------------:|:---------:|
|  `GET`   |   `/books`    | List all books. <br/> Supports filters: `?author=X`, `?year=2023`, `?available=true`.  | 🌍 Public |
|  `GET`   | `/books/{id}` |                            Get details of a specific book.                             | 🌍 Public |
|  `POST`  |   `/books`    |                            Add a new book to the inventory.                            | 🔒 Admin  |
|  `PUT`   | `/books/{id}` |                          Update book details or total stock.                           | 🔒 Admin  |
| `DELETE` | `/books/{id}` |                    Remove a book (Validates if currently borrowed).                    | 🔒 Admin  |



### 3. Borrowing System
Core business logic for loaning and returning items.


| Method |       Endpoint        |                        Description                        |     Access     |
|:------:|:---------------------:|:---------------------------------------------------------:|:--------------:|
| `POST` |  `/borrow/{bookId}`   |         Borrow a book. Decreases available stock.         | 🔒 User/Admin  |
| `PUT`  | `/borrow/return/{id}` | Return a book using the BorrowRecord ID. Increases stock. | 🔒 User/Admin  |
| `GET`  | `/borrow/my-history`  |  View complete borrowing history for the logged-in user.  | 🔒 User/Admin  |
| `GET`  |  `/borrow/my-active`  |  View currently active loans (books not yet returned).    | 🔒 User/Admin  |


