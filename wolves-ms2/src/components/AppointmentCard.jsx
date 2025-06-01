import React, { useState } from 'react';
import './AppointmentCard.css';
import VideoCall from './VideoCall';

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
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [hasCallEnded, setHasCallEnded] = useState(false);
  const isSender = currentUserEmail === senderEmail;
  const isReceiver = currentUserEmail === receiverEmail;
  const isAdmin = currentUserEmail === 'admin@guc.edu.eg';

  const handleStartCall = () => {
    console.log('Starting call request for appointment:', id);
    onStartCall(id);
  };

  const handleAcceptCall = () => {
    console.log('Accepting call for appointment:', id);
    onAcceptCall(id);
    setShowVideoCall(true);
  };

  const handleCallEnd = () => {
    console.log('Ending call for appointment:', id);
    setShowVideoCall(false);
    setHasCallEnded(true);
  };

  const renderActions = () => {
    // If the call has ended, show a message
    if (hasCallEnded) {
      return (
        <div className="appointment-actions">
          <button
            className="iv-btn primary"
            disabled
          >
            Call Concluded
          </button>
        </div>
      );
    }

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

      case 'scheduled':
        // If the current user is the one who initiated the call request
        if (isSender) {
          return (
            <div className="appointment-actions">
              <button
                className="iv-btn primary"
                onClick={handleStartCall}
              >
                Start Call
              </button>
            </div>
          );
        }
        // If the current user is the receiver of the call request
        // return (
        //   <div className="appointment-actions">
        //     <button
        //       className="iv-btn accept"
        //       onClick={handleAcceptCall}
        //     >
        //       Accept Call
        //     </button>
        //     <button
        //       className="iv-btn reject"
        //       onClick={() => onReject(id)}
        //     >
        //       Reject Call
        //     </button>
        //   </div>
        // );

      case 'waiting':
        if (isSender) {
          return (
            <div className="appointment-actions">
              <button
                className="iv-btn primary"
                disabled
              >
                Waiting for Response...
              </button>
            </div>
          );
        }
        return (
          <div className="appointment-actions">
            <button
              className="iv-btn accept"
              onClick={handleAcceptCall}
            >
              Accept Call
            </button>
            <button
              className="iv-btn reject"
              onClick={() => onReject(id)}
            >
              Reject Call
            </button>
          </div>
        );

      case 'concluded':
        return (
          <div className="appointment-actions">
            <button
              className="iv-btn primary"
              disabled
            >
              Call Concluded
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
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
            {(status === 'scheduled' || status === 'waiting') && (
              <div className="metadata-item">
                <span className="label">User Status:</span>
                <span className="value online-status">Online</span>
              </div>
            )}
          </div>
        </div>

        {renderActions()}
      </div>

      <VideoCall
        isOpen={showVideoCall}
        onClose={handleCallEnd}
        isAdmin={isAdmin}
        appointmentId={id}
        onCallEnd={handleCallEnd}
      />
    </>
  );
};

export default AppointmentCard; 