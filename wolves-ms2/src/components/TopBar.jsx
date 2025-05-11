// File: src/components/TopBar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';
import scadLogo from '../assets/scad-logo.png';
import menuIcon from '../assets/icons/menu-icon.png';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';

const TopBar = ({
  children,
  showSearch = true,
  onSearch,
  menuItems
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <nav className="topbar">
        <div className="topbar-left">
          <button 
            className="menu-button"
            onClick={() => setIsSidebarOpen(true)}
          >
            <img src={menuIcon} alt="Menu" className="menu-icon" />
          </button>
          <Link to="/" className="topbar-logo-link">
            <img src={scadLogo} alt="SCAD Logo" className="site-logo" />
          </Link>
          {showSearch && <SearchBar onSearch={onSearch} />}
        </div>

        <div className="topbar-right">
          {children}
        </div>
      </nav>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      >
        {menuItems}
      </Sidebar>
    </>
  );
};

export default TopBar;
