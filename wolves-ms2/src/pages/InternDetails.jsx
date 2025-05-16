import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link }      from 'react-router-dom';
import TopBar                                from '../components/TopBar';
import ProfileOverview                       from '../components/ProfileOverview';
import applicationsData                      from '../data/interns.json';
import studentsData                          from '../data/students.json';
import internshipsData                       from '../data/internships.json';
import evaluationsData                       from '../data/evaluations.json';
import './InternDetails.css';

import ApplicationIcon from '../assets/icons/application-icon.png';
import MyPosts     from '../assets/icons/posts-icon.png';
import Interns     from '../assets/icons/interns-icon.png';
import NotificationIcon from '../assets/icons/notif-icon.png';
import HomeIcon from '../assets/icons/home-icon.png';
import LogoutIcon from '../assets/icons/logout-icon.png';
import CompanyNotifications from '../components/CompanyNotifications';
const MODAL_WIDTH = 340; // should match min-width in Notifications.css

export default function InternDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();

  // look up the application
  const application = applicationsData
    .find(a => String(a.id) === id) || {};
  
  // Check if the intern exists and has a valid status
  useEffect(() => {
    if (!application || !['Current Intern', 'Internship Complete'].includes(application.status)) {
      navigate('/company-interns', { replace: true });
    }
  }, [application, navigate]);

  const student    = studentsData
    .find(s => String(s.id) === String(application.studentId)) || {};
  const internship = internshipsData
    .find(i => String(i.id) === String(application.internshipId)) || {};

  // Initialize evaluation state with a single evaluation if the internship is complete
  const [evaluation, setEvaluation] = useState(
    application.status === 'Internship Complete' 
      ? evaluationsData.find(ev => String(ev.internshipId) === id) || { text: '' }
      : { text: '' }
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  // Start editing
  const startEdit = () => {
    setIsEditing(true);
    setEditText(evaluation.text);
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setEditText('');
  };

  // Save evaluation
  const saveEvaluation = e => {
    e.preventDefault();
    if (!editText.trim()) return;
    
    setEvaluation({ ...evaluation, text: editText.trim() });
    setIsEditing(false);
    setEditText('');
  };

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
    <div className="intern-details-dashboard">
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

      <div className="intern-details-main">
        <aside className="intern-details-sidebar">
          <ProfileOverview
            name={student.name}
            email={student.email}
            major={student.major}
            status={student.status}
            completedMonths={student.completedMonths}
            totalMonths={student.totalMonths || 3}
            hideCycle={true}
            profileUrl={`/student-profile/${student.id}`}
            profilePicture={student.profilePicture}
          />
        </aside>

        <section className="intern-details-content">
          <div>
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
          <h2 className="intern-details-title">
            Intern Overview — {internship.title} @ {internship.company}
          </h2>

          <div className="intern-details-section">
            <h3>Contact & Major</h3>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Major:</strong> {student.major}</p>
          </div>

          <div className="intern-details-section">
            <h3>Job Interests</h3>
            <ul>
              <li>UI/UX Design</li>
              <li>Frontend Development</li>
              <li>React</li>
            </ul>
          </div>

          <div className="intern-details-section">
            <h3>Previous Internships</h3>
            <ul>
              <li>Web Intern @ Acme Co.</li>
              <li>Research Asst. @ GUC</li>
            </ul>
          </div>

          <div className="intern-details-section">
            <h3>College Activities</h3>
            <ul>
              <li>Media Engineering Club</li>
              <li>Robotics Team</li>
              <li>AI Study Group</li>
            </ul>
          </div>

          <div className="intern-details-section">
            <h3>Documents</h3>
            <ul className="intern-details-docs">
              <li><a href="/sample.pdf" download>Download CV</a></li>
              <li><a href="/sample.pdf" download>Download Cover Letter</a></li>
              <li><a href="/sample.pdf" download>Download Certificates</a></li>
            </ul>
          </div>

          {/** ———————————— Single Evaluation ———————————— **/}
          {application.status === 'Internship Complete' && (
            <div className="intern-details-eval-section">
              <h3>Evaluation</h3>
              {isEditing ? (
                <form onSubmit={saveEvaluation} className="eval-form">
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    placeholder="Enter your evaluation..."
                    required
                  />
                  <div className="eval-form-buttons">
                    <button type="submit">Save</button>
                    <button type="button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="eval-card">
                  {evaluation.text ? (
                    <>
                      <p className="eval-text">{evaluation.text}</p>
                      <div className="eval-buttons">
                        <button onClick={startEdit}>Edit</button>
                      </div>
                    </>
                  ) : (
                    <button onClick={startEdit} className="add-eval-btn">
                      Add Evaluation
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
