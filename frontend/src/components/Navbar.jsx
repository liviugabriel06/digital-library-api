import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    // Verificam daca exista token ca sa stim daca e logat
    const isLoggedIn = !!localStorage.getItem('auth_token');
    // Verificam daca e admin
    const isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';

    const handleLogout = () => {
        // STERGEM TOT din memoria browserului
        localStorage.removeItem('auth_token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');

        // Redirectionam la login
        navigate('/login');
        // Fortam un refresh scurt ca sa se actualizeze meniul
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">📚 Digital Library</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link" to="/books">Books</Link>
                        </li>

                        {/* Aratam My Loans doar daca e logat */}
                        {isLoggedIn && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/my-loans">My Loans</Link>
                            </li>
                        )}

                        {/* Aratam Admin Panel DOAR daca e ADMIN */}
                        {isLoggedIn && isAdmin && (
                            <li className="nav-item">
                                <Link className="nav-link text-warning fw-bold" to="/admin">Admin Panel</Link>
                            </li>
                        )}

                        {/* Logica Login/Logout */}
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