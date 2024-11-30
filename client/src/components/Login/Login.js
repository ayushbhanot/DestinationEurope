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
    try{
    // Dynamically use the API base URL
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      navigate('/home');  // Redirect to the dashboard after login
    }
  } catch (err) {
    // Customize error handling
    if (err.response && err.response.data.message) {
      if (err.response.data.message === 'Account not verified. Please check your email for the verification link.') {
        setError('Your account is not verified. Please check your email for the verification link.');
      } else {
        setError('Invalid email or password');
      }
    } else {
      setError('An error occurred. Please try again.');
    }
  }
};

const handleContinueAsGuest = () => {
  navigate('/guest'); // Redirect to the guest home page
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
    <div className="guest-access">
      <p>OR</p>
      <button onClick={handleContinueAsGuest}>Continue as Guest</button>
    </div>
    </div>
</div>
  );
};

export default Login;
