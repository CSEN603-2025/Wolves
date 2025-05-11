import React from 'react';
import './Notifications.css';

const Notifications = ({ isOpen, onClose, children, position }) => {
  if (!isOpen) return null;
  const modalStyle = position
    ? {
        position: 'fixed',
        top: position.top,
        left: position.left,
        transform: 'none',
      }
    : {};
  return (
    <>
      <div className="notifications-overlay" onClick={onClose} />
      <div className="notifications-modal" style={modalStyle}>
        <button className="notifications-close-btn" onClick={onClose} aria-label="Close notifications">&times;</button>
        <div className="notifications-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default Notifications; 