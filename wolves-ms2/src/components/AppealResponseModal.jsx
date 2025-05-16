import React from 'react';
import './AppealResponseModal.css';

const AppealResponseModal = ({ 
  isOpen, 
  onClose, 
  studentName, 
  originalStatus, 
  originalComments, 
  appealMessage, 
  onSubmit, 
  responseMessage, 
  setResponseMessage 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="arm-modal-overlay" onClick={onClose} />
      <div className="arm-modal">
        <div className="arm-modal-content">
          <div className="arm-modal-header">
            <h2 className="arm-modal-title">Appeal Response</h2>
            <button className="arm-modal-close" onClick={onClose}>×</button>
          </div>
          <div className="arm-modal-body">
            <div className="appeal-details">
              <div className="original-decision">
                <h3>Original Decision</h3>
                <p><strong>Status:</strong> {originalStatus}</p>
                <p><strong>Comments:</strong> {originalComments}</p>
              </div>
              <div className="student-appeal">
                <h3>Student's Appeal</h3>
                <p>{appealMessage}</p>
              </div>
            </div>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="response-message">Your Response:</label>
                <textarea
                  id="response-message"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  required
                  placeholder="Please provide your response to the student's appeal..."
                  rows={4}
                />
              </div>
            </form>
            <div className="arm-modal-footer">
              <button className="arm-modal-button arm-modal-button-primary" type="submit">Submit Response</button>
              <button className="arm-modal-button arm-modal-button-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppealResponseModal; 