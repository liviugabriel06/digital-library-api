Set-Content -Path README.md -Value @'
# 📚 Digital Library API

This is the final project for the Java Development course. It is a REST API application built with **Spring Boot** designed to manage a digital library system. It handles book inventory, user authentication, and the borrowing process.

## 🛠️ Tech Stack
* **Java 17+**
* **Spring Boot 3** (Web, Data JPA, Security, Validation)
* **PostgreSQL** (Database)
* **Docker** (Database Containerization)
* **Maven** (Dependency Management)

## 🚀 How to Run

### 1. Start the Database
Ensure Docker is installed and running. Execute the following command to start the PostgreSQL container:

```bash
docker run --name digital-library-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=digitallibrary -p 5432:5432 -d postgres

2. Run the Application
Open the project in IntelliJ IDEA and run the DigitalLibraryApplication class. The API will be available at http://localhost:8080.

🔑 Security & Accounts
The application uses Basic Authentication. Users must register first to access the system.

Steps to test:
Register an Admin: Send a POST to /auth/register with role: "ROLE_ADMIN".

Register a User: Send a POST to /auth/register with role: "ROLE_USER".

Login: Use the registered username/password in Postman (Authorization -> Basic Auth).

Role    Permissions
ADMIN   Can add, update, and delete books. Can view all books.
USER    Can borrow and return books. Can view borrowing history.

📡 API Endpoints
👤 Authentication

Method      URL                     Description
POST        /auth/register          Register a new user (Body: username, password, role)

📚 Books (Inventory)

Method      URL                     Description                                             Access
GET         /books                  List books (Filters: ?author=X, ?available=true)        Public
POST        /books                  Add a new book                                          Admin
PUT         /books/{id}             Update book details/stock                               Admin
DELETE      /books/{id}             Delete a book (only if not borrowed)                    Admin

📖 Borrowing System

Method      URL                     Description                                             Access
POST        /borrow/{bookId}        Borrow a book                                           User/Admin
PUT         /borrow/return/{id}     Return a book (using BorrowRecord ID)                   User/Admin
GET         /borrow/my-history      View personal borrowing history                         User/Admin
GET         /borrow/my-active       View currently active loans                             User/Admin

Created by Liviu Gabriel '@ -Encoding UTF8