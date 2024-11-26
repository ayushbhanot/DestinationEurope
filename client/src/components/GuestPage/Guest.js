import React, { useState } from 'react';
import axios from 'axios';
import './Guest.css';

const Guest = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fields = ['Destination', 'Region', 'Country'];
  const toggleFieldSelection = (field) => {
    setSelectedFields((prevFields) =>
      prevFields.includes(field)
        ? prevFields.filter((f) => f !== field)
        : [...prevFields, field]
    );
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
};

const closeDropdown = () => {
    setDropdownOpen(false);
};


  const handleSearch = async () => {
    if (selectedFields.length === 0 || !searchTerm) {
      setError('Please select at least one field and enter a search term.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const queryParams = new URLSearchParams(
        selectedFields.reduce(
          (acc, field) => ({
            ...acc,
            [field]: searchTerm,
          }),
          {}
        )
      );

      const response = await axios.get(`/api/search?${queryParams.toString()}`);
      if (response.data && Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
        setError('No matching destinations found.');
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Error searching destinations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-page">
      <div className="guest-header">
        <h1>Welcome, Guest!</h1>
        <p>Explore destinations or browse public lists curated by our community.</p>
      </div>

      <div className="search-results-container">
  <h2>Search Destinations</h2>

  {/* Wrap the input, dropdown, and button */}
  <div className="search-fields-container">
    <div className="search-fields">
      {/* Input field */}
      <input
        type="text"
        placeholder="Enter search term"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Dropdown */}
      <div
        className="dropdown"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <button className="dropdown-button">
          {selectedFields.length > 0 ? selectedFields.join(', ') : 'Select Fields'}
        </button>
        <div className={`dropdown-content ${dropdownOpen ? 'open' : ''}`}>
          {fields.map((field) => (
            <div className="toggle-field" key={field}>
              <span className="field-label">{field}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field)}
                  onChange={() => toggleFieldSelection(field)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Search button */}
    <button onClick={handleSearch} disabled={loading} className="search-button">
      {loading ? 'Searching...' : 'Search'}
    </button>
  </div>

  {error && <p className="error-message">{error}</p>}

  <ul className="results-list">
    {searchResults.length > 0 ? (
      searchResults.map((result, index) => (
        <li key={index}>
          <strong>{result.Destination}</strong> - {result.Country}
          <button>View Details</button>
        </li>
      ))
    ) : (
      !loading && <p>No results found. Try another search.</p>
    )}
  </ul>
</div>

    </div>
  );
};

export default Guest;
