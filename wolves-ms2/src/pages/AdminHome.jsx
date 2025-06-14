import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import Notifications from '../components/Notifications';
import './AdminHome.css';
import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';
import AdminNotifications from '../components/AdminNotifications';

import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';
import statsIcon from '../assets/icons/stats-icon.png';

const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const AdminHome = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);

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
    () => sessionStorage.getItem('cycleStart') || '2025-05-01'
  );
  const [cycleEnd, setCycleEnd] = useState(
    () => sessionStorage.getItem('cycleEnd') || '2025-09-01'
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStart, setModalStart] = useState(cycleStart);
  const [modalEnd, setModalEnd] = useState(cycleEnd);

  // Cycle state (active/inactive)
  const [cycleState, setCycleState] = useState('Inactive');
  useEffect(() => {
    const now = new Date();
    const start = new Date(cycleStart);
    const end = new Date(cycleEnd);
    if (cycleStart && cycleEnd && now >= start && now <= end) {
      setCycleState('Active');
    } else {
      setCycleState('Inactive');
    }
  }, [cycleStart, cycleEnd]);

  // Persist cycle dates
  useEffect(() => sessionStorage.setItem('cycleStart', cycleStart), [cycleStart]);
  useEffect(() => sessionStorage.setItem('cycleEnd', cycleEnd), [cycleEnd]);

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
      setWorkshops(m.default.workshops || []);
      sessionStorage.setItem('admin-workshops', JSON.stringify(m.default.workshops || []));
    });
    import('../data/admin-notifications.json').then(m => {
      setNotifications(m.default);
      sessionStorage.setItem('admin-notifs', JSON.stringify(m.default));
    });
  }, []);

  // nav helper
  const go = path => () => navigate(path);

  // Modal handlers
  const openModal = () => {
    setModalStart(cycleStart);
    setModalEnd(cycleEnd);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleModalSave = e => {
    e.preventDefault();
    setCycleStart(modalStart);
    setCycleEnd(modalEnd);
    setIsModalOpen(false);
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
    <div className="admin-home-page">
      <TopBar showSearch={false} menuItems={menuItems}>
        <AdminNotifications />
        <button className="topbar-button" onClick={()=> navigate('/admin-home')}>
          <img src={homeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/login')}>
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

      <main className="admin-home-main">
        <h1>Admin Dashboard</h1>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stats-card" tabIndex={0} onClick={go('/admin-home/companies')}>
            <h3>{companies.length}</h3>
            <p>Companies Pending</p>
          </div>
          <div className="stats-card" tabIndex={0} onClick={go('/admin-home/internships')}>
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
            <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
              <span className={`state-badge ${cycleState.toLowerCase()}`}>{cycleState}</span>
              <input type="date" value={cycleStart} readOnly />
              <span>to</span>
              <input type="date" value={cycleEnd} readOnly />
            </div>
            <button className="iv-btn primary" onClick={openModal}>Manage Cycle</button>
          </div>
        </section>

        {/* Modal for editing cycle dates */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Manage Internship Cycle">
          <form onSubmit={handleModalSave} className="cycle-form">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={modalStart}
                onChange={e => setModalStart(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={modalEnd}
                onChange={e => setModalEnd(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="update-cycle-btn">
              Update Cycle
            </button>
          </form>
        </Modal>

        {/* Recent Notifications */}
        <section className="recent-notifs-section">
          <h2>Recent Notifications</h2>
          <div className="recent-notifs-list">
            {notifications && notifications.length > 0 ? (
              notifications.slice(0, 5).map((notif, idx) => (
                <div className="notif-card" key={notif.id || idx} tabIndex={0}>
                  <div className="notif-title">{notif.title}</div>
                  <div className="notif-body">{notif.body}</div>
                  <div className="notif-date">{notif.date}</div>
                </div>
              ))
            ) : (
              <div className="notif-empty">No notifications to show.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminHome;