import React, { useState, useRef } from 'react';
import { useLocation, useNavigate, useParams,Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import './AdminWorkshop.css';
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

const AdminWorkshop = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);
  const [notifications, setNotifications] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-notifs')) || []
  );
  // Try to get workshop from navigation state, else from sessionStorage
  let initialWorkshop = location.state?.workshop;
  if (!initialWorkshop) {
    const stored = sessionStorage.getItem('selectedWorkshop');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.id === id) {
        initialWorkshop = parsed;
      }
    }
  }
  const [workshop, setWorkshop] = useState(initialWorkshop);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFields, setEditFields] = useState(workshop);

  if (!workshop) {
    return <div className="admin-workshop-page"><TopBar showSearch={false} /><div className="not-found">Workshop not found.</div></div>;
  }

  const handleEdit = (e) => {
    e.preventDefault();
    setWorkshop(editFields);
    // Update workshops in sessionStorage
    const stored = sessionStorage.getItem('admin-workshops');
    if (stored) {
      const arr = JSON.parse(stored);
      const updated = arr.map(w => w.id === workshop.id ? editFields : w);
      sessionStorage.setItem('admin-workshops', JSON.stringify(updated));
      window.dispatchEvent(new Event('workshops-updated'));
    }
    setEditMode(false);
  };

  const handleDelete = () => {
    // Remove from sessionStorage
    const stored = sessionStorage.getItem('admin-workshops');
    if (stored) {
      const arr = JSON.parse(stored);
      const updated = arr.filter(w => w.id !== workshop.id);
      sessionStorage.setItem('admin-workshops', JSON.stringify(updated));
      window.dispatchEvent(new Event('workshops-updated'));
    }
    setShowDeleteModal(false);
    navigate(-1);
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
    <div className="admin-workshop-page">
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
      <div className="workshop-details-container">
        <div>
        <button
              type="button"
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
        </div>
        <div className="workshop-actions-row">
          <button className="iv-btn" onClick={() => setEditMode(true)}>Edit</button>
          <button className="iv-btn reject" onClick={() => setShowDeleteModal(true)}>Delete</button>
        </div>
        <h1>{workshop.name}</h1>
        <div className="workshop-meta">
          <span><strong>Date:</strong> {workshop.startDate} {workshop.startTime} - {workshop.endDate} {workshop.endTime}</span>
        </div>
        <div className="workshop-section">
          <h3>Short Description</h3>
          <p>{workshop.shortDescription}</p>
        </div>
        <div className="workshop-section">
          <h3>Speaker Bio</h3>
          <p>{workshop.speakerBio}</p>
        </div>
        <div className="workshop-section">
          <h3>Agenda</h3>
          <pre className="workshop-agenda">{workshop.agenda}</pre>
        </div>
      </div>
      <Modal isOpen={editMode} onClose={() => setEditMode(false)} title="Edit Workshop">
        <form className="workshop-form" onSubmit={handleEdit}>
          <div className="form-group">
            <label>Name</label>
            <input value={editFields.name} onChange={e => setEditFields({ ...editFields, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={editFields.startDate} onChange={e => setEditFields({ ...editFields, startDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={editFields.endDate} onChange={e => setEditFields({ ...editFields, endDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input type="time" value={editFields.startTime} onChange={e => setEditFields({ ...editFields, startTime: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input type="time" value={editFields.endTime} onChange={e => setEditFields({ ...editFields, endTime: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Short Description</label>
            <textarea value={editFields.shortDescription} onChange={e => setEditFields({ ...editFields, shortDescription: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Speaker Bio</label>
            <textarea value={editFields.speakerBio} onChange={e => setEditFields({ ...editFields, speakerBio: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Agenda</label>
            <textarea value={editFields.agenda} onChange={e => setEditFields({ ...editFields, agenda: e.target.value })} required />
          </div>
          <button className="iv-btn primary" type="submit">Save Changes</button>
        </form>
      </Modal>
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Workshop">
        <div style={{padding: '1rem 0'}}>Are you sure you want to delete this workshop?</div>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
          <button className="iv-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="iv-btn reject" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminWorkshop; 