import React, { useState } from 'react';
import axios from 'axios';
import './Guest.css';

const Guest = () => {
    const [selectedFields, setSelectedFields] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [destinationById, setDestinationById] = useState(null);
    const [destinationId, setDestinationId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(5);
    const [showCountries, setShowCountries] = useState(false);

    const fields = ['Destination', 'Region', 'Country'];

    const toggleFieldSelection = (field) => {
        setSelectedFields((prevFields) =>
            prevFields.includes(field)
                ? prevFields.filter((f) => f !== field)
                : [...prevFields, field]
        );
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
                setSearchResults(response.data); // Populate results
                setCurrentPage(1); // Reset to the first page
            } else {
                setSearchResults([]); // Clear results if unexpected data structure
                setError('No matching destinations found.');
            }
        } catch (err) {
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

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

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

    const handleToggleCountries = async () => {
        if (!showCountries) {
            try {
                setLoading(true);
                const response = await axios.get('/api/countries');
                setCountries(response.data);
                setError('');
            } catch (err) {
                console.error('Error fetching countries:', err);
                setError('Failed to fetch countries.');
            } finally {
                setLoading(false);
            }
        }
        setShowCountries(!showCountries); 
      }

    const fetchDestinationById = async () => {
      if (!destinationId) {
        setError('Please enter a valid destination ID.');
        setDestinationById(null); 
        return;
      }
    
      setLoading(true);
      setError('');
    
      try {
        const response = await axios.get(`/api/destinations/${destinationId.trim()}`);
        setDestinationById(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching destination by ID:', err);
        if (err.response?.status === 404) {
          setError('Destination not found. Please enter a valid ID.');
        } else {
          setError('Failed to fetch destination by ID.');
        }
        setDestinationById(null);
      } finally {
        setLoading(false);
      }
    };
    
  
    return (
        <div className="guest-page">
          <div className="left-side">
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
      
            {/* Additional Functions */}
            <div className="additional-functions-container">
              <div className="function-buttons">
              <button className="toggle-countries-button" onClick={handleToggleCountries}>
  <span className="button-text">View All Countries</span>
  <span className={`arrow ${showCountries ? 'arrow-up' : 'arrow-down'}`}></span>
</button>


{showCountries && (
  <div className="countries-list-container">
    {countries.length > 0 ? (
      <div className="countries-columns">
        {countries.map((country, index) => (
          <div key={index} className="country-item">
            {country}
          </div>
        ))}
      </div>
    ) : (
      <p>No countries available.</p>
    )}
    {error && <p className="error">{error}</p>}
  </div>
)}

      
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter Destination ID"
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                  />
                  <button onClick={fetchDestinationById} disabled={loading}>
                    {loading ? 'Loading...' : 'Get Destination by ID'}
                  </button>
  {error && <p className="error-message">{error}</p>}
                </div>
              </div>
            </div>
            {destinationById && (
    <div className="destination-details-container">
      <h3 className="destination-title">{destinationById["﻿Destination"]}</h3>
      <div className="destination-details-grid">
        {/* Left Column */}
        <div className="details-column">
          <h4>General Information</h4>
          <p><strong>Country:</strong> {destinationById.Country}</p>
          <p><strong>Region:</strong> {destinationById.Region}</p>
          <p><strong>Category:</strong> {destinationById.Category}</p>
          <p><strong>Latitude:</strong> {destinationById.Latitude}</p>
          <p><strong>Longitude:</strong> {destinationById.Longitude}</p>
        </div>

        {/* Right Column */}
        <div className="details-column">
          <h4>Key Highlights</h4>
          <p><strong>Approximate Annual Tourists:</strong> {destinationById["Approximate Annual Tourists"]}</p>
          <p><strong>Cultural Significance:</strong> {destinationById["Cultural Significance"]}</p>
          <p><strong>Famous Foods:</strong> {destinationById["Famous Foods"]}</p>
          <p><strong>Description:</strong> {destinationById.Description}</p>
        </div>

        {/* Bottom Row */}
        <div className="details-row">
          <h4>Practical Information</h4>
          <p><strong>Currency:</strong> {destinationById.Currency}</p>
          <p><strong>Language:</strong> {destinationById.Language}</p>
          <p><strong>Best Time to Visit:</strong> {destinationById["Best Time to Visit"]}</p>
          <p><strong>Cost of Living:</strong> {destinationById["Cost of Living"]}</p>
          <p><strong>Safety:</strong> {destinationById.Safety}</p>
        </div>
      </div>
    </div>
  )}
</div>
      
          {/* Results Container */}
          <div className="results-container">
            <h2>Search Results</h2>
            <div className="pagination-controls">
              <div>
                <label htmlFor="results-per-page">
                  Results per page:
                  <select id="results-per-page" value={resultsPerPage} onChange={handleResultsPerPageChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </label>
              </div>
              <div className="pagination-buttons">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
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
      <li
        key={index}
        onClick={() => setDestinationById(result)} // Set clicked destination
        className="clickable-result"
      >
        <strong>{result["﻿Destination"]}</strong> - {result.Country}
        <p>{result.Description}</p>
        <p>
          <strong>Region:</strong> {result.Region}
        </p>
        <p>
          <strong>Category:</strong> {result.Category}
        </p>
      </li>
    ))
  ) : (
    !loading && error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>
  )}
</ul>
          </div>
        </div>
      );
}
export default Guest;