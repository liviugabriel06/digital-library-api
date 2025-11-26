import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import BookList from './pages/BookList';
import MyLoans from './pages/MyLoans';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/books" element={<BookList />} />

        <Route path="/login" element={<Login />} />

        <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roleRequired="ROLE_ADMIN">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* RUTA PROTEJATA: Doar Userii logati pot vedea imprumuturile */}
                <Route
                  path="/my-loans"
                  element={
                    <ProtectedRoute>
                      <MyLoans />
                    </ProtectedRoute>
                  }
                />

        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;