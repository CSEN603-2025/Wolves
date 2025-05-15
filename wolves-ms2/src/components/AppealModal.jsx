import React from 'react';
import './AppealModal.css';

const AppealModal = ({ isOpen, onClose, title, comments, onSubmit, appealMessage, setAppealMessage }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="appeal-modal-overlay" onClick={onClose} />
      <div className="appeal-modal">
        <button className="appeal-modal-close-btn" onClick={onClose} aria-label="Close appeal modal">&times;</button>
        <h2 className="appeal-modal-title">{title}</h2>
        <div className="appeal-modal-content">
          <div className="report-comments">
            <h4>Comments:</h4>
            <p>{comments}</p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="appeal-message">Your Appeal Message:</label>
              <textarea
                id="appeal-message"
                value={appealMessage}
                onChange={(e) => setAppealMessage(e.target.value)}
                required
                placeholder="Please explain why you believe this decision should be reconsidered..."
                rows={4}
              />
            </div>
            <button type="submit" className="iv-btn primary">
              Submit Appeal
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AppealModal; 