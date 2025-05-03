import React from 'react';
import './TopBar.css';
import SearchBar from './SearchBar';
import scadLogo from '../assets/scad-logo.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon from '../assets/icons/eval-icon.png';
import profileIcon from '../assets/icons/profile-icon.png';
import notifIcon from '../assets/icons/notif-icon.png';

const TopBar = () => {
  return (
    <nav className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          <img src={scadLogo} alt="Site Logo" className="site-logo" />
        </div>
        <SearchBar />
      </div>
      <div className="topbar-right">
        <button className="topbar-button">
          <img src={internshipIcon} alt="Internships" className="topbar-icon" />
          <span className="topbar-label">Internships</span>
        </button>
        <button className="topbar-button">
          <img src={applicationIcon} alt="Applications" className="topbar-icon" />
          <span className="topbar-label">Applications</span>
        </button>
        <button className="topbar-button">
          <img src={evalIcon} alt="Evaluations" className="topbar-icon" />
          <span className="topbar-label">Evaluations</span>
        </button>
        <button className="topbar-button">
          <img src={notifIcon} alt="Notifications" className="topbar-icon" />
          <span className="topbar-label">Notifications</span>
        </button>
        <button className="topbar-button">
          <img src={profileIcon} alt="Profile" className="topbar-icon" />
          <span className="topbar-label">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default TopBar;