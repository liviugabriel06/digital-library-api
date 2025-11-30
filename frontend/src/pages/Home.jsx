import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    // Verificam daca utilizatorul este logat si ce rol are
    const isLoggedIn = !!localStorage.getItem('auth_token');
    const userRole = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    return (
        // Container-ul Flex care centreaza totul vertical si orizontal
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>

            {/* Cardul Principal */}
            <div className="p-5 bg-body-tertiary rounded-4 shadow border text-center" style={{ maxWidth: '700px', width: '100%' }}>

                {/* Emoji decorativ sau Iconita */}
                <div className="mb-4" style={{ fontSize: '4rem' }}>
                    📚
                </div>

                <h1 className="display-5 fw-bold mb-3">
                    {isLoggedIn ? `Welcome back, ${username}!` : 'Digital Library'}
                </h1>

                <p className="lead text-muted mb-4">
                    Your gateway to knowledge. Manage loans, check inventory, and explore our vast collection of books efficiently and securely.
                </p>

                <div className="d-flex justify-content-center gap-3">
                    {/* Butonul Browse Books e util pentru toata lumea */}
                    <Link to="/books" className="btn btn-primary btn-lg px-4 shadow-sm">
                        Browse Books
                    </Link>

                    {/* LOGICA BUTOANELOR DINAMICE */}
                    {!isLoggedIn ? (
                        // Daca NU e logat -> Arata Login
                        <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
                            Login
                        </Link>
                    ) : (
                        // Daca E logat -> Arata butoane utile in functie de rol
                        <>
                            {userRole === 'ROLE_USER' && (
                                <Link to="/my-loans" className="btn btn-outline-success btn-lg px-4">
                                    My Loans
                                </Link>
                            )}

                            {userRole === 'ROLE_ADMIN' && (
                                <Link to="/admin" className="btn btn-outline-warning btn-lg px-4">
                                    Admin Panel
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;