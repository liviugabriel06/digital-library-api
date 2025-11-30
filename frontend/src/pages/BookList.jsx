import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async (searchTerm = '') => {
        try {
            let url = 'http://localhost:8080/books';
            if (searchTerm) {
                url += `?${searchType}=${searchTerm}`;
            }
            const result = await axios.get(url);
            setBooks(result.data);
            setError('');
        } catch (err) {
            setBooks([]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadBooks(search);
    };

    const handleReset = () => {
        setSearch('');
        setSearchType('title');
        loadBooks();
    };

    const handleBorrow = async (bookId) => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert("Please login first!");
            navigate('/login');
            return;
        }

        try {
            await axios.post(`http://localhost:8080/borrow/${bookId}`, {}, {
                headers: { 'Authorization': token }
            });
            setSuccess("Book borrowed successfully!");
            setError('');
            loadBooks(search);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Could not borrow book.");
            setSuccess('');
        }
    };

    return (
        <div className="container mt-5">
            {/* CSS PENTRU DESIGN CINEMATIC */}
            <style>
                {`
                    .book-card { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                    .book-card:hover { transform: translateY(-8px); }

                    /* Containerul Imaginii */
                    .book-cover-wrapper { position: relative; height: 320px; overflow: hidden; }

                    /* Fundalul Blur (Glow) */
                    .book-backdrop {
                        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                        background-size: cover; background-position: center;
                        filter: blur(15px) brightness(0.7);
                        transform: scale(1.2);
                        z-index: 1; /* Fundalul e cel mai jos */
                    }

                    /* Imaginea Principala */
                    .book-image-front {
                        position: relative;
                        z-index: 10; /* Imaginea e la mijloc */
                        height: 100%; width: 100%;
                        object-fit: contain;
                        padding: 20px;
                        transition: transform 0.4s ease;
                        filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
                    }

                    .book-card:hover .book-image-front { transform: scale(1.05); }
                `}
            </style>

            <h2 className="text-center mb-4 fw-light">Library Inventory</h2>

            {/* SEARCH BAR */}
            <div className="row justify-content-center mb-5">
                <div className="col-md-8">
                    <form onSubmit={handleSearch} className="input-group shadow-sm">
                        <input
                            type={searchType === 'year' ? "number" : "text"}
                            className="form-control border-secondary"
                            placeholder={`Search by ${searchType}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="form-select border-secondary bg-body-tertiary"
                            style={{maxWidth: '130px', fontWeight: 'bold'}}
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                            <option value="genre">Genre</option>
                            <option value="year">Year</option>
                        </select>
                        <button className="btn btn-primary px-4" type="submit"><i className="bi bi-search"></i></button>
                        <button className="btn btn-outline-secondary" type="button" onClick={handleReset}>✕</button>
                    </form>
                </div>
            </div>

            {error && <div className="alert alert-danger text-center">{error}</div>}
            {success && <div className="alert alert-success text-center">{success}</div>}

            {/* LISTA DE CARTI */}
            <div className="row">
                {books.length > 0 ? books.map((book) => (
                    <div className="col-md-4 mb-4" key={book.id}>
                        <div className="card h-100 border-0 shadow book-card overflow-hidden rounded-3">

                            {/* ZONA VIZUALA CINEMATICA */}
                            <div className="book-cover-wrapper">
                                {book.imageUrl && (
                                    <div
                                        className="book-backdrop"
                                        style={{ backgroundImage: `url(${book.imageUrl})` }}
                                    ></div>
                                )}

                                {book.imageUrl ? (
                                    <img
                                        src={book.imageUrl}
                                        alt={book.title}
                                        className="book-image-front"
                                    />
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center h-100 bg-secondary bg-opacity-25 text-muted position-relative z-1">
                                        <div className="text-center">
                                            <i className="bi bi-journal-x display-1 opacity-50"></i>
                                            <p className="mt-2 fw-bold">No Cover</p>
                                        </div>
                                    </div>
                                )}

                                {/* MODIFICAREA AICI:
                                    1. Am pus zIndex: 20 (ca sa fie peste poza care are z-index 10).
                                    2. Am pus maxWidth: '85%' si text-truncate (ca sa nu iasa din cadru daca e lung).
                                */}
                                <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 20, maxWidth: '85%' }}>
                                    <span className="badge rounded-pill bg-primary bg-gradient text-white shadow-sm px-3 py-2 fw-bold d-block text-truncate">
                                        {book.genre}
                                    </span>
                                </div>
                            </div>

                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title fw-bold text-truncate" title={book.title}>{book.title}</h5>
                                <h6 className="card-subtitle mb-3 text-primary fst-italic">{book.author}</h6>

                                <div className="mt-auto">
                                    <div className="d-flex gap-2 mb-3">
                                        <span className="badge bg-body-secondary text-body border rounded-1 fw-normal">
                                            <i className="bi bi-calendar3 me-1"></i> {book.publicationYear}
                                        </span>
                                        <span className="badge bg-body-secondary text-body border rounded-1 fw-normal font-monospace">
                                            <i className="bi bi-upc-scan me-1"></i> {book.bookNumber}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                        <div className="d-flex align-items-center">
                                            <i className={`bi bi-circle-fill me-2 small ${book.availableCopies > 0 ? 'text-success' : 'text-danger'}`}></i>
                                            <small className="text-muted fw-bold">
                                                Stock: {book.availableCopies} / {book.totalCopies}
                                            </small>
                                        </div>

                                        <button
                                            className={`btn btn-sm px-4 rounded-pill fw-bold ${book.availableCopies > 0 ? 'btn-primary' : 'btn-secondary disabled'}`}
                                            onClick={() => handleBorrow(book.id)}
                                            disabled={book.availableCopies === 0}
                                        >
                                            {book.availableCopies > 0 ? 'Borrow' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center mt-5 opacity-50">
                        <i className="bi bi-search display-1"></i>
                        <h4 className="mt-3">No books found.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookList;