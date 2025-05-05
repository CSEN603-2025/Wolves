// File: src/pages/StudentHome.jsx

import React from 'react';
import './StudentHome.css';

import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import InternshipCard from '../components/InternshipCard';
import ProfileOverview from '../components/ProfileOverview';

import internshipIcon  from '../assets/icons/internships-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon        from '../assets/icons/eval-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import profileIcon     from '../assets/icons/profile-icon.png';

import internshipsData from '../data/internships.json';

const StudentHome = () => {
  const { user } = useAuth();

  // Only Finance or Marketing roles
  const internships = internshipsData.filter(i => {
    if (user.id === '1') {
      // MET student sees only IT roles
      return i.department === 'IT';
    }
    if (user.id === '2') {
      // Management student sees Finance or Marketing
      return i.department === 'Finance' || i.department === 'Marketing';
    }
    // fallback: show nothing (or all, if you prefer)
    return false;
  });

  return (
    <div className="dashboard-container">
      {/* TopBar now just renders logo/search + whatever children you pass in */}
      <TopBar>
        <button className="topbar-button">
          <img src={internshipIcon}  alt="Internships" className="topbar-icon" />
          <span>Internships</span>
        </button>
        <button className="topbar-button">
          <img src={applicationIcon} alt="Applications" className="topbar-icon" />
          <span>Applications</span>
        </button>
        <button className="topbar-button">
          <img src={evalIcon}        alt="Evaluations" className="topbar-icon" />
          <span>Evaluations</span>
        </button>
        <button className="topbar-button">
          <img src={notifIcon}       alt="Notifications" className="topbar-icon" />
          <span>Notifications</span>
        </button>
        <button className="topbar-button">
          <img src={profileIcon}     alt="Profile" className="topbar-icon" />
          <span>Profile</span>
        </button>

        {/* PRO-ONLY FEATURES: uncomment when ready */}
        {/*
        {user?.status === 'Pro' && (
          <>
            <button className="topbar-button">
              <img src={proIcon1} alt="Pro Feature 1" className="topbar-icon" />
              <span>Pro Feature 1</span>
            </button>
            <button className="topbar-button">
              <img src={proIcon2} alt="Pro Feature 2" className="topbar-icon" />
              <span>Pro Feature 2</span>
            </button>
          </>
        )}
        */}
      </TopBar>

      <div className="main-content">
        <aside className="sidebar">
          <ProfileOverview
            name={user.name}
            status={user.status}
            completedMonths={user.completedMonths}
            totalMonths={3}
            cycle={{ state: 'Active', start: 'March 1, 2025', end: 'June 1, 2025' }}
            profileUrl={user.profileUrl}
            profilePicture={user.profilePicture}
            major={user.major}
            email={user.email}
          >
            {/* Common nav buttons */}
            <button className="po-btn">
              <img src={notifIcon} alt="Notifications" /> Notifications
            </button>
            <button className="po-btn">
              <img src={applicationIcon} alt="Applications" /> Applications
            </button>
            <button className="po-btn">
              <img src={evalIcon} alt="Evaluations" /> Evaluations
            </button>

            {/* PRO-ONLY BUTTONS: */}
            {/*
            {user.status === 'Pro' && (
              <button className="po-btn">
                <img src={proIcon3} alt="Pro Section" /> Pro Section
              </button>
            )}
            */}
          </ProfileOverview>
        </aside>

        <section className="internship-section">
          <h2 className="section-title">Suggested for you!</h2>
          <div className="internship-cards">
            {internships.map((i) => (
              <InternshipCard key={i.id} {...i} />
            ))}
          </div>
        </section>
      </div>

      <footer className="footer">
        GUC Internship Platform © 2025
      </footer>
    </div>
  );
};

export default StudentHome;
