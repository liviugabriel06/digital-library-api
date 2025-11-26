import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyLoans = () => {
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // Cerem lista de imprumuturi active
            const result = await axios.get('http://localhost:8080/borrow/my-active', {
                headers: { 'Authorization': token }
            });
            setLoans(result.data);
        } catch (err) {
            setError("Could not load your loans.");
        }
    };

    const handleReturn = async (borrowId) => {
        const token = localStorage.getItem('auth_token');
        try {
            // Trimitem comanda de returnare
            await axios.put(`http://localhost:8080/borrow/return/${borrowId}`, {}, {
                headers: { 'Authorization': token }
            });

            setSuccess("Book returned successfully!");
            loadLoans(); // Reincarcam lista (cartea ar trebui sa dispara)

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError("Could not return book.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">My Active Loans</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {loans.length === 0 ? (
                <div className="text-center">
                    <p className="text-muted">You have no active loans.</p>
                    <a href="/books" className="btn btn-primary">Go Borrow Some Books</a>
                </div>
            ) : (
                <table className="table table-striped table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Borrowed Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan.id}>
                                <td>{loan.book.title}</td>
                                <td>{loan.book.author}</td>
                                <td>{loan.borrowDate}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm text-dark fw-bold"
                                        onClick={() => handleReturn(loan.id)}
                                    >
                                        Return Book
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyLoans;