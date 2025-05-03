// File: src/components/ProfileOverview.jsx

import React from 'react';
import './ProfileOverview.css';
import profilePic from '../assets/icons/pp.png';
import verifiedIcon from '../assets/icons/blue-tick.png';
import notifIcon from '../assets/icons/notif-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon from '../assets/icons/eval-icon.png';

const ProfileOverview = () => {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <img src={profilePic} alt="Profile" className="profile-image" />
        <div className="profile-info">
          <div className="profile-name-line">
            <a href="/profile" className="profile-name">Yahia Hesham</a>
            <img src={verifiedIcon} alt="Verified" className="verified-icon-inline" />
          </div>
          <div className="profile-major">Major: Computer Science</div>
          <div className="profile-internship">Completed: 6 months</div>
        </div>
      </div>

      <div className="internship-cycle">
        Internship Cycle:
        <strong> Active</strong>
        <p className="cycle-dates">March 2025 – June 2025</p>
      </div>

      <div className="profile-buttons">
        <button className="profile-button">
          <img src={notifIcon} alt="Notifications" className="button-icon" /> Notifications
        </button>
        <button className="profile-button">
          <img src={applicationIcon} alt="Applications" className="button-icon" /> Applications
        </button>
        <button className="profile-button">
          <img src={evalIcon} alt="Evaluations" className="button-icon" /> Evaluations
        </button>
      </div>
    </div>
  );
};

export default ProfileOverview;
