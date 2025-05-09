import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import './AdminHome.css';

const AdminHome = () => {
  const navigate = useNavigate();

  // Turning Point 1: session‑persisted data
  const [companies, setCompanies] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-companies')) || []
  );
  const [internships, setInternships] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-internships')) || []
  );
  const [studentsCount, setStudentsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [workshops, setWorkshops] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-workshops')) || []
  );
  const [notifications, setNotifications] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-notifs')) || []
  );
  const [cycleStart, setCycleStart] = useState(
    () => sessionStorage.getItem('cycleStart') || ''
  );
  const [cycleEnd, setCycleEnd] = useState(
    () => sessionStorage.getItem('cycleEnd') || ''
  );

  // load static JSON once
  useEffect(() => {
    import('../data/applications.json').then(m => {
      setCompanies(m.default);
      sessionStorage.setItem('admin-companies', JSON.stringify(m.default));
    });
    import('../data/student-internships.json').then(m => {
      setInternships(m.default);
      sessionStorage.setItem('admin-internships', JSON.stringify(m.default));
    });
    import('../data/students.json').then(m => setStudentsCount(m.default.length));
    import('../data/reports.json').then(m => setReportsCount(m.default.length));
    import('../data/workshops.json').then(m => {
      setWorkshops(m.default);
      sessionStorage.setItem('admin-workshops', JSON.stringify(m.default));
    });
    import('../data/admin-notifications.json').then(m => {
      setNotifications(m.default);
      sessionStorage.setItem('admin-notifs', JSON.stringify(m.default));
    });
  }, []);

  // persist cycle dates
  useEffect(() => sessionStorage.setItem('cycleStart', cycleStart), [cycleStart]);
  useEffect(() => sessionStorage.setItem('cycleEnd', cycleEnd), [cycleEnd]);

  // nav helper
  const go = path => () => navigate(path);

  return (
    <div className="admin-home-page">
      <TopBar showSearch={false}>
        <button onClick={go('/admin/notifications')} className="topbar-button">
          Notifications <span className="notif-count">{notifications.length}</span>
        </button>
      </TopBar>

      <main className="admin-home-main">
        <h1>Admin Dashboard</h1>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stats-card" tabIndex={0} onClick={go('/admin/companies')}>
            <h3>{companies.length}</h3>
            <p>Companies Pending</p>
          </div>
          <div className="stats-card" tabIndex={0} onClick={go('/admin/internships')}>
            <h3>{internships.length}</h3>
            <p>Total Internships</p>
          </div>
          <div className="stats-card" tabIndex={0} onClick={go('/admin/students')}>
            <h3>{studentsCount}</h3>
            <p>Registered Students</p>
          </div>
          <div className="stats-card" tabIndex={0} onClick={go('/admin/reports')}>
            <h3>{reportsCount}</h3>
            <p>Submitted Reports</p>
          </div>
          <div className="stats-card" tabIndex={0} onClick={go('/admin/workshops')}>
            <h3>{workshops.length}</h3>
            <p>Workshops</p>
          </div>
        </div>

        {/* Cycle & Quick Action */}
        <section className="cycle-section">
          <h2>Current Internship Cycle</h2>
          <div className="cycle-controls">
            <input type="date" value={cycleStart} onChange={e => setCycleStart(e.target.value)} />
            <span>to</span>
            <input type="date" value={cycleEnd} onChange={e => setCycleEnd(e.target.value)} />
            <button className="iv-btn primary" onClick={go('/admin/cycle-settings')}>Manage Cycle</button>
          </div>
        </section>

        {/* Recent Notifications */}
        <section className="recent-notifs-section">
          <h2>Recent Notifications</h2>
          <div className="recent-notifs-list">
            {notifications && notifications.length > 0 ? (
              notifications.slice(0, 5).map((notif, idx) => (
                <div className="notif-card" key={notif.id || idx} tabIndex={0} onClick={go('/admin/notifications')}>
                  <div className="notif-title">{notif.title}</div>
                  <div className="notif-body">{notif.body}</div>
                  <div className="notif-date">{notif.date}</div>
                </div>
              ))
            ) : (
              <div className="notif-empty">No notifications to show.</div>
            )}
          </div>
          <button className="iv-btn secondary view-all-notifs" onClick={go('/admin/notifications')}>
            View All Notifications
          </button>
        </section>
      </main>
    </div>
  );
};

export default AdminHome;