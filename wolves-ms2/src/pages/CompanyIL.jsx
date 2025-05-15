// File: src/pages/InternshipListing.jsx
import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import internshipsData from '../data/internships.json';
import './InternshipListing.css';
import CompanyNotifications from '../components/CompanyNotifications';

import ApplicationIcon from '../assets/icons/application-icon.png';
import MyPosts from '../assets/icons/posts-icon.png';
import Interns from '../assets/icons/interns-icon.png';
import NotificationIcon from '../assets/icons/notif-icon.png';
import HomeIcon from '../assets/icons/home-icon.png';
import LogoutIcon from '../assets/icons/logout-icon.png';
const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const CompanyIL = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentLocation = useLocation();

  // Get the internship data from sessionStorage
  const [internship, setInternship] = useState(() => {
    const savedPosts = sessionStorage.getItem('companyPosts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      return posts.find(post => String(post.id) === String(id));
    }
    return internshipsData.find(i => String(i.id) === id);
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedInternship, setEditedInternship] = useState(internship);

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
    title,
    company,
    location,
    industry,
    duration,
    paid,
    salary,
    description,
    skills,
    logo,
    status,
    count
  } = editedInternship;

  const logoSrc = require(`../assets/companies/${logo}`);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Get current posts from sessionStorage
    const savedPosts = sessionStorage.getItem('companyPosts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const updatedPosts = posts.map(post => 
        String(post.id) === String(id) ? editedInternship : post
      );
      sessionStorage.setItem('companyPosts', JSON.stringify(updatedPosts));
      setInternship(editedInternship);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInternship(internship);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this internship post?')) {
      const savedPosts = sessionStorage.getItem('companyPosts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const updatedPosts = posts.filter(post => String(post.id) !== String(id));
        sessionStorage.setItem('companyPosts', JSON.stringify(updatedPosts));
        navigate('/company-posts');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedInternship(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
      <Link to="/admin/notifications" className="sidebar-item">
        <img src={NotificationIcon} alt="Notifications" className="sidebar-icon" />
        <span>Notifications</span>
      </Link>
      <Link to="/login" className="sidebar-item">
        <img src={LogoutIcon} alt="Logout" className="sidebar-icon" />
        <span>Logout</span>
      </Link>
    </>
  );

  return (
    <div className="listing-page">
      <TopBar showSearch={false} menuItems={menuItems}>
        <CompanyNotifications />
        <button className="topbar-button" onClick={() => navigate('/company-home')}>
          <img src={HomeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/login')}>
          <img src={LogoutIcon} alt="logout" className="topbar-icon" />
          <span>Logout</span>
        </button>
      </TopBar>

      <main className="listing-main">
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
            <h2 className="listing-title">
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={editedInternship.title}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : title}
            </h2>
            <div className="listing-company">
              {isEditing ? (
                <input
                  type="text"
                  name="company"
                  value={editedInternship.company}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : company}
            </div>
          </div>
        </div>

        <div className="listing-meta">
          <span>
            <strong>Location:</strong>{' '}
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={editedInternship.location}
                onChange={handleChange}
                className="edit-input"
              />
            ) : location}
          </span>
          <span>
            <strong>Industry:</strong>{' '}
            {isEditing ? (
              <input
                type="text"
                name="industry"
                value={editedInternship.industry}
                onChange={handleChange}
                className="edit-input"
              />
            ) : industry}
          </span>
          <span>
            <strong>Duration:</strong>{' '}
            {isEditing ? (
              <input
                type="text"
                name="duration"
                value={editedInternship.duration}
                onChange={handleChange}
                className="edit-input"
              />
            ) : duration}
          </span>
          <span>
            <strong>Pay:</strong>{' '}
            {isEditing ? (
              <label>
                <input
                  type="checkbox"
                  name="paid"
                  checked={editedInternship.paid}
                  onChange={handleChange}
                />
                Paid Position
              </label>
            ) : (paid ? 'Paid' : 'Unpaid')}
          </span>
          {paid && (
            <span>
              <strong>Salary:</strong>{' '}
              {isEditing ? (
                <input
                  type="text"
                  name="salary"
                  value={editedInternship.salary}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : salary}
            </span>
          )}
          {user.viewCount === true && (
            <span><strong>Number of applications:</strong> {count}</span>
          )}
        </div>

        <section className="listing-section">
          <h3>Job Description</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={editedInternship.description}
              onChange={handleChange}
              className="edit-textarea"
              rows="5"
            />
          ) : (
            <p>{description}</p>
          )}
        </section>

        <section className="listing-section">
          <h3>Required Skills</h3>
          {isEditing ? (
            <textarea
              name="skills"
              value={editedInternship.skills.join(', ')}
              onChange={(e) => {
                const skillsArray = e.target.value.split(',').map(s => s.trim());
                setEditedInternship(prev => ({
                  ...prev,
                  skills: skillsArray
                }));
              }}
              className="edit-textarea"
              rows="3"
              placeholder="Enter skills separated by commas"
            />
          ) : (
            <ul className="skills-list">
              {skills.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          )}
        </section>

        {isEditing ? (
          <div className="edit-actions">
            <button onClick={handleSave} className="save-button">Save Changes</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        ) : (
          <div className="listing-actions">
            <button onClick={handleEdit} className="edit-button">Edit Post</button>
            <button onClick={handleDelete} className="delete-button">Delete Post</button>
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

export default CompanyIL;
