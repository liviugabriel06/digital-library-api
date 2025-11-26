import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState(''); // Stare pentru cautare
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Incarcarea initiala a cartilor
    useEffect(() => {
        loadBooks();
    }, []);

    // Functia care aduce cartile (cu sau fara cautare)
    const loadBooks = async (searchTerm = '') => {
        try {
            // Daca avem text in search, il trimitem la backend. Daca nu, luam tot.
            let url = 'http://localhost:8080/books';
            if (searchTerm) {
                url += `?title=${searchTerm}`;
            }

            const result = await axios.get(url);
            setBooks(result.data);
        } catch (err) {
            setError("Could not load books. Backend might be down.");
        }
    };

    // Cand apasam butonul Search
    const handleSearch = (e) => {
        e.preventDefault();
        loadBooks(search);
    };

    // Functia de Reset
    const handleReset = () => {
        setSearch('');
        loadBooks();
    };

    // Logica de Imprumut (Borrow)
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

            // Reincarcam lista (pastrand cautarea curenta daca exista)
            loadBooks(search);

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Could not borrow book.");
            setSuccess('');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Library Inventory</h2>

            {/* SEARCH BAR */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <form onSubmit={handleSearch} className="d-flex gap-2">
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Search by Title (e.g. Ion)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">Search</button>
                        <button className="btn btn-outline-secondary" type="button" onClick={handleReset}>Reset</button>
                    </form>
                </div>
            </div>

            {/* ALERTS */}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {success && <div className="alert alert-success text-center">{success}</div>}

            {/* BOOK CARDS */}
            <div className="row">
                {books.length > 0 ? books.map((book) => (
                   <div className="col-md-4 mb-4" key={book.id}>
                                           <div className="card h-100 shadow-sm border-0 overflow-hidden">
                                               {/* ZONA DE IMAGINE */}
                                               <div style={{ height: '250px', overflow: 'hidden', backgroundColor: '#f8f9fa' }} className="d-flex align-items-center justify-content-center">
                                                   {book.imageUrl ? (
                                                       <img
                                                           src={book.imageUrl}
                                                           alt={book.title}
                                                           className="w-100 h-100"
                                                           style={{ objectFit: 'contain', padding: '10px' }}
                                                       />
                                                   ) : (
                                                       <span className="text-muted">No Image Available</span>
                                                   )}
                                               </div>

                                               <div className="card-body">
                                                   <h5 className="card-title text-primary fw-bold text-truncate" title={book.title}>{book.title}</h5>
                                                   <h6 className="card-subtitle mb-3 text-muted">{book.author}</h6>
                                                   <p className="card-text small">
                                                       <strong>Genre:</strong> {book.genre} <br/>
                                                       <strong>Year:</strong> {book.publicationYear} <br/>
                                                       <strong>ISBN:</strong> {book.bookNumber}
                                                   </p>
                                               </div>

                                               {/* ... footer-ul cu butoane ramane la fel ... */}
                                               <div className="card-footer bg-body border-top-0 d-flex justify-content-between align-items-center pb-3">
                                                   <div>
                                                       <span className={`badge rounded-pill ${book.availableCopies > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                           Stock: {book.availableCopies} / {book.totalCopies}
                                                       </span>
                                                   </div>
                                                   <button
                                                       className="btn btn-sm btn-outline-primary"
                                                       onClick={() => handleBorrow(book.id)}
                                                       disabled={book.availableCopies === 0}
                                                   >
                                                       {book.availableCopies > 0 ? 'Borrow Book' : 'Out of Stock'}
                                                   </button>
                                               </div>
                                           </div>
                                       </div>
                )) : (
                    <div className="text-center mt-5 text-muted">
                        <h4>No books found.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookList;