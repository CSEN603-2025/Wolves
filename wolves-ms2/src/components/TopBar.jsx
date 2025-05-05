// File: src/components/TopBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';
import scadLogo from '../assets/scad-logo.png';
import SearchBar from './SearchBar';

const TopBar = ({ children, showSearch = true }) => (
  <nav className="topbar">
    <div className="topbar-left">
      <Link to="/" className="topbar-logo-link">
        <img src={scadLogo} alt="SCAD Logo" className="site-logo" />
      </Link>
      {showSearch && <SearchBar />}
    </div>
    <div className="topbar-right">{children}</div>
  </nav>
);

export default TopBar;
