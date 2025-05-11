import React from 'react';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, children }) => {
  const location = useLocation();
  
  // List of paths where sidebar should be hidden
  const hiddenPaths = ['/', '/login', '/register-company'];
  
  // If current path is in hiddenPaths, don't render the sidebar
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {isOpen && createPortal(
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            pointerEvents: 'auto'
          }}
        />,
        document.body
      )}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">&times;</button>
        <div className="sidebar-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default Sidebar; 