// File: src/components/ProfileOverview.jsx
import React from 'react';
import './ProfileOverview.css';
import defaultPic from '../assets/icons/default-pp.png';

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
  hideMajor = false,
  hideProgress = false,
  hideCycle=false,
  children   // any extra buttons
}) => {

  const percent = totalMonths > 0
    ? Math.round((completedMonths / totalMonths) * 100)
    : 0;
    let pic;
    try {
      pic = require(`../assets/${profilePicture}`);
    } catch (err) {
      pic = defaultPic;
    }
  const verf = require(`../assets/icons/blue-tick.png`);

  return (
    <div className="profile-overview-new">
      <header className="po-header">
          <img src={pic} className="po-avatar" alt="avatar"/>
        <div className="po-name-wrap">
          <h2 className="po-name">{name}</h2>
          {status === 'Pro' && (
            <img src={verf} className="po-verified" alt="verified"/>
          )}
        </div>
      </header>

      <div className="po-info">
        <p className="po-email">{email}</p>
        {!hideMajor && (
          <p className="po-major">Major: {major}</p>
        )}
      </div>

      {!hideProgress && (
        <div className="po-progress">
          <div className="po-progress-bar">
            <div
              className="po-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="po-progress-text">
            {completedMonths} of {totalMonths} months completed
          </span>
        </div>
      )}

      {!hideCycle &&(<div className="po-cycle">
        <span className="po-cycle-label">Internship Cycle</span>
        <span className={`po-cycle-state ${cycle.state.toLowerCase()}`}>
          {cycle.state}
        </span>
        <p className="po-cycle-dates">
          {cycle.start} – {cycle.end}
        </p>
      </div>)}

      <div className="po-nav">
        {children /* page–specific buttons go here */}
      </div>
    </div>
  );
};

export default ProfileOverview;
