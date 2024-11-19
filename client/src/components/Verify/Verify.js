import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Verify.css'; // Import your CSS file

const Verify = () => {
  const [status, setStatus] = useState('Verifying...');
  const [isVerified, setIsVerified] = useState(true);  // Temporarily set to true for preview
  const navigate = useNavigate();

  // This is only for preview, remove or replace with real verification logic later
  useState(() => {
    // Simulating a verified status for preview
    setIsVerified(true);  // For Verified header
    setStatus('Your account has been successfully verified!');
  }, []);

  return (
    <div className="verify-page">
      <div className="verify-intro">
        <h2 className={isVerified === true ? 'verified-header' : 'rejected-header'}>
          {isVerified === true ? '✔️ Verified' : '❌ Rejected'}
        </h2>
        <p>{status}</p>
      </div>

      <div className="verify-container">
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    </div>
  );
};

export default Verify;




/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Verify.css'; // Import the CSS for the page

const Verify = () => {
  const [status, setStatus] = useState('Verifying...');
  const [isVerified, setIsVerified] = useState(null); // Track whether the account is verified or not
  const { token } = useParams(); // Get the verification token from the URL
  const navigate = useNavigate();

  useEffect(() => {
    // Call backend API to verify the token
    const verifyAccount = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/verify`, {
          token,
        });

        if (response.data.success) {
          setIsVerified(true);
          setStatus('Your account has been successfully verified!');
        } else {
          setIsVerified(false);
          setStatus('Verification failed. Invalid or expired token.');
        }
      } catch (error) {
        setIsVerified(false);
        setStatus('An error occurred during verification.');
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <div className="verify-page">
      <div className="verify-intro">
        <h2 className={isVerified === true ? 'verified-header' : 'rejected-header'}>
          {isVerified === true ? '✔️ Verified' : '❌ Rejected'}
        </h2>
        <p>{status}</p>
      </div>

      <div className="verify-container">
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    </div>
  );
};

export default Verify;
*/