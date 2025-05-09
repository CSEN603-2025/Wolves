// File: src/components/SearchBar.jsx
import React, { useState } from 'react';
import './SearchBar.css';
import searchIcon from '../assets/icons/search-logo.png';
import searchArrow from '../assets/icons/search-arrow.png';

const SearchBar = ({ onSearch, companySearch = false }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');

  const handleClear = (setter) => () => setter('');

  const handleSubmit = e => {
    e.preventDefault();
    if (companySearch) {
      if (onSearch) onSearch(title); // Only pass the company name
    } else {
      if (onSearch) onSearch(title, company);
    }
  };

  return (
    <form className="search-bar refined" onSubmit={handleSubmit}>
      <div className="search-field-wrapper">
        <img src={searchIcon} alt="Search" className="icon-image" />
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={companySearch ? "Company..." : "Job title..."}
          className="search-field refined"
        />
        {title && (
          <button
            type="button"
            className="clear-btn"
            onClick={handleClear(setTitle)}
          >
            ×
          </button>
        )}
      </div>

      {!companySearch && <div className="separator" />}

      {!companySearch && (
        <div className="search-field-wrapper">
          <input
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="Company..."
            className="search-field refined"
          />
          {company && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear(setCompany)}
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
