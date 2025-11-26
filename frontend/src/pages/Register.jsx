import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_USER'); // Implicit e user normal
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Trimitem datele la Backend
            await axios.post('http://localhost:8080/auth/register', {
                username: username,
                password: password,
                role: role
            });

            alert("Account created successfully! Please login.");
            navigate('/login'); // Il trimitem la login

        } catch (err) {
            setError("Registration failed. Username might already exist.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-success text-white text-center">
                            <h3>Register New Account</h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Role</label>
                                    <select
                                        className="form-select"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="ROLE_USER">Student (User)</option>
                                        <option value="ROLE_ADMIN">Librarian (Admin)</option>
                                    </select>
                                    <small className="text-muted">Select Admin only for testing purposes.</small>
                                </div>
                                <button type="submit" className="btn btn-success w-100">Create Account</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;