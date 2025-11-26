import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
            e.preventDefault();
            const token = 'Basic ' + window.btoa(username + ":" + password);

            try {
                // 1. Verificam token-ul cerand datele utilizatorului curent (/auth/me)
                const userResponse = await axios.get('http://localhost:8080/auth/me', {
                    headers: { 'Authorization': token }
                });

                // 2. Daca e ok, salvam Token-ul SI Rolul
                localStorage.setItem('auth_token', token);
                localStorage.setItem('username', username);
                localStorage.setItem('role', userResponse.data.role); // <--- Salvam rolul (ROLE_ADMIN sau ROLE_USER)

                navigate('/');
                alert("Login successful!");

            } catch (err) {
                setError("Invalid username or password!");
            }
        };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white text-center">
                            <h3>Login</h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleLogin}>
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
                                <button type="submit" className="btn btn-primary w-100">Sign In</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;