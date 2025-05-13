import React from 'react';
import './WorkshopCard.css';
import { FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';

const WorkshopCard = ({ workshop, onAction }) => {
  const {
    id,
    name,
    status,
    type,
    startDate,
    endDate,
    startTime,
    endTime,
    shortDescription,
    speakerBio
  } = workshop;

  const getStatusText = () => {
    switch (status) {
      case 'unregistered':
        return 'Click to Register';
      case 'soon':
        return 'Upcoming';
      case 'live':
        return 'Live Now';
      case 'pre-recorded':
        return 'Watch Recording';
      case 'concluded':
        return 'View Details';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="workshop-card" onClick={onAction}>
      <div className="workshopcard-header-row">
        <h3 className="workshop-title">{name}</h3>
        <span className={`status-badge-pill ${status}`}>{getStatusText()}</span>
      </div>
      <p className="workshop-description">{shortDescription}</p>
      <div className="workshop-details-row">
        <div className="workshop-detail-item">
          <FaCalendarAlt className="workshop-detail-icon" />
          <span>{startDate}</span>
        </div>
        <div className="workshop-detail-divider" />
        <div className="workshop-detail-item">
          <FaClock className="workshop-detail-icon" />
          <span>{startTime} - {endTime}</span>
        </div>
        <div className="workshop-detail-divider" />
        <div className="workshop-detail-item">
          <FaUser className="workshop-detail-icon" />
          <span>{speakerBio}</span>
        </div>
        {status === 'live' && (
          <span className="live-badge">Live Now</span>
        )}
      </div>
    </div>
  );
};

export default WorkshopCard; 