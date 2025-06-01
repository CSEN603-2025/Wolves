import React from 'react';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, children }) => {
  const location = useLocation();
  
  // List of paths where sidebar should be hidden
  const hiddenPaths = ['/', '/login', '/register-company','/student-profile','/all-internships',
    '/internships/:id','/student-applications','/student-internships','/student-report/:id','/student-appointments',
    '/student-workshops','/workshop/:id'];
  
  // If current path is in hiddenPaths, don't render the sidebar
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  // Always render the sidebar for smooth transition
  return createPortal(
    <>
      {/* Overlay first */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      {/* Sidebar after overlay */}
      <div className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-content">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};

export default Sidebar; 