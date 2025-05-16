// File: src/pages/CompanyInterns.jsx
import React, { useState, useRef } from 'react';
import { useNavigate, Link }      from 'react-router-dom';
import TopBar               from '../components/TopBar';
import Filter               from '../components/Filter';
import SearchBar            from '../components/SearchBar';
import ApplicationOverview  from '../components/ApplicationOverview';
import applicationsData     from '../data/interns.json';
import internshipsData      from '../data/internships.json';
import studentsData         from '../data/students.json';
import './CompanyInterns.css';
import ApplicationIcon from '../assets/icons/application-icon.png';
import MyPosts     from '../assets/icons/posts-icon.png';
import Interns     from '../assets/icons/interns-icon.png';
import NotificationIcon from '../assets/icons/notif-icon.png';
import HomeIcon from '../assets/icons/home-icon.png';
import LogoutIcon from '../assets/icons/logout-icon.png';
import CompanyNotifications from '../components/CompanyNotifications';
const MODAL_WIDTH = 340; // should match min-width in Notifications.css



const CompanyInterns = () => {
  const navigate = useNavigate();

  // 1) only current interns / completed
  const allInterns = applicationsData
    .filter(a => ['Current Intern','Internship Complete'].includes(a.status))
    .map(a => {
      const s = studentsData.find(s => String(s.id) === String(a.studentId))      || {};
      const i = internshipsData.find(i => String(i.id) === String(a.internshipId)) || {};
      return {
        ...a,
        studentName:     s.name        || `#${a.studentId}`,
        internshipTitle: i.title       || `#${a.internshipId}`
      };
    });

  // 2) search + filter state
  const [filters, setFilters] = useState({
    search: '',
    searchSecondary: '',
    status: 'Current Intern',
    industry: 'all',
    duration: 'all',
    pay: 'all'
  });

  const applySearch = (primary, secondary) => {
    setFilters(prev => ({
      ...prev,
      search: primary,
      searchSecondary: secondary
    }));
  };

  const filteredInterns = allInterns.filter(intern => {
    const matchesSearch = 
      (filters.search === '' || intern.internshipTitle.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.searchSecondary === '' || intern.studentName.toLowerCase().includes(filters.searchSecondary.toLowerCase()));
    const matchesStatus = filters.status === 'all' || intern.status === filters.status;
    const matchesIndustry = filters.industry === 'all' || intern.industry === filters.industry;
    const matchesDuration = filters.duration === 'all' || intern.duration === filters.duration;
    const matchesPay = filters.pay === 'all' || intern.pay === filters.pay;

    return matchesSearch && matchesStatus && matchesIndustry && matchesDuration && matchesPay;
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
      <Link to="/login" className="sidebar-item">
        <img src={LogoutIcon} alt="Logout" className="sidebar-icon" />
        <span>Logout</span>
      </Link>
    </>
  );

  return (
    <div className="ci-container">
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

      <main className="ci-main">
        <div className="ci-panel">
          <h2 className="ci-title">My Current Interns</h2>

          <div className="ci-filters">
            <div className="search-row">
              <SearchBar
                onSearch={applySearch}
                placeholderPrimary="Job title..."
                placeholderSecondary="Student name..."
              />
            </div>

            <div className="filters-row">
              <Filter
                title="Status"
                value={filters.status}
                onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All</option>
                <option value="Current Intern">Current</option>
                <option value="Internship Complete">Completed</option>
              </Filter>
            </div>
          </div>

          <div className="ci-list">
            {filteredInterns.length > 0 ? (
              filteredInterns.map(app => (
                <ApplicationOverview
                  key={app.id}
                  id={app.id}
                  studentName={app.studentName}
                  internshipTitle={app.internshipTitle}
                  status={app.status}
                  basePath="company-interns"
                />
              ))
            ) : (
              <p className="ci-no-results">No interns match your criteria.</p>
            )}
          </div>
        </div>
      </main>

      <footer className="ci-footer">
        GUC Internship Platform © 2025
      </footer>
    </div>
  );
};

export default CompanyInterns;
