import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container mt-5 text-center">
            <div className="p-5 mb-4 bg-body-tertiary rounded-3 shadow-sm border">
                <h1 className="display-4 fw-bold">Welcome to the Digital Library!</h1>
                <p className="col-md-8 fs-4 mx-auto my-3 text-muted">
                    A modern platform to manage loans, check book availability, and administer users efficiently.
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Link to="/books" className="btn btn-primary btn-lg px-4">Browse Books</Link>
                    <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;