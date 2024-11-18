import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Signup.css'; // Import the updated CSS

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Hook for navigation

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Send the POST request to create a new user
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard'); // Redirect to the dashboard after successful signup
      }
    } catch (err) {
      setError('Failed to create account. Please try again later.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-intro">
        <h2>Join Destination Europe!</h2>
        <p>Create an account to explore Europe’s best destinations and share your favorite places.</p>
      </div>

      <div className="signup-container">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <button type="submit">Sign Up</button>
          </div>
        </form>

        <label>
          Already have an account? <a href="/login">Login</a>
        </label>
      </div>
    </div>
  );
};

export default Signup;
