import React, { useState } from 'react';
import './SearchBar.css';
import searchIcon from '../assets/icons/search-logo.png';
import arrowIcon from '../assets/icons/search-arrow.png';

const SearchBar = ({ onSearch }) => {
  const [title,   setTitle]   = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (onSearch) onSearch(title.trim(), company.trim());
  };

  return (
    <form className="search-bar refined" onSubmit={handleSubmit}>
      <div className="search-icon">
        <img src={searchIcon} alt="Search" className="icon-image" />
      </div>

      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Job title..."
          className="search-field refined"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        {title && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => setTitle('')}
            aria-label="Clear title"
          >
            ×
          </button>
        )}
      </div>

      <div className="separator" />

      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Company..."
          className="search-field refined"
          value={company}
          onChange={e => setCompany(e.target.value)}
        />
        {company && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => setCompany('')}
            aria-label="Clear company"
          >
            ×
          </button>
        )}
      </div>

      <button type="submit" className="search-go refined">
        <img src={arrowIcon} alt="Go" className="arrow-image" />
      </button>
    </form>
  );
};

export default SearchBar;
