import React from 'react';
import './AppointmentCard.css';

const AppointmentCard = ({
  id,
  title,
  description,
  date,
  time,
  status,
  senderEmail,
  receiverEmail,
  currentUserEmail,
  onAccept,
  onReject,
  onStartCall,
  onAcceptCall
}) => {
  const isSender = currentUserEmail === senderEmail;
  const isReceiver = currentUserEmail === receiverEmail;

  const renderActions = () => {
    switch (status) {
      case 'pending':
        if (isReceiver) {
          return (
            <div className="appointment-actions">
              <button
                className="iv-btn accept"
                onClick={() => onAccept(id)}
              >
                Accept
              </button>
              <button
                className="iv-btn reject"
                onClick={() => onReject(id)}
              >
                Reject
              </button>
            </div>
          );
        }
        return null;

      case 'accepted':
        return (
          <div className="appointment-actions">
            <button
              className="iv-btn primary"
              onClick={() => onStartCall(id)}
            >
              Start Call
            </button>
          </div>
        );

      case 'scheduled':
        if (isReceiver) {
          return (
            <div className="appointment-actions">
              <button
                className="iv-btn accept"
                onClick={() => onAcceptCall(id)}
              >
                Accept Call
              </button>
            </div>
          );
        }
        return (
          <div className="appointment-actions">
            <button
              className="iv-btn primary"
              onClick={() => onStartCall(id)}
            >
              Start Call
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <h3>{title}</h3>
        <span className={`status-badge ${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="appointment-details">
        <p className="description">{description}</p>
        <div className="metadata">
          <div className="metadata-item">
            <span className="label">Date:</span>
            <span className="value">{date}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Time:</span>
            <span className="value">{time}</span>
          </div>
          <div className="metadata-item">
            <span className="label">{isSender ? 'To:' : 'From:'}</span>
            <span className="value">{isSender ? receiverEmail : senderEmail}</span>
          </div>
        </div>
      </div>

      {renderActions()}
    </div>
  );
};

export default AppointmentCard; 