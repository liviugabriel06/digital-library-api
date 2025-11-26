import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('auth_token');
    const isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';

    // --- LOGICA DARK MODE ---
    // Citim din memorie sau setam 'light' ca default
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        // Aici se intampla magia: Bootstrap schimba automat culorile
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };
    // ------------------------

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">📚 Digital Library</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">

                        {/* BUTONUL DARK MODE */}
                        <li className="nav-item me-3">
                            <button
                                onClick={toggleTheme}
                                className="btn btn-sm btn-outline-secondary rounded-circle"
                                style={{width: '40px', height: '40px', fontSize: '1.2rem'}}
                                title="Toggle Theme"
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/books">Books</Link>
                        </li>

                        {isLoggedIn && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-loans">My Loans</Link>
                            </li>
                        )}

                        {isLoggedIn && isAdmin && (
                            <li className="nav-item">
                                <Link className="nav-link text-warning fw-bold" to="/admin">Admin Panel</Link>
                            </li>
                        )}

                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link btn btn-primary text-white ms-2" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button onClick={handleLogout} className="btn btn-danger btn-sm ms-3">
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;