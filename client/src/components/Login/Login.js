import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Dynamically use the API base URL
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });      

      if (response.data.token) {
        localStorage.setItem('token', response.data.token); 
        navigate('/dashboard');  // Redirect to the dashboard after login
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-intro">
        <h2>Welcome to Destination Europe!</h2>
        <p>Uncover Europe's most captivating destinations! Whether you're seeking historical landmarks or scenic landscapes, this platform helps you explore and learn about Europe's rich heritage and diverse locations.</p>
      </div>
      
      <div className="login-container">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <button type="submit">Login</button>
          </div>
        </form>
        
        <label>
          Don't have an account? <a href="/signup">Sign up</a>
        </label>
      </div>
    </div>
  );
};

export default Login;
