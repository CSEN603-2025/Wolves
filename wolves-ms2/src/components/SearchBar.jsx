// File: src/components/SearchBar.jsx
import React, { useState } from 'react';
import './SearchBar.css';
import searchIcon from '../assets/icons/search-logo.png';
import searchArrow from '../assets/icons/search-arrow.png';

const SearchBar = ({ 
  onSearch, 
  companySearch = false,
  placeholderPrimary = "Job title...",
  placeholderSecondary = "Company...",
  showSecondary = true
}) => {
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');

  const handleClear = (setter) => () => setter('');

  const handleSubmit = e => {
    e.preventDefault();
    if (companySearch) {
      if (onSearch) onSearch(primary); // Only pass the primary field
    } else {
      if (onSearch) onSearch(primary, secondary);
    }
  };

  return (
    <form className="search-bar refined" onSubmit={handleSubmit}>
      <div className="search-field-wrapper">
        <img src={searchIcon} alt="Search" className="icon-image" />
        <input
          type="text"
          value={primary}
          onChange={e => setPrimary(e.target.value)}
          placeholder={placeholderPrimary}
          className="search-field refined"
        />
        {primary && (
          <button
            type="button"
            className="clear-btn"
            onClick={handleClear(setPrimary)}
          >
            ×
          </button>
        )}
      </div>

      {showSecondary && <div className="separator" />}

      {showSecondary && (
        <div className="search-field-wrapper">
          <input
            type="text"
            value={secondary}
            onChange={e => setSecondary(e.target.value)}
            placeholder={placeholderSecondary}
            className="search-field refined"
          />
          {secondary && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear(setSecondary)}
            >
              ×
            </button>
          )}
        </div>
      )}

      <button type="submit" className="search-go refined">
        <img src={searchArrow} alt="Go" className="arrow-image" />
      </button>
    </form>
  );
};

export default SearchBar;
