import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Signup.css'; // Import the updated CSS

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Ensure the fields have values
    if (!email || !password || !name) {
        setError('All fields are required');
        return;
    }

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
            name,      // name, email, and password should be set in your state
            email,
            password,
        });

        // Handle success, such as displaying a success message or redirecting
        if (response.status === 200) {
            alert('Account created successfully! Please check your email for verification.');
            setEmailSent(true);
        }
    } catch (err) {
        // Catch and log errors
        console.error('Error during signup:', err.response?.data || err);
        if (err.response?.data?.message === 'User exists but is not verified. Please check your email for verification.') {
          setError('An account with this email exists but is not yet verified. Please check your inbox for the verification email or click the "Resend Verification Email" button.');
          setEmailSent(true);
      } else {
          setError('Signup failed. Please try again later.');
      }
  }
};

const handleResendVerification = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/resend-verification`, { email });

    if (response.status === 200) {
      alert('Verification email resent!');
    }
  } catch (err) {
    console.error('Error resending verification email:', err.response?.data || err);
    alert('Failed to resend verification email.');
  }
};


  return (
    <div className="signup-page">
      <div className="signup-intro">
        <h2>Join Destination Europe!</h2>
        <p>Create an account to explore Europe’s best destinations and share your favorite places.</p>
      </div>

      <div
      className="signup-container"
      style={{ position: 'relative', top: emailSent ? '-50px' : '0px' }}
      >
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

        {emailSent && (
          <div className="resend-verification">
            <p style={{color: '#4CAF50;'}}>If you did not receive the verification email, you can resend it:</p>
            <button onClick={handleResendVerification}>Resend Verification Email</button>
          </div>
        )}

        <label>
          Already have an account? <a href="/login">Login</a>
        </label>
      </div>
    </div>
  );
};

export default Signup;
