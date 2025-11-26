# ⚛️ Digital Library - Frontend Client

This is the client-side single-page application (SPA) built with **React** and **Vite**. It consumes the Backend API to provide a modern user interface.

## 🛠️ Technical Stack
* **Framework:** React 18
* **Build Tool:** Vite (Fast HMR)
* **Styling:** Bootstrap 5 (with Dark Mode support)
* **Routing:** React Router DOM
* **HTTP Client:** Axios

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI parts (Navbar, ProtectedRoute)
├── pages/           # Full pages (Home, Login, BookList, AdminDashboard)
├── App.jsx          # Main Router configuration
└── main.jsx         # Entry point (Bootstrap import)
```

## 🔑 Key Features Implementation

### 🛡️ Protected Routes
* We use a custom wrapper component <ProtectedRoute> to check for the auth_token in localStorage. If the token is missing or the role is insufficient, the user is redirected.

### 🌓 Dark Mode
* Implemented in Navbar.jsx. It toggles the data-bs-theme attribute on the <html> tag and saves the preference in localStorage.

### 📡 API Integration
* All backend calls are made using axios. The API URL is currently hardcoded to http://localhost:8080.
  
## ▶️ How to Run (Standalone)

```bash
# Install dependencies
npm install

# Start Development Server
npm run dev
```
The UI will be available at: http://localhost:5173.