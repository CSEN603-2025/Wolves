// File: src/components/TopBar.jsx

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  // List of paths where sidebar should be hidden
  const hideSidebarPaths = ['/', '/login', '/register-company','/student-profile','/all-internships',
    '/internships/:id','/student-applications','/student-internships','/student-report/:id','/student-appointments',
    '/student-workshops','/workshop/:id'];
  
  // Check if current path should hide sidebar
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <nav className="topbar">
        <div className="topbar-left">
          {!shouldHideSidebar && (
            <button 
              className="menu-button"
              onClick={() => setIsSidebarOpen(true)}
            >
              <img src={menuIcon} alt="Menu" className="menu-icon" />
            </button>
          )}
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
