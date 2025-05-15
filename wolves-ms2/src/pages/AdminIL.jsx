// File: src/pages/InternshipListing.jsx
import React, { useState, useRef } from 'react';
import { useParams, useNavigate,useLocation,Link  } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import internshipsData from '../data/internships.json';
import './InternshipListing.css';

import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';

import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';

const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const AdminIL = () => {
  const { id }         = useParams();
  const internship     = internshipsData.find(i => String(i.id) === id);
  const { user }       = useAuth();
  const navigate       = useNavigate();
  const srcLocation = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);

  // modal + form state...
  const [showModal, setShowModal]         = useState(false);
  const [cvFile, setCvFile]               = useState(null);
  const [coverFile, setCoverFile]         = useState(null);
  const [extras, setExtras]               = useState([]);
  const [submitting, setSubmitting]       = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  if (!internship) {
    return <div className="listing-page"><p>Internship not found.</p></div>;
  }

  const {
    title, company, location,
    industry, duration, paid,
    salary, description, skills,
    logo, status, count
  } = internship;

  console.log('state:', srcLocation.state);


  const newStatus= srcLocation.state?.from === '/student-internships' ? 'Current Intern' : status;

  const logoSrc = require(`../assets/companies/${logo}`);

  const handleOpenModal = () => {
    setShowModal(true);
    setSubmitMessage(null);
    setCvFile(null);
    setCoverFile(null);
    setExtras([]);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleCvChange     = e => setCvFile(e.target.files[0]);
  const handleCoverChange  = e => setCoverFile(e.target.files[0]);
  const handleExtrasChange = e => setExtras([...e.target.files]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!cvFile) return;
    setSubmitting(true);
    setSubmitMessage(null);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitMessage('Your application has been submitted!');
    }, 1200);
  };
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
      <Link to="/admin-home" className="sidebar-item">
        <img src={homeIcon} alt="Dashboard" className="sidebar-icon" />
        <span>Dashboard</span>
      </Link>
      <Link to="/admin-home/companies" className="sidebar-item">
        <img src={companyIcon} alt="Companies" className="sidebar-icon" />
        <span>Companies</span>
      </Link>
      <Link to="/admin-home/internships" className="sidebar-item">
        <img src={internshipIcon} alt="Internships" className="sidebar-icon" />
        <span>Internships</span>
      </Link>
      <Link to="/admin/students" className="sidebar-item">
        <img src={studentIcon} alt="Students" className="sidebar-icon" />
        <span>Students</span>
      </Link>
      <Link to="/admin/workshops" className="sidebar-item">
        <img src={workshopIcon} alt="Workshops" className="sidebar-icon" />
        <span>Workshops</span>
      </Link>
      <Link to="/admin/reports" className="sidebar-item">
        <img src={reportsIcon} alt="Reports" className="sidebar-icon" />
        <span>Reports</span>
      </Link>
      <Link to="/admin-appointments" className="sidebar-item">
        <img src={appointmentIcon} alt="apointments" className="sidebar-icon" />
        <span>Appointments</span>
      </Link>
      <Link to="/admin/notifications" className="sidebar-item">
        <img src={notificationIcon} alt="Notifications" className="sidebar-icon" />
        <span>Notifications</span>
      </Link>
      <Link to="/login" className="sidebar-item">
        <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
        <span>Logout</span>
      </Link>
    </>
  );

  return (
    <div className="listing-page">
      <TopBar showSearch={false} menuItems={menuItems}>
      <button
          className="topbar-button"
          ref={notifBtnRef}
          onClick={handleNotifClick}
        >
          <img src={notificationIcon} alt="Notifications" className="topbar-icon" />
          <span>Notifications</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/admin-home')}>
          <img src={homeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/login')}>
          <img src={logoutIcon} alt="logout" className="topbar-icon" />
          <span>Logout</span>
        </button>
      </TopBar>

      <main className="listing-main">
        {/* ← Back button */}
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <div className="listing-header">
          <img src={logoSrc} alt={`${company} logo`} className="listing-logo" />
          <div>
            <h2 className="listing-title">{title}</h2>
            <div className="listing-company">{company}</div>
          </div>
        </div>

        <div className="listing-meta">
          <span><strong>Location:</strong> {location}</span>
          <span><strong>Industry:</strong> {industry}</span>
          <span><strong>Duration:</strong> {duration}</span>
          <span><strong>Pay:</strong> {paid ? 'Paid' : 'Unpaid'}</span>
          {paid && <span><strong>Salary:</strong> {salary}</span>}
          {user.viewCount===true&&<span><strong>Number of applications:</strong> {count}</span>}
        </div>

        <section className="listing-section">
          <h3>Job Description</h3>
          <p>{description}</p>
        </section>

        <section className="listing-section">
          <h3>Required Skills</h3>
          <ul className="skills-list">
            {skills.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </section>

        {user.role === 'student' && (
          newStatus === 'not applied'
            ? <button className="apply-btn" onClick={handleOpenModal}>
                Apply Now
              </button>
            : <div className={`status-badge status-${newStatus.toLowerCase().replace(' ','-')}`}>
                {newStatus}
              </div>
        )}
      </main>

      {showModal && (
        <div className="internship-modal-overlay" onClick={handleCloseModal}>
          <div className="internship-modal-content" onClick={e => e.stopPropagation()}>
            <button className="internship-modal-close" onClick={handleCloseModal}>×</button>
            <h3>Apply for <em>{title}</em></h3>
            <form className="internship-modal-form" onSubmit={handleSubmit}>
              {/* CV (required) */}
              <label>
                CV <span className="required">*</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvChange}
                  required
                />
              </label>
              {cvFile && <div className="file-name">• {cvFile.name}</div>}
              {/* Cover Letter (optional) */}
              <label>
                Cover Letter <span className="optional">(optional)</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCoverChange}
                />
              </label>
              {coverFile && <div className="file-name">• {coverFile.name}</div>}
              {/* Extras (optional, multiple) */}
              <label>
                Certificates / Extras <span className="optional">(optional, multiple)</span>
                <input
                  type="file"
                  multiple
                  onChange={handleExtrasChange}
                />
              </label>
              {extras.length > 0 && (
                <ul className="file-list">
                  {extras.map((f,i) => <li key={i}>• {f.name}</li>)}
                </ul>
              )}
              <button
                type="submit"
                className="internship-modal-submit"
                disabled={!cvFile || submitting}
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
              {submitMessage && (
                <p className="submit-message">{submitMessage}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIL;
