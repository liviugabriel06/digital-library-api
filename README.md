# 📚 Digital Library - Full Stack Application

**Digital Library** is a comprehensive Full Stack web application designed to simulate a real-world library management system. It features a robust Java Spring Boot backend, a modern React frontend, and a PostgreSQL database, all containerized for easy deployment.

The application manages the entire lifecycle of library operations: book inventory, user authentication, borrowing/returning workflows, and administrative oversight.

---

## 🌟 Key Features

### 🎨 Frontend (React + Bootstrap)
* **Modern UI/UX:** Responsive design that works perfectly on Desktop and Mobile.
* **🌗 Dark Mode Support:** Built-in theme switcher (Light/Dark) for better accessibility.
* **Visual Inventory:** Books are displayed with cover images fetched from URLs.
* **Authentication System:** Secure Login and Registration pages with role-based redirection.
* **Dynamic Dashboard:**
  * **Public View:** Browse the book catalog with search filters.
  * **User View:** Borrow books and manage personal active loans.
  * **Admin View:** Exclusive access to the Admin Dashboard with Sidebar navigation.

### ⚙️ Backend (Spring Boot + PostgreSQL)
* **Smart Stock Management:** Automatically tracks `Total Copies` vs. `Available Copies`.
* **Transactional Integrity:** Uses `@Transactional` to ensure data consistency.
* **Validation Rules:** Prevents borrowing if stock is 0 or deleting books with active history.
* **Secure API:** REST endpoints protected by Basic Authentication and Role-Based Access Control (RBAC).

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React (Vite)** | Modern JavaScript library for building UI |
| **Styling** | **Bootstrap 5** | Responsive CSS framework |
| **Backend** | **Java 17** | Core programming language |
| **Framework** | **Spring Boot 3** | Web, Data JPA, Security, Validation |
| **Database** | **PostgreSQL 15** | Relational database management system |
| **DevOps** | **Docker** | Containerization for the database |
| **Build Tools** | **Maven & npm** | Dependency management and build automation |

---

---


## 🚀 Setup & Execution

### 1. Database Configuration
The application relies on a PostgreSQL database running in a Docker container.

**Run the following command to start the DB:**
```bash
docker run --name digital-library-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=digitallibrary -p 5432:5432 -d postgres
```

### 2. Backend Setup (Java)

1. Open the project in IntelliJ IDEA.
2. Navigate to the backend folder.
3. Run DigitalLibraryApplication.java.
4. The API will start on http://localhost:8080.


### 3. Frontend Setup (React)

1. Open a terminal in the frontend folder.
2. Install dependencies (first time only).

```bash
npm install
```

3. Start the development server.

```bash
npm run dev
```


## 🔐 Security & User Roles
The API is secured using Basic Authentication. You must register users first to interact with the protected endpoints.


| Role | Access Level | Capabilities |
|:-----|:-------------|:-------------|
|Admin| Full Control |  • Add, Edit, Delete Books </br> • Manage Inventory & Stock </br>• View All Loans |
|User|Restricted|   • View Book Catalog </br> • Borrow Books </br> • Return Books </br> • View Personal History|


How to create accounts: Use the Register page in the application.
* Select "Student(User)" for a standard account.
* Select "Librarian(Admin)" to access administrative features.
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


---

## 📂 Project Structure

The repository is organised as a Monorepo:

```bash
digital-library/
├── backend/           # Spring Boot Application (Source Code, pom.xml)
├── frontend/          # React Application (Source Code, package.json)
└── README.md          # Documentation
```

---

### 🎓 Academic Context

This project was developed as a Final Project for the Java Development Course. It successfully implements all required specifications:

* CRUD Operations

* Authentication & Security

* Database Integration

* RESTful Architecture

Additionally, the project was expanded with a complete React Frontend, dynamic stock management logic, and an intuitive user interface.