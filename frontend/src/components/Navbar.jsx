import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('auth_token');
    const isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top shadow-sm">
            <div className="container">
                {/* Logo cu iconita din Bootstrap Icons */}
                <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
                    <i className="bi bi-journal-album text-primary fs-4"></i>
                    Digital Library
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">

                        {/* BUTONUL THEME SCHIMBAT */}
                        <li className="nav-item me-3">
                            <button
                                onClick={toggleTheme}
                                className="btn btn-link nav-link"
                                style={{textDecoration: 'none'}}
                                title="Change Theme"
                            >
                                {theme === 'light' ? (
                                    <i className="bi bi-moon-stars-fill fs-5"></i>
                                ) : (
                                    <i className="bi bi-sun-fill fs-5 text-warning"></i>
                                )}
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
                                    <Link className="btn btn-primary btn-sm ms-2 px-3 rounded-pill" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm ms-3 rounded-pill px-3">
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