import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import './AdminStats.css';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';
import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';
import notificationIcon from '../assets/icons/notif-icon.png';
import samplePDF from '../assets/docs/sample.pdf';
import AdminNotifications from '../components/AdminNotifications';
import Notifications from '../components/Notifications';
import statsIcon from '../assets/icons/stats-icon.png';

// Mock data
const mockStats = {
  reports: {
    accepted: 45,
    rejected: 12,
    flagged: 8,
    averageReviewTime: '2.5 days'
  },
  courses: [
    { name: 'Software Engineering', count: 28 },
    { name: 'Database Systems', count: 24 },
    { name: 'Web Development', count: 22 },
    { name: 'Machine Learning', count: 19 },
    { name: 'Data Structures', count: 18 }
  ],
  topCompanies: [
    { name: 'Google', rating: 4.8, internships: 15 },
    { name: 'Microsoft', rating: 4.7, internships: 12 },
    { name: 'Amazon', rating: 4.6, internships: 10 },
    { name: 'Meta', rating: 4.5, internships: 8 },
    { name: 'Apple', rating: 4.4, internships: 7 }
  ]
};

const AdminStats = () => {
  const navigate = useNavigate();
  const [selectedCycle, setSelectedCycle] = useState('2025-Summer');
  const [notifications, setNotifications] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-notifs')) || []
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);

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
        <img src={appointmentIcon} alt="Appointments" className="sidebar-icon" />
        <span>Appointments</span>
      </Link>
      <Link to="/admin-home/stats" className="sidebar-item">
        <img src={statsIcon} alt="stats" className="sidebar-icon" />
        <span>Statistics</span>
      </Link>
      <Link to="/login" className="sidebar-item">
        <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
        <span>Logout</span>
      </Link>
    </>
  );

  return (
    <div className="admin-stats-page">
      <TopBar showSearch={false} menuItems={menuItems}>
        <AdminNotifications />
        <button className="topbar-button" onClick={() => navigate('/admin-home')}>
          <img src={homeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/login')}>
          <img src={logoutIcon} alt="logout" className="topbar-icon" />
          <span>Logout</span>
        </button>
      </TopBar>
      <Notifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} position={notifPosition}>
        {notifications && notifications.length > 0 ? (
          notifications.map((notif, idx) => (
            <div className="notif-card" key={notif.id || idx} tabIndex={0}>
              <div className="notif-title">{notif.title}</div>
              <div className="notif-body">{notif.body}</div>
              <div className="notif-email">{notif.email || notif.senderEmail}</div>
              <div className="notif-date">{notif.date}</div>
            </div>
          ))
        ) : (
          <div className="notif-empty">No notifications to show.</div>
        )}
      </Notifications>

      <main className="admin-stats-main">
        <div className="stats-header">
          <h1>Statistics Dashboard</h1>
          <div className="cycle-selector">
            <select 
              value={selectedCycle} 
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="cycle-select"
            >
              <option value="2025-Summer">2025 Summer Cycle</option>
              <option value="2024-Winter">2024 Winter Cycle</option>
              <option value="2024-Summer">2024 Summer Cycle</option>
            </select>
          </div>
        </div>

        {/* Reports Overview */}
        <section className="stats-section reports-overview">
          <h2>Reports Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{mockStats.reports.accepted}</h3>
              <p>Accepted Reports</p>
            </div>
            <div className="stat-card">
              <h3>{mockStats.reports.rejected}</h3>
              <p>Rejected Reports</p>
            </div>
            <div className="stat-card">
              <h3>{mockStats.reports.flagged}</h3>
              <p>Flagged Reports</p>
            </div>
            <div className="stat-card">
              <h3>{mockStats.reports.averageReviewTime}</h3>
              <p>Average Review Time</p>
            </div>
          </div>
        </section>

        {/* Top Courses */}
        <section className="stats-section top-courses">
          <h2>Most Used Courses</h2>
          <div className="courses-list">
            {mockStats.courses.map((course, index) => (
              <div key={index} className="course-item">
                <span className="course-rank">#{index + 1}</span>
                <span className="course-name">{course.name}</span>
                <span className="course-count">{course.count} internships</span>
              </div>
            ))}
          </div>
        </section>

        {/* Top Companies */}
        <section className="stats-section top-companies">
          <h2>Top Companies</h2>
          <div className="companies-grid">
            {mockStats.topCompanies.map((company, index) => (
              <div key={index} className="company-card">
                <h3>{company.name}</h3>
                <div className="company-stats">
                  <div className="stat">
                    <span className="label">Rating</span>
                    <span className="value">{company.rating}/5.0</span>
                  </div>
                  <div className="stat">
                    <span className="label">Internships</span>
                    <span className="value">{company.internships}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Download Reports */}
        <section className="stats-section download-reports">
          <h2>Download Reports</h2>
          <div className="download-buttons">
            <a
              className="download-btn"
              href={samplePDF}
              download="SCAD-Reports-Summary.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Reports Summary
            </a>
            <a
              className="download-btn"
              href={samplePDF}
              download="SCAD-Courses-Analysis.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Courses Analysis
            </a>
            <a
              className="download-btn"
              href={samplePDF}
              download="SCAD-Companies-Report.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Companies Report
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminStats; 