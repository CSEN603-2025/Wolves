import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import CompanyCard from '../components/CompanyCard';
import Filter from '../components/Filter';
import SearchBar from '../components/SearchBar';
import './AdminCompanies.css';
import AdminNotifications from '../components/AdminNotifications';
import Notifications from '../components/Notifications';
import scadLogo from '../assets/scad-logo.png';
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
const CARD_CONTAINER_WIDTH = 1000;
const MODAL_WIDTH = 340; // should match min-width in Notifications.css


const AdminCompanies = () => {
  const [tab, setTab] = useState('applying');
  const [applying, setApplying] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);
  const [notifications, setNotifications] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-notifs')) || []
  );

  // Load data from sessionStorage or initialize from JSON files
  useEffect(() => {
    const loadData = async () => {
      console.log('loadData function called'); // Debug log
      let applyingCompaniesData = JSON.parse(sessionStorage.getItem('admin-applying-companies'));
      let registeredCompaniesData = JSON.parse(sessionStorage.getItem('admin-registered-companies'));

      console.log('SessionStorage registeredCompaniesData:', registeredCompaniesData); // Debug log

      if (!applyingCompaniesData) {
        const module = await import('../data/applying-companies.json');
        applyingCompaniesData = module.default;
        sessionStorage.setItem('admin-applying-companies', JSON.stringify(applyingCompaniesData));
      }

      if (!registeredCompaniesData) {
        const module = await import('../data/companies.json');
        registeredCompaniesData = module.default;
        console.log('Loaded registered data from companies.json:', registeredCompaniesData); // Debug log
        sessionStorage.setItem('admin-registered-companies', JSON.stringify(registeredCompaniesData));
      }

      setApplying(applyingCompaniesData);
      setRegistered(registeredCompaniesData);
    };

    loadData();
  }, []);

  // Listen for changes in sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const applyingCompaniesData = JSON.parse(sessionStorage.getItem('admin-applying-companies')) || [];
      const registeredCompaniesData = JSON.parse(sessionStorage.getItem('admin-registered-companies')) || [];
      setApplying(applyingCompaniesData);
      setRegistered(registeredCompaniesData);
    };

    // Listen for both storage events and custom events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('companies-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('companies-updated', handleStorageChange);
    };
  }, []);

  const filteredApplying = applying.filter(c =>
    (!search || c.name.toLowerCase().includes(search.toLowerCase())) &&
    (!industry || c.industry === industry)
  );
  const industries = Array.from(new Set(applying.map(c => c.industry)));

  const handleSearch = (name) => {
    setSearch(name);
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
    <div className="admin-companies-page">
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
      <main className="admin-companies-main">
        <h1 className="admin-companies-title">Companies</h1>
        <div className="admin-companies-tabs">
          <button
            className={`tab-btn${tab === 'applying' ? ' active' : ''}`}
            onClick={() => setTab('applying')}
          >
            Applying Companies
          </button>
          <button
            className={`tab-btn${tab === 'registered' ? ' active' : ''}`}
            onClick={() => setTab('registered')}
          >
            Registered Companies
          </button>
        </div>
        {tab === 'applying' && (
          <section className="admin-companies-section">
            <div className="admin-companies-filters">
              <div className="admin-companies-search">
                <SearchBar onSearch={(name) => handleSearch(name)} companySearch={true} showSecondary={false} placeholderPrimary="Company Name" />
              </div>
              <Filter title="Industry" value={industry} onChange={e => setIndustry(e.target.value)}>
                <option value="">All</option>
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </Filter>
            </div>
            {filteredApplying.length ? filteredApplying.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={() => navigate(`/admin-home/companies/${company.id}`)}
              />
            )) : <div className="admin-companies-no-results">No applying companies found.</div>}
          </section>
        )}
        {tab === 'registered' && (
          <section className="admin-companies-section">
            {registered.length ? registered.map(company => {
              console.log('Company being passed to CompanyCard:', company); // Debug log
              return (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onClick={() => navigate(`/admin-home/companies/${company.id}`)}
                />
              );
            }) : <div className="admin-companies-no-results">No registered companies found.</div>}
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminCompanies; 