import React, { useState, useEffect, useRef } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import WorkshopCard from '../components/WorkshopCard';
import Modal from '../components/Modal';
import workshopsData from '../data/workshops.json';
import './AdminWorkshops.css';
import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';
import statsIcon from '../assets/icons/stats-icon.png';

import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';
import AdminNotifications from '../components/AdminNotifications';
import Notifications from '../components/Notifications';
const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const AdminWorkshops = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);
  const [workshops, setWorkshops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newWorkshop, setNewWorkshop] = useState({
    name: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    shortDescription: '',
    speakerBio: '',
    agenda: ''
  });
  const [notifications, setNotifications] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-notifs')) || []
  );

  // Load from sessionStorage or JSON
  useEffect(() => {
    let workshopsDataArr = [];
    try {
      workshopsDataArr = JSON.parse(sessionStorage.getItem('admin-workshops'));
      if (!Array.isArray(workshopsDataArr)) {
        workshopsDataArr = workshopsData.workshops || [];
        sessionStorage.setItem('admin-workshops', JSON.stringify(workshopsDataArr));
      }
    } catch {
      workshopsDataArr = workshopsData.workshops || [];
      sessionStorage.setItem('admin-workshops', JSON.stringify(workshopsDataArr));
    }
    // Ensure every workshop has a status
    setWorkshops(workshopsDataArr.map(w => ({ ...w, status: w.status || 'soon' })));
  }, []);

  // Listen for changes in sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const workshopsDataArr = JSON.parse(sessionStorage.getItem('admin-workshops')) || [];
      setWorkshops(workshopsDataArr);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('workshops-updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('workshops-updated', handleStorageChange);
    };
  }, []);

  // Update sessionStorage and dispatch event
  const updateWorkshops = (updated) => {
    setWorkshops(updated);
    sessionStorage.setItem('admin-workshops', JSON.stringify(updated));
    window.dispatchEvent(new Event('workshops-updated'));
  };

  const handleCreateWorkshop = (e) => {
    e.preventDefault();
    const newId = (workshops.length + 1).toString();
    const workshop = { id: newId, status: 'soon', ...newWorkshop };
    updateWorkshops([workshop, ...workshops]);
    setShowModal(false);
    setNewWorkshop({
      name: '', startDate: '', endDate: '', startTime: '', endTime: '', shortDescription: '', speakerBio: '', agenda: ''
    });
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
    <div className="admin-workshops-page">
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
      <div className="workshops-list-container">
        <div className="workshops-header-row">
          <h1>Workshops</h1>
          <button className="iv-btn primary" onClick={() => setShowModal(true)}>
            + Create New Workshop
          </button>
        </div>
        <div className="workshops-list">
          {Array.isArray(workshops) && workshops.map(w => (
            <WorkshopCard
              key={w.id}
              workshop={w}
              onAction={() => {
                sessionStorage.setItem('selectedWorkshop', JSON.stringify(w));
                navigate(`/admin/workshops/${w.id}`);
              }}
            />
          ))}
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Workshop">
        <form className="workshop-form" onSubmit={handleCreateWorkshop}>
          <div className="form-group">
            <label>Name</label>
            <input value={newWorkshop.name} onChange={e => setNewWorkshop({ ...newWorkshop, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={newWorkshop.startDate} onChange={e => setNewWorkshop({ ...newWorkshop, startDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={newWorkshop.endDate} onChange={e => setNewWorkshop({ ...newWorkshop, endDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input type="time" value={newWorkshop.startTime} onChange={e => setNewWorkshop({ ...newWorkshop, startTime: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input type="time" value={newWorkshop.endTime} onChange={e => setNewWorkshop({ ...newWorkshop, endTime: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Short Description</label>
            <textarea value={newWorkshop.shortDescription} onChange={e => setNewWorkshop({ ...newWorkshop, shortDescription: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Speaker Bio</label>
            <textarea value={newWorkshop.speakerBio} onChange={e => setNewWorkshop({ ...newWorkshop, speakerBio: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Agenda</label>
            <textarea value={newWorkshop.agenda} onChange={e => setNewWorkshop({ ...newWorkshop, agenda: e.target.value })} required />
          </div>
          <button className="iv-btn primary" type="submit">Create Workshop</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminWorkshops; 