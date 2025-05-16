import React, { useState, useEffect ,useRef} from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import './CompanyDetails.css';

import scadLogo from '../assets/scad-logo.png';
import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';
import AdminNotifications from '../components/AdminNotifications';
import Notifications from '../components/Notifications';
import statsIcon from '../assets/icons/stats-icon.png';

import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';
const CARD_CONTAINER_WIDTH = 1000;
const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const DEFAULT_DOC = require('../assets/docs/sample.pdf');

const capitalize = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';


const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [status, setStatus] = useState('applying');
  const [doc, setDoc] = useState(DEFAULT_DOC);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);
  const [notifications, setNotifications] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-notifs')) || []
  );

  useEffect(() => {
    const findCompany = () => {
      const applying = JSON.parse(sessionStorage.getItem('admin-applying-companies')) || [];
      const registered = JSON.parse(sessionStorage.getItem('admin-registered-companies')) || [];
      
      console.log('Applying Companies:', applying);
      console.log('Registered Companies:', registered);

      let found = applying.find(c => String(c.id) === id);
      if (found) {
        console.log('Found in applying companies:', found);
        setCompany(found);
        setStatus('applying');
        setDoc(found.document ? require(`../assets/docs/${found.document}`) : DEFAULT_DOC);
        return;
      }
      
      found = registered.find(c => String(c.id) === id);
      if (found) {
        console.log('Found in registered companies:', found);
        setCompany(found);
        setStatus('registered');
        setDoc(DEFAULT_DOC);
      }
    };

    findCompany();
  }, [id]);

  const handleAccept = () => {
    const applying = JSON.parse(sessionStorage.getItem('admin-applying-companies')) || [];
    const registered = JSON.parse(sessionStorage.getItem('admin-companies')) || [];
    
    const found = applying.find(c => String(c.id) === id);
    if (found) {
      // Remove from applying
      const newApplying = applying.filter(c => String(c.id) !== id);
      // Add to registered
      const newRegistered = [...registered, found];
      
      // Update sessionStorage
      sessionStorage.setItem('admin-applying-companies', JSON.stringify(newApplying));
      sessionStorage.setItem('admin-companies', JSON.stringify(newRegistered));
      
      // Dispatch custom event for immediate update
      window.dispatchEvent(new Event('companies-updated'));
    }
    navigate('/admin-home/companies');
  };

  const handleReject = () => {
    const applying = JSON.parse(sessionStorage.getItem('admin-applying-companies')) || [];
    const newApplying = applying.filter(c => String(c.id) !== id);
    
    // Update sessionStorage
    sessionStorage.setItem('admin-applying-companies', JSON.stringify(newApplying));
    
    // Dispatch custom event for immediate update
    window.dispatchEvent(new Event('companies-updated'));
    navigate('/admin-home/companies');
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

  if (!company) return <div className="company-details-page"><TopBar showSearch={false} /><main className="company-details-main"><h1>Loading…</h1></main></div>;

  return (
    <div className="company-details-page">
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
      <main className="company-details-main">
        <div className="company-details-card">
        <button
          className="company-details-back-btn"
          onClick={() => navigate(-1)}
        >
        Back
        </button>
          <div className="company-details-header">
            <img 
              src={require(`../assets/companies/${company.logo || 'valeo-logo.png'}`)} 
              alt={company.name} 
              className="company-details-logo" 
            />
            <div className="company-details-info">
              <h2 className="company-details-name">{company.name}</h2>
            </div>
          </div>
          <div className="company-details-content">
          <div className="company-details-meta">
                <span className="company-details-meta-label">Email:</span> {capitalize(company.email)}
              </div>
            <div className="company-details-meta">
                <span className="company-details-meta-label">Industry:</span> {capitalize(company.industry)}
              </div>
              <div className="company-details-meta">
                <span className="company-details-meta-label">Size:</span> {capitalize(company.size)}
              </div>
          </div>
          {status=== 'applying' && (<div className="company-details-document">
            <span className="company-details-label">Verification Document:</span>
            <div className="company-details-document-container">
            <a 
              href={doc} 
              download 
              target="_blank" 
              rel="noopener noreferrer" 
              className="iv-btn secondary company-details-download-btn"
            >
              Download PDF
            </a>
            </div>
          </div>
          )}
          {status === 'applying' && (
            <div className="company-details-actions">
              <button className="iv-btn primary" onClick={handleAccept}>Accept</button>
              <button className="iv-btn danger" onClick={handleReject}>Reject</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyDetails; 