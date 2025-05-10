import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StudentCard.css';
import defaultPic from '../assets/icons/default-pp.png';

const StudentCard = ({ id, name, email, major, status, avatar, internshipStatus, completedMonths = 0, totalMonths = 3 }) => {
  const navigate = useNavigate();
  const srcLocation = useLocation();
  let pic;
  try {
    pic = require(`../assets/${avatar}`);
  } catch {
    pic = defaultPic;
  }

  const handleClick = () => {
    navigate(`/admin/students/${id}`, { state: { from: srcLocation.pathname } });
  };

  const percent = totalMonths > 0 ? Math.round((completedMonths / totalMonths) * 100) : 0;

  return (
    <button type="button" className="student-card-row" onClick={handleClick}>
      <div className="student-avatar-wrapper">
        <img src={pic} alt={name} className="student-avatar" />
      </div>
      <div className="student-info">
        <div className="student-header">
          <h3 className="student-name">{name}</h3>
          <div className="student-email">{email}</div>
          <div className="student-major">{major}</div>
        </div>
        <div className="student-status-bar-row">
          <div className={`student-status status-${(internshipStatus || '').toLowerCase().replace(/\s+/g, '-')}`}>{internshipStatus}</div>
          <div className="student-progress-bar">
            <div className="student-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="student-progress-label">{completedMonths} of {totalMonths} months completed</div>
        </div>
      </div>
    </button>
  );
};

export default StudentCard; 