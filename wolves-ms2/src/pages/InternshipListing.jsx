// File: src/pages/InternshipListing.jsx
import React, { useState } from 'react';
import { useParams, useNavigate,useLocation  } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import internshipsData from '../data/internships.json';
import './InternshipListing.css';

import internshipIcon  from '../assets/icons/internships-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon        from '../assets/icons/eval-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import profileIcon     from '../assets/icons/profile-icon.png';
import HomeIcon     from '../assets/icons/home-icon.png';

const InternshipListing = () => {
  console.log('InternshipListing rendered');
  const { id }         = useParams();
  // Get internships from sessionStorage if available
  let internshipsArr = [];
  const stored = sessionStorage.getItem('internships');
  if (stored) {
    internshipsArr = JSON.parse(stored);
  } else {
    internshipsArr = [...internshipsData];
  }
  const internship = internshipsArr.find(i => String(i.id) === id);
  const { user }       = useAuth();
  const navigate       = useNavigate();
  const srcLocation = useLocation();

  // Get evaluation status from location state if available, fallback to internship status
  const evaluationStatus = srcLocation.state?.evaluation || internship?.status;
  const isStudentInternshipsRoute = srcLocation.pathname.startsWith('/student-internships/');

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

  // Only show evaluation section if on /student-internships/:id and evaluationStatus === 'Internship Complete'
  // Add a debug log for evaluationStatus
  console.log('evaluationStatus:', evaluationStatus);
  const showEvaluation = isStudentInternshipsRoute && evaluationStatus === 'Internship Complete';

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
      // Update status in sessionStorage
      let updatedArr = internshipsArr.map(i =>
        String(i.id) === String(id) ? { ...i, status: 'pending' } : i
      );
      sessionStorage.setItem('internships', JSON.stringify(updatedArr));
    }, 1200);
  };

  return (
    <div className="listing-page">
      <TopBar showSearch={false}>
        
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

        {/* Only show evaluation section if showEvaluation is true */}
        {showEvaluation && (
          <section className="listing-section">
            <h3>Evaluation</h3>
            {/* Evaluation content here */}
          </section>
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

export default InternshipListing;
