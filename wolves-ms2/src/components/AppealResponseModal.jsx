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
      <div className="appeal-response-modal-overlay" onClick={onClose} />
      <div className="appeal-response-modal">
        <button 
          className="appeal-response-modal-close-btn" 
          onClick={onClose} 
          aria-label="Close appeal response modal"
        >
          &times;
        </button>
        <h2 className="appeal-response-modal-title">
          Respond to Appeal from {studentName}
        </h2>
        <div className="appeal-response-modal-content">
          <div className="appeal-details">
            <div className="original-decision">
              <h4>Original Decision:</h4>
              <p><strong>Status:</strong> {originalStatus}</p>
              <p><strong>Comments:</strong> {originalComments}</p>
            </div>
            <div className="student-appeal">
              <h4>Student's Appeal:</h4>
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
            <div className="form-actions">
              <button type="submit" className="iv-btn primary">
                Submit Response
              </button>
              <button 
                type="button" 
                className="iv-btn secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AppealResponseModal; 