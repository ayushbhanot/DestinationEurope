import React, { useState } from 'react';
import axios from 'axios';
import './Guest.css';

const Guest = () => {
    const [selectedFields, setSelectedFields] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(5);

    const fields = ['Destination', 'Region', 'Country'];

    // Toggle selected fields
    const toggleFieldSelection = (field) => {
        setSelectedFields((prevFields) =>
            prevFields.includes(field)
                ? prevFields.filter((f) => f !== field)
                : [...prevFields, field]
        );
    };

    // Fetch search results
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
                setSearchResults(response.data); // Populate results
                setCurrentPage(1); // Reset to the first page
            } else {
                setSearchResults([]); // Clear results if unexpected data structure
                setError('No matching destinations found.');
            }
        } catch (err) {
            // Handle 404 specifically
            if (err.response && err.response.status === 404) {
                setSearchResults([]); // Clear results
                setError(err.response.data.error || 'No matching destinations found.');
            } else {
                console.error('Error fetching search results:', err);
                setError('Error searching destinations. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Pagination calculations
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

    // Pagination controls
    const handleNextPage = () => {
        if (currentPage * resultsPerPage < searchResults.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleResultsPerPageChange = (e) => {
        setResultsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page
    };

  return (
    <div className="guest-page">
      {/* Search Container */}
      <div className="search-container">
        <h2>Search Destinations</h2>
        <div className="search-fields">
          <input
            type="text"
            placeholder="Enter search term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="dropdown">
            <button className="dropdown-button">
              {selectedFields.length > 0 ? selectedFields.join(', ') : 'Select Fields'}
            </button>
            <div className="dropdown-content">
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
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="results-container">
    <h2>Search Results</h2>
    <div class="pagination-controls">
    <div>
        <label for="results-per-page">
            Results per page:
            <select id="results-per-page" value={resultsPerPage} onChange={handleResultsPerPageChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
        </label>
    </div>
    <div className="pagination-buttons">
    <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
        Previous
    </button>
    <button
        onClick={() =>
            setCurrentPage((prev) =>
                prev * resultsPerPage < searchResults.length ? prev + 1 : prev
            )
        }
        disabled={currentPage * resultsPerPage >= searchResults.length}
    >
        Next
    </button>
</div>

</div>

<ul className="results-list">
    {currentResults.length > 0 ? (
        currentResults.map((result, index) => (
            <li key={index}>
                <strong>{result["﻿Destination"]}</strong> - {result.Country}
                <p>{result.Description}</p>
                {/* Add other fields */}
                <p><strong>Region:</strong> {result.Region}</p>
                <p><strong>Category:</strong> {result.Category}</p>
            </li>
        ))
    ) : (
        !loading && error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
    )}
</ul>

</div>
</div>
  );

};

export default Guest;