import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ProfileOverview from '../components/ProfileOverview';
import applicationsData from '../data/applications.json';
import studentsData     from '../data/students.json';
import internshipsData         from '../data/internships.json';
import './ApplicationDetails.css';

import ApplicationIcon from '../assets/icons/application-icon.png';
import MyPosts     from '../assets/icons/posts-icon.png';
import Interns     from '../assets/icons/interns-icon.png';
import NotificationIcon from '../assets/icons/notif-icon.png';
import HomeIcon from '../assets/icons/home-icon.png';
import LogoutIcon from '../assets/icons/logout-icon.png';
import CompanyNotifications from '../components/CompanyNotifications';
const MODAL_WIDTH = 340; // should match min-width in Notifications.css


const STATUS_OPTIONS = [
  'Pending',
  'Finalized',
  'Accepted',
  'Current Intern',
  'Internship Complete',
  'Rejected'
];

const sampleDoc = require('../assets/docs/sample.pdf');

export default function ApplicationDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [applications, setApplications] = useState(() => {
    const stored = sessionStorage.getItem('applications');
    return stored ? JSON.parse(stored) : applicationsData;
  });
  
  const application = applications.find(a => String(a.id) === id) || {};
  const [status, setStatus] = useState(application.status || 'Pending');
  const student = studentsData.find(s => String(s.id) === String(application.studentId)) || {};
  const internship = internshipsData.find(i => String(i.id) === String(application.internshipId)) || {};

  const jobInterests = ['UI/UX Design', 'Frontend Development', 'React'];
  const prevInterns  = ['Web Intern @ Acme Co.', 'Research Asst. @ GUC'];
  const activities   = ['Media Engineering Club', 'Robotics Team', 'AI Study Group'];

  const handleStatusChange = e => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    
    // Update application status in sessionStorage
    const updatedApplications = applications.map(app =>
      String(app.id) === id ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);
    sessionStorage.setItem('applications', JSON.stringify(updatedApplications));
    
    // Dispatch custom event for immediate update
    window.dispatchEvent(new Event('applications-updated'));
  };

  const statusClass = status.toLowerCase().replace(/\s+/g,'-');

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);

  const handleNotifClick = (e) => {
    const rect = notifBtnRef.current.getBoundingClientRect();
    let left = rect.right - MODAL_WIDTH;
    if (left < 8) left = 8; // prevent going off the left edge
    setNotifPosition({
      top: rect.bottom + 8, // 8px below the button
      left,
    });
    setShowNotifications(true);
  };

    const menuItems = (
      <>
        <Link to="/company-home" className="sidebar-item">
          <img src={HomeIcon} alt="Dashboard" className="sidebar-icon" />
          <span>Dashboard</span>
        </Link>
        <Link to="/company-posts" className="sidebar-item">
          <img src={MyPosts} alt="My posts" className="sidebar-icon" />
          <span>My Posts</span>
        </Link>
        <Link to="/company-applications" className="sidebar-item">
          <img src={ApplicationIcon} alt="Applications" className="sidebar-icon" />
          <span>Applications</span>
        </Link>
        <Link to="/company-interns" className="sidebar-item">
          <img src={Interns} alt="Interns" className="sidebar-icon" />
          <span>Interns</span>
        </Link>
        <Link to="/login" className="sidebar-item">
          <img src={LogoutIcon} alt="Logout" className="sidebar-icon" />
          <span>Logout</span>
        </Link>
      </>
    );

  return (
    <div className="ad-dashboard">
        <TopBar showSearch={false} menuItems={menuItems}>
        <CompanyNotifications />
        <button
          className="topbar-button"
          ref={notifBtnRef}
          onClick={handleNotifClick}
        >
          <img src={NotificationIcon} alt="Notifications" className="topbar-icon" />
          <span>Notifications</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/company-home')}>
          <img src={HomeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/login')}>
          <img src={LogoutIcon} alt="logout" className="topbar-icon" />
          <span>Logout</span>
        </button>
      </TopBar>

      <div className="ad-main">
        <aside className="ad-sidebar">
          <ProfileOverview
            name={student.name}
            email={student.email}
            major={student.major}
            status={student.status}
            completedMonths={student.completedMonths}
            totalMonths={3}
            hideCycle={true}
            profileUrl={`/student-profile`}
            profilePicture={student.profilePicture}
          />
        </aside>

        <section className="ad-content">
          <div className="ad-card">
          <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
          <h2 className="ad-title">
            Applicant Overview — {internship.title} @ {internship.company}
            </h2>

            <div className="ad-section">
              <h3>Contact & Major</h3>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Major:</strong> {student.major}</p>
            </div>

            <div className="ad-section">
              <h3>Job Interests</h3>
              <ul>
                {jobInterests.map((i,idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>

            <div className="ad-section">
              <h3>Previous Internships</h3>
              <ul>
                {prevInterns.map((i,idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>

            <div className="ad-section">
              <h3>College Activities</h3>
              <ul>
                {activities.map((a,idx) => <li key={idx}>{a}</li>)}
              </ul>
            </div>

            <div className="ad-section">
              <h3>Documents</h3>
              <ul className="ad-docs">
                <li><a href={sampleDoc} download>Download CV</a></li>
                <li><a href={sampleDoc} download>Download Cover Letter</a></li>
                <li><a href={sampleDoc} download>Download Certificates</a></li>
              </ul>
            </div>

            <div className="ad-section status-block">
              <h3>Status</h3>
              <select
                className={`ad-status-select ${statusClass}`}
                value={status}
                onChange={handleStatusChange}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
