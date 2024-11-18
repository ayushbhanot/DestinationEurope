import React from 'react';
import Login from './components/Login/Login'; // Import Login component
import { Route, Routes } from 'react-router-dom'; // Import necessary components for routing

function App() {
  return (
    <div>
      <Routes>
        {/* Make the Login page the default (root) route */}
        <Route path="/" element={<Login />} />  {/* This will load the Login component for '/' */}
        <Route path="/login" element={<Login />} /> {/* You can still use the /login route */}
        {/* Define more routes as necessary */}
      </Routes>
    </div>
  );
}

export default App;
