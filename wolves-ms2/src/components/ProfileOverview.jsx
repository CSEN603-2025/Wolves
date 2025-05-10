// File: src/components/ProfileOverview.jsx
import React, { useState, useEffect } from 'react';
import './ProfileOverview.css';
import defaultPic from '../assets/icons/default-pp.png';

const ProfileOverview = ({
  name,
  email,
  major,
  status,
  completedMonths,
  totalMonths,
  profileUrl,
  profilePicture,
  hideMajor = false,
  hideProgress = false,
  children
}) => {
  const [cycleState, setCycleState] = useState({
    state: 'Inactive',
    start: 'Not Started',
    end: 'Not Started'
  });

  useEffect(() => {
    // Get cycle dates from sessionStorage
    const cycleStart = sessionStorage.getItem('cycleStart');
    const cycleEnd = sessionStorage.getItem('cycleEnd');

    if (cycleStart && cycleEnd) {
      const now = new Date();
      const start = new Date(cycleStart);
      const end = new Date(cycleEnd);
      
      // Determine cycle state
      const state = (now >= start && now <= end) ? 'Active' : 'Inactive';
      
      setCycleState({
        state,
        start: start.toLocaleDateString(),
        end: end.toLocaleDateString()
      });
    }

    // Listen for changes in sessionStorage
    const handleStorageChange = () => {
      const newStart = sessionStorage.getItem('cycleStart');
      const newEnd = sessionStorage.getItem('cycleEnd');
      
      if (newStart && newEnd) {
        const now = new Date();
        const start = new Date(newStart);
        const end = new Date(newEnd);
        
        const state = (now >= start && now <= end) ? 'Active' : 'Inactive';
        
        setCycleState({
          state,
          start: start.toLocaleDateString(),
          end: end.toLocaleDateString()
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    <div className="profile-overview">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img src={pic} className="profile-avatar" alt="avatar"/>
          {status === 'Pro' && (
            <div className="pro-badge">
              <img src={verf} className="verified-icon" alt="verified"/>
              <span>Pro</span>
            </div>
          )}
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{name}</h2>
          <div className="profile-email">
            <span>{email}</span>
          </div>
          <div className="profile-major">
            <span>{major}</span>
          </div>
        </div>
      </div>

      {!hideProgress && (
        <div className="progress-section">
          <div className="progress-header">
            <span>Internship Progress</span>
            <span className="progress-percentage">{percent}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="progress-text">
            {completedMonths} of {totalMonths} months completed
          </p>
        </div>
      )}

      <div className="cycle-section">
        <h3>Current Cycle</h3>
        <div className={`cycle-status ${cycleState.state.toLowerCase()}`}>
          <span className="status-label">Status:</span>
          <span className="status-value">{cycleState.state}</span>
        </div>
        <div className="cycle-dates">
          <div className="date-item">
            <span className="date-label">Start:</span>
            <span className="date-value">{cycleState.start}</span>
          </div>
          <div className="date-item">
            <span className="date-label">End:</span>
            <span className="date-value">{cycleState.end}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
