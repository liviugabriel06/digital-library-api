import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [books, setBooks] = useState([]);

    // Lista de genuri disponibile (incepem cu cateva standard)
    const [availableGenres, setAvailableGenres] = useState([
        'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery',
        'Fantasy', 'Biography', 'History', 'Romance', 'Horror',
        'Computer Science', 'Psychology'
    ]);

    // State pentru a controla daca scriem un gen manual
    const [isManualGenre, setIsManualGenre] = useState(false);

    const [bookForm, setBookForm] = useState({
        title: '', author: '', genre: '', publicationYear: '',
        bookNumber: '', totalCopies: '', imageUrl: ''
    });

    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const result = await axios.get('http://localhost:8080/books');
            const loadedBooks = result.data;
            setBooks(loadedBooks);

            // EXTRACTIE INTELIGENTA DE GENURI:
            // Ne uitam prin toate cartile din baza de date, luam genurile lor,
            // si le adaugam la lista noastra daca nu exista deja.
            const existingGenres = loadedBooks.map(b => b.genre).filter(g => g); // Luam genurile care nu sunt null

            // Combinam lista standard cu ce am gasit in baza de date (fara duplicate)
            const allGenres = [...new Set([...availableGenres, ...existingGenres])].sort();
            setAvailableGenres(allGenres);

        } catch (err) {
            console.error("Error loading books");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');

        try {
            if (editingId) {
                await axios.put(`http://localhost:8080/books/${editingId}`, bookForm, {
                    headers: { 'Authorization': token }
                });
                alert("Book updated successfully!");
            } else {
                await axios.post('http://localhost:8080/books', bookForm, {
                    headers: { 'Authorization': token }
                });
                alert("Book added successfully!");
            }

            resetForm();
            loadBooks(); // Asta va actualiza si lista de genuri daca ai adaugat unul nou!
        } catch (err) {
            alert("Operation failed. Check console for details.");
        }
    };

    const handleEdit = (book) => {
        setEditingId(book.id);
        setBookForm({
            title: book.title,
            author: book.author,
            genre: book.genre || '',
            publicationYear: book.publicationYear || '',
            bookNumber: book.bookNumber,
            totalCopies: book.totalCopies,
            imageUrl: book.imageUrl || ''
        });

        // Daca genul cartii nu e in lista standard, il adaugam temporar ca sa apara in select
        if (book.genre && !availableGenres.includes(book.genre)) {
            setAvailableGenres(prev => [...prev, book.genre].sort());
        }

        setIsManualGenre(false); // Resetam modul manual la editare
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if(!confirm("Are you sure? It will delete history too.")) return;
        const token = localStorage.getItem('auth_token');
        try {
            await axios.delete(`http://localhost:8080/books/${id}`, {
                headers: { 'Authorization': token }
            });
            loadBooks();
        } catch (err) {
            alert("Cannot delete book.");
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setIsManualGenre(false);
        setBookForm({
            title: '', author: '', genre: '', publicationYear: '',
            bookNumber: '', totalCopies: '', imageUrl: ''
        });
    };

    // Handler special pentru schimbarea genului din Dropdown
    const handleGenreSelect = (e) => {
        const selected = e.target.value;
        if (selected === 'NEW_GENRE_OPTION') {
            setIsManualGenre(true); // Activam modul manual
            setBookForm({...bookForm, genre: ''}); // Golim campul ca sa scrii tu
        } else {
            setIsManualGenre(false);
            setBookForm({...bookForm, genre: selected});
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-warning">Admin Dashboard</h2>

            <div className="card p-4 mb-5 shadow border-warning">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>{editingId ? 'Edit Book Details' : 'Add New Book'}</h4>
                    {editingId && (
                        <button onClick={resetForm} className="btn btn-secondary btn-sm">Cancel Edit</button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Author</label>
                        <input type="text" className="form-control" value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} required />
                    </div>

                    {/* ZONA INTELIGENTA PENTRU GENURI */}
                    <div className="col-md-4">
                        <label className="form-label">Genre</label>
                        {isManualGenre ? (
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type new genre..."
                                    value={bookForm.genre}
                                    onChange={e => setBookForm({...bookForm, genre: e.target.value})}
                                    autoFocus
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setIsManualGenre(false)}
                                    title="Cancel adding new genre"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <select
                                className="form-select"
                                value={bookForm.genre}
                                onChange={handleGenreSelect}
                            >
                                <option value="">-- Select Genre --</option>
                                {availableGenres.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                                <option disabled>──────────</option>
                                <option value="NEW_GENRE_OPTION" style={{fontWeight: 'bold', color: 'green'}}>
                                    + Add New Genre
                                </option>
                            </select>
                        )}
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">Year</label>
                        <input type="number" className="form-control" value={bookForm.publicationYear} onChange={e => setBookForm({...bookForm, publicationYear: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">ISBN / Code</label>
                        <input type="text" className="form-control" value={bookForm.bookNumber} onChange={e => setBookForm({...bookForm, bookNumber: e.target.value})} required />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Stock</label>
                        <input type="number" className="form-control" value={bookForm.totalCopies} onChange={e => setBookForm({...bookForm, totalCopies: e.target.value})} required />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Cover Image URL (Link)</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="https://example.com/image.jpg"
                            value={bookForm.imageUrl}
                            onChange={e => setBookForm({...bookForm, imageUrl: e.target.value})}
                        />
                    </div>

                    <div className="col-12">
                        <button className={`btn w-100 ${editingId ? 'btn-warning' : 'btn-success'}`}>
                            {editingId ? 'Update Book Details' : 'Add Book to Library'}
                        </button>
                    </div>
                </form>
            </div>

            <h4 className="mt-5">Manage Inventory</h4>
            <table className="table table-bordered table-hover shadow-sm bg-white align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Genre</th> {/* Am adaugat si Genul aici sa il vezi */}
                        <th>ISBN</th>
                        <th>Stock</th>
                        <th style={{width: '180px'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td><span className="badge bg-secondary">{book.genre}</span></td>
                            <td className="text-monospace text-primary">{book.bookNumber}</td>
                            <td>
                                <span className={`badge ${book.availableCopies > 0 ? 'bg-success' : 'bg-danger'}`}>
                                    {book.availableCopies} / {book.totalCopies}
                                </span>
                            </td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button onClick={() => handleEdit(book)} className="btn btn-sm" style={{ backgroundColor: '#6f42c1', color: 'white' }}>Modify</button>
                                    <button onClick={() => handleDelete(book.id)} className="btn btn-danger btn-sm">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;