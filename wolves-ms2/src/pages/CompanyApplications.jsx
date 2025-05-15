import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link }      from 'react-router-dom';
import TopBar               from '../components/TopBar';
import Filter               from '../components/Filter';
import ApplicationOverview  from '../components/ApplicationOverview';
import applicationsData     from '../data/applications.json';
import internshipsData      from '../data/internships.json';
import studentsData         from '../data/students.json';
import './CompanyApplications.css';
import ApplicationIcon from '../assets/icons/application-icon.png';
import MyPosts     from '../assets/icons/posts-icon.png';
import Interns     from '../assets/icons/interns-icon.png';
import NotificationIcon from '../assets/icons/notif-icon.png';
import HomeIcon from '../assets/icons/home-icon.png';
import LogoutIcon from '../assets/icons/logout-icon.png';
import CompanyNotifications from '../components/CompanyNotifications';
const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const CompanyApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState(() => {
    const stored = sessionStorage.getItem('applications');
    return stored ? JSON.parse(stored) : applicationsData;
  });

  // Listen for application updates
  useEffect(() => {
    const handleApplicationsUpdate = () => {
      const stored = sessionStorage.getItem('applications');
      if (stored) {
        setApplications(JSON.parse(stored));
      }
    };

    window.addEventListener('applications-updated', handleApplicationsUpdate);
    return () => {
      window.removeEventListener('applications-updated', handleApplicationsUpdate);
    };
  }, []);

  const baseList = applications;

  const internshipOptions = Array.from(
    new Set(baseList.map(a => String(a.internshipId)))
  ).map(id => {
    const i = internshipsData.find(x => String(x.id) === id);
    return i && { id, title: i.title };
  }).filter(Boolean);

  const [filters, setFilters] = useState({ internship: '' });
  const handleFilter = key => e =>
    setFilters(f => ({ ...f, [key]: e.target.value }));

  const displayed = baseList
    .filter(a =>
      !filters.internship ||
      String(a.internshipId) === filters.internship
    )
    .map(app => {
      const student = studentsData.find(s =>
        String(s.id) === String(app.studentId)
      );
      const internship = internshipsData.find(i =>
        String(i.id) === String(app.internshipId)
      );
      return {
        ...app,
        studentName:     student ? student.name : `#${app.studentId}`,
        internshipTitle: internship ? internship.title : `#${app.internshipId}`
      };
    });

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
    <div className="company-apps-container">
      <TopBar showSearch={false} menuItems={menuItems}>
      <CompanyNotifications />
        <button className="topbar-button" onClick={()=> navigate('/company-home')}>
          <img src={HomeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/login')}>
          <img src={LogoutIcon} alt="logout" className="topbar-icon" />
          <span>Logout</span>
        </button>
      </TopBar>

      <div className="company-apps-main">
        <section className="company-apps-panel">
          <h2 className="company-apps-title">All Applications</h2>

          <div className="company-apps-filters">
            <Filter
              title="Internship"
              value={filters.internship}
              onChange={handleFilter('internship')}
            >
              <option value="">All</option>
              {internshipOptions.map(o => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </Filter>
          </div>

          <div className="company-apps-list">
            {displayed.length > 0 ? (
              displayed.map(app => (
                <ApplicationOverview
                  key={app.id}
                  id={app.id}
                  studentName={app.studentName}
                  internshipTitle={app.internshipTitle}
                  status={app.status}
                />
              ))
            ) : (
              <p className="company-apps-no-results">
                No applications match your filters.
              </p>
            )}
          </div>
        </section>
      </div>

      <footer className="company-apps-footer">
        GUC Internship Platform © 2025
      </footer>
    </div>
  );
};

export default CompanyApplications;
