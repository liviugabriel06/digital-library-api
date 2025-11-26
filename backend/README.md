# ☕ Digital Library - Backend API

This is the server-side application built with **Spring Boot**. It handles business logic, database interactions, and security.

## 🛠️ Technical Stack
* **Java:** 17 (LTS)
* **Framework:** Spring Boot 3.3.1
* **Database:** PostgreSQL (via Docker)
* **Security:** Spring Security (Basic Auth & CORS)
* **ORM:** Hibernate / Spring Data JPA
* **Tools:** Maven, Lombok

## 📂 Project Structure

The code is organized using a layered architecture:

```text
com.example.digitallibrary
├── config/          # SecurityConfig (CORS, Route protection)
├── controller/      # REST Endpoints (Handling HTTP Requests)
├── model/           # JPA Entities (Database Tables: Book, User, BorrowRecord)
├── repository/      # Interfaces for Database Access (SQL abstraction)
└── service/         # Business Logic (Validations, Calculations)
```

## ⚙️ Configuration

Database Connection
* The app connects to PostgreSQL on port 5432. Credentials are defined in src/main/resources/application.properties:

* URL: jdbc:postgresql://localhost:5432/digitallibrary

* User: postgres

* Pass: postgres

## ▶️ How to Run (Standalone)
You can run the backend independently using Maven:

```bash

# Clean and Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```