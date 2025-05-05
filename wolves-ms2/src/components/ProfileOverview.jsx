// File: src/components/ProfileOverview.jsx
import React from 'react';
import './ProfileOverview.css';

const ProfileOverview = ({
  name,
  email,
  major,
  status,
  completedMonths,
  totalMonths,
  cycle,
  profileUrl,
  profilePicture,
  children   // any extra buttons
}) => {
  const percent = (completedMonths / totalMonths) * 100;
  const pic = require(`../assets/icons/${profilePicture}`);
  const verf = require(`../assets/icons/blue-tick.png`);

  return (
    <div className="profile-overview-new">
      <header className="po-header">
        <a href={profileUrl} className="po-avatar-link">
          <img src={pic} className="po-avatar" alt="avatar"/>
        </a>
        <div className="po-name-wrap">
          <a href={profileUrl} className="po-name-link">
            <h2 className="po-name">{name}</h2>
          </a>
          {status === 'Pro' && (
            <img src={verf} className="po-verified" alt="verified"/>
          )}
        </div>
      </header>

      {/* new email & major block */}
      <div className="po-info">
        <p className="po-email">{email}</p>
        <p className="po-major">Major: {major}</p>
      </div>

      <div className="po-progress">
        <div className="po-progress-bar">
          <div className="po-progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="po-progress-text">
          {completedMonths} of {totalMonths} months completed
        </span>
      </div>

      <div className="po-cycle">
        <span className="po-cycle-label">Internship Cycle</span>
        <span className={`po-cycle-state ${cycle.state.toLowerCase()}`}>
          {cycle.state}
        </span>
        <p className="po-cycle-dates">
          {cycle.start} – {cycle.end}
        </p>
      </div>

      <div className="po-nav">
        {children /* page-specific buttons go here */}
      </div>
    </div>
  );
};

export default ProfileOverview;
