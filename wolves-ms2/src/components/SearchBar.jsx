// File: src/components/SearchBar.jsx

import React from 'react';
import './SearchBar.css';
import searchIcon from '../assets/icons/search-logo.jpg';
import arrowIcon from '../assets/icons/search-arrow.png';

const SearchBar = () => {
  return (
    <div className="search-bar refined">
      <div className="search-icon">
        <img src={searchIcon} alt="Search" className="icon-image" />
      </div>
      <input type="text" placeholder="Job title..." className="search-field refined" />
      <div className="separator" />
      <input type="text" placeholder="Company..." className="search-field refined" />
      <button className="search-go refined">
        <img src={arrowIcon} alt="Go" className="arrow-image" />
      </button>
    </div>
  );
};

export default SearchBar;
