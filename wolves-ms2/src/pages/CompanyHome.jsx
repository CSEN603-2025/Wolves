// File: src/pages/CompanyHome.jsx
import React, { useState, useEffect } from 'react';
import './StudentHome.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import InternshipCard from '../components/InternshipCard';
import ProfileOverview from '../components/ProfileOverview';
import CompanyNotifications from '../components/CompanyNotifications';

import ApplicationIcon from '../assets/icons/application-icon.png';
import MyPosts     from '../assets/icons/posts-icon.png';
import Interns     from '../assets/icons/interns-icon.png';
import NotificationIcon from '../assets/icons/notif-icon.png';
import NewNotificationIcon from '../assets/icons/new-notif-icon.png';
import HomeIcon from '../assets/icons/home-icon.png';
import LogoutIcon from '../assets/icons/logout-icon.png';

import internshipsData from '../data/internships.json';

const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const CompanyHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // base list & filter dropdown values
  const baseList   = internshipsData;
  const industries = Array.from(new Set(baseList.map(i => i.industry)));
  const durations  = Array.from(new Set(baseList.map(i => i.duration)));
  const payOptions = ['Paid','Unpaid'];

  // search + filter state
  const [filters, setFilters] = useState({
    title:   '',
    industry:'',
    duration:'',
    paid:    ''
  });
  const handleSearch = (t, c) => {
    setFilters(f => ({ ...f, title:t.toLowerCase() }));
  };
  const handleFilter = key => e =>
    setFilters(f => ({ ...f, [key]: e.target.value }));

  // apply filters
  const displayed = baseList
    .filter(i =>
      (!filters.title   || i.title.toLowerCase().includes(filters.title)) &&
      (!filters.industry || i.industry === filters.industry) &&
      (!filters.duration  || i.duration  === filters.duration) &&
      (!filters.paid      ||
        (filters.paid === 'Paid' ? i.paid : !i.paid))
    );

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
    <div className="dashboard-container">
      <TopBar onSearch={handleSearch} menuItems={menuItems}>
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

      <div className="main-content">
        <aside className="overview">
          <ProfileOverview
            name={user.name}
            email={user.email}
            major={null}
            status={user.status}
            completedMonths={null}
            totalMonths={null}
            cycle={{ state:'Active', start:'March 1, 2025', end:'June 1, 2025' }}
            profileUrl={'/company-home'}
            profilePicture={'companies/microsoft-logo.png'}
            hideMajor={true}
            hideProgress={true}
          >
          </ProfileOverview>
        </aside>

        <section className="internship-section">
          <h2 className="section-title">All Internships</h2>

          <div className="filters-bar">
            <Filter
              title="Industry"
              value={filters.industry}
              onChange={handleFilter('industry')}
            >
              <option value="">All</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </Filter>

            <Filter
              title="Duration"
              value={filters.duration}
              onChange={handleFilter('duration')}
            >
              <option value="">All</option>
              {durations.map(dur => (
                <option key={dur} value={dur}>{dur}</option>
              ))}
            </Filter>

            <Filter
              title="Pay"
              value={filters.paid}
              onChange={handleFilter('paid')}
            >
              <option value="">All</option>
              {payOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Filter>
          </div>

          <div className="internship-cards">
            {displayed.length
              ? displayed.map(i => <InternshipCard
                key={i.id}
                {...i}
                hideStatus={true}
              />)
              : <p className="no-results">No internships match your filters.</p>
            }
          </div>
        </section>
      </div>

      <footer className="footer">
        GUC Internship Platform © 2025
      </footer>
    </div>
  );
};

export default CompanyHome;
