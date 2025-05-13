import React from 'react';
import './LiveModal.css';

const LiveModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="live-modal-overlay">
      <div className="live-modal-content">
        <div className="live-modal-header">
          <h2 className="live-modal-title">{title}</h2>
          <button className="live-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="live-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LiveModal; 