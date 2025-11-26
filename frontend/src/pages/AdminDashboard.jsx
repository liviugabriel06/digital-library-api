import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('books');

    // --- STATE BOOKS ---
    const [books, setBooks] = useState([]);
    const [availableGenres, setAvailableGenres] = useState([
        'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Fantasy',
        'Biography', 'History', 'Romance', 'Horror', 'Computer Science'
    ]);
    const [isManualGenre, setIsManualGenre] = useState(false);
    const [bookForm, setBookForm] = useState({
        title: '', author: '', genre: '', publicationYear: '',
        bookNumber: '', totalCopies: '', imageUrl: ''
    });
    const [editingBookId, setEditingBookId] = useState(null);

    // --- STATE USERS ---
    const [users, setUsers] = useState([]);
    // Formular unificat pentru CREATE si EDIT User
    const [userForm, setUserForm] = useState({ username: '', password: '', role: 'ROLE_USER' });
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        if (activeTab === 'books') loadBooks();
        if (activeTab === 'users') loadUsers();
    }, [activeTab]);

    // --- API LOADING ---
    const loadBooks = async () => {
        try {
            const result = await axios.get('http://localhost:8080/books');
            setBooks(result.data);
            const existingGenres = result.data.map(b => b.genre).filter(g => g);
            setAvailableGenres([...new Set([...availableGenres, ...existingGenres])].sort());
        } catch (err) { console.error(err); }
    };

    const loadUsers = async () => {
        const token = localStorage.getItem('auth_token');
        try {
            const result = await axios.get('http://localhost:8080/users', {
                headers: { 'Authorization': token }
            });
            setUsers(result.data);
        } catch (err) { alert("Could not load users."); }
    };

    // --- HANDLERS BOOKS ---
    const handleBookSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');
        try {
            if (editingBookId) {
                await axios.put(`http://localhost:8080/books/${editingBookId}`, bookForm, { headers: { 'Authorization': token } });
                alert("Book updated!");
            } else {
                await axios.post('http://localhost:8080/books', bookForm, { headers: { 'Authorization': token } });
                alert("Book added!");
            }
            setEditingBookId(null);
            setBookForm({ title: '', author: '', genre: '', publicationYear: '', bookNumber: '', totalCopies: '', imageUrl: '' });
            loadBooks();
        } catch (err) { alert("Operation failed."); }
    };

    const handleDeleteBook = async (id) => {
        if(!confirm("Delete book?")) return;
        const token = localStorage.getItem('auth_token');
        try {
            await axios.delete(`http://localhost:8080/books/${id}`, { headers: { 'Authorization': token } });
            loadBooks();
        } catch (err) { alert("Cannot delete book."); }
    };

    const handleEditBook = (book) => {
        setEditingBookId(book.id);
        setBookForm({ ...book, imageUrl: book.imageUrl || '' });
        setIsManualGenre(false);
        window.scrollTo(0, 0);
    };

    // --- HANDLERS USERS ---
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');
        try {
            if (editingUserId) {
                // UPDATE USER
                await axios.put(`http://localhost:8080/users/${editingUserId}`, userForm, { headers: { 'Authorization': token } });
                alert("User updated successfully!");
            } else {
                // CREATE USER
                await axios.post('http://localhost:8080/auth/register', userForm);
                alert(`User '${userForm.username}' created successfully!`);
            }
            setEditingUserId(null);
            setUserForm({ username: '', password: '', role: 'ROLE_USER' }); // Reset
            loadUsers();
        } catch (err) { alert("Operation failed. Username might exist."); }
    };

    const handleDeleteUser = async (id) => {
        if(!confirm("Are you sure? This will delete user history too.")) return;
        const token = localStorage.getItem('auth_token');
        try {
            await axios.delete(`http://localhost:8080/users/${id}`, { headers: { 'Authorization': token } });
            loadUsers();
        } catch (err) { alert("Cannot delete user! They might have unreturned books."); }
    };

    const handleEditUser = (user) => {
        setEditingUserId(user.id);
        // La editare, lasam parola goala. Daca userul scrie ceva, o schimbam.
        setUserForm({ username: user.username, password: '', role: user.role });
        window.scrollTo(0, 0); // Urcam sus la formular
    };

    const resetUserForm = () => {
        setEditingUserId(null);
        setUserForm({ username: '', password: '', role: 'ROLE_USER' });
    };


    // --- RENDER SECTIUNI ---

    const renderBooksSection = () => (
        <>
            <div className="card p-4 mb-4 shadow-sm border-primary">
                <h4 className="text-primary mb-3">{editingBookId ? 'Edit Book' : 'Add New Book'}</h4>
                <form onSubmit={handleBookSubmit} className="row g-3">
                    {/* ... Input-urile de carti raman la fel ... */}
                    <div className="col-md-6"><input className="form-control" placeholder="Title" value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} required /></div>
                    <div className="col-md-6"><input className="form-control" placeholder="Author" value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} required /></div>
                    <div className="col-md-4">
                        {isManualGenre ? (
                            <div className="input-group">
                                <input className="form-control" placeholder="New Genre..." value={bookForm.genre} onChange={e => setBookForm({...bookForm, genre: e.target.value})} />
                                <button className="btn btn-outline-secondary" type="button" onClick={() => setIsManualGenre(false)}>✕</button>
                            </div>
                        ) : (
                            <select className="form-select" value={bookForm.genre} onChange={(e) => e.target.value === 'NEW' ? setIsManualGenre(true) : setBookForm({...bookForm, genre: e.target.value})}>
                                <option value="">Select Genre</option>
                                {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
                                <option value="NEW" className="text-success fw-bold">+ Add New Genre</option>
                            </select>
                        )}
                    </div>
                    <div className="col-md-2"><input type="number" className="form-control" placeholder="Year" value={bookForm.publicationYear} onChange={e => setBookForm({...bookForm, publicationYear: e.target.value})} /></div>
                    <div className="col-md-4"><input className="form-control" placeholder="ISBN" value={bookForm.bookNumber} onChange={e => setBookForm({...bookForm, bookNumber: e.target.value})} required /></div>
                    <div className="col-md-2"><input type="number" className="form-control" placeholder="Stock" value={bookForm.totalCopies} onChange={e => setBookForm({...bookForm, totalCopies: e.target.value})} required /></div>
                    <div className="col-12"><input className="form-control" placeholder="Cover Image URL" value={bookForm.imageUrl} onChange={e => setBookForm({...bookForm, imageUrl: e.target.value})} /></div>

                    <div className="col-12">
                        <button className={`btn w-100 ${editingBookId ? 'btn-warning' : 'btn-success'}`}>{editingBookId ? 'Update Book' : 'Add Book'}</button>
                        {editingBookId && <button type="button" onClick={() => {setEditingBookId(null); setBookForm({ title: '', author: '', genre: '', publicationYear: '', bookNumber: '', totalCopies: '', imageUrl: '' });}} className="btn btn-secondary w-100 mt-2">Cancel</button>}
                    </div>
                </form>
            </div>

            <table className="table table-hover shadow-sm bg-body">
                <thead className="table-secondary">
                    <tr><th>Title</th><th>Author</th><th>ISBN</th><th>Stock</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.bookNumber}</td>
                            <td>{book.availableCopies}/{book.totalCopies}</td>
                            <td>
                                <button onClick={() => handleEditBook(book)} className="btn btn-sm btn-warning me-2">Edit</button>
                                <button onClick={() => handleDeleteBook(book.id)} className="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );

    const renderUsersSection = () => (
        <>
            {/* FORMULAR CREARE / EDITARE USER */}
            <div className="card p-4 mb-4 shadow border-info">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-info">{editingUserId ? `Edit User: ${userForm.username}` : 'Create New Account'}</h4>
                    {editingUserId && <button onClick={resetUserForm} className="btn btn-secondary btn-sm">Cancel Edit</button>}
                </div>

                <form onSubmit={handleUserSubmit} className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">{editingUserId ? 'New Password (Empty to keep)' : 'Password'}</label>
                        <input type="password" className="form-control" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} required={!editingUserId} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Role</label>
                        <select className="form-select" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                            <option value="ROLE_USER">Student</option>
                            <option value="ROLE_ADMIN">Admin</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button className={`btn w-100 ${editingUserId ? 'btn-warning' : 'btn-info text-white'}`}>
                            {editingUserId ? 'Update User' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>

            {/* LISTA USERI */}
            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">
                    <h4>Registered Users</h4>
                </div>
                <div className="card-body p-0">
                    <table className="table table-striped mb-0 align-middle">
                        <thead>
                            <tr><th>ID</th><th>Username</th><th>Role</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td className="fw-bold">{user.username}</td>
                                    <td><span className={`badge ${user.role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-primary'}`}>{user.role}</span></td>
                                    <td>
                                        <button onClick={() => handleEditUser(user)} className="btn btn-sm btn-warning me-2">Modify</button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                <div className="col-md-3">
                    <div className="list-group shadow-sm">
                        <button className={`list-group-item list-group-item-action py-3 ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>📚 Manage Books</button>
                        {/* Am unit Create Account cu Users, ca sa fie mai logic */}
                        <button className={`list-group-item list-group-item-action py-3 ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Manage Users & Accounts</button>
                    </div>
                </div>
                <div className="col-md-9">
                    {activeTab === 'books' && renderBooksSection()}
                    {activeTab === 'users' && renderUsersSection()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;