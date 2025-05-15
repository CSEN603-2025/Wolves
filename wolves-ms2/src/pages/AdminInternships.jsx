import React, { useState, useRef } from 'react';
import { useNavigate,Link }       from 'react-router-dom';
import { useAuth }           from '../context/AuthContext';
import TopBar                from '../components/TopBar';
import Filter                from '../components/Filter';
import InternshipCard        from '../components/InternshipCard';
import internshipsData       from '../data/internships.json';

import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';

import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';
import './AllInternships.css';

const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const AdminInternships = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);

  // No department filtering here
  const baseList = internshipsData;

  // Unique dropdown options
  const industries = Array.from(new Set(baseList.map(i => i.industry)));
  const durations  = Array.from(new Set(baseList.map(i => i.duration)));
  const payOptions = ['Paid','Unpaid'];
  const statusOptions = [
    'not applied',
    'pending',
    'finalized',
    'accepted',
    'rejected'
  ];

  const [filters, setFilters] = useState({
    title:    '',
    company:  '',
    industry: '',
    duration: '',
    paid:     '',
    status:   ''
  });

  const handleSearch = (title, company) => {
    setFilters(f => ({
      ...f,
      title:   title.trim().toLowerCase(),
      company: company.trim().toLowerCase()
    }));
  };

  const handleFilter = key => e => {
    setFilters(f => ({ ...f, [key]: e.target.value }));
  };

  // apply text + dropdown filters
  const displayed = baseList
    // text search
    .filter(i => {
      const t = i.title.toLowerCase();
      const c = i.company.toLowerCase();
      return (!filters.title   || t.includes(filters.title))
          && (!filters.company || c.includes(filters.company));
    })
    // industry / duration / pay
    .filter(i =>
      (!filters.industry || i.industry === filters.industry) &&
      (!filters.duration  || i.duration  === filters.duration) &&
      (!filters.paid      ||
         (filters.paid === 'Paid'
            ? i.paid === true
            : i.paid === false))
    )
    // status
    .filter(i =>
      (!filters.status || filters.status === 'All')
      || i.status === filters.status
    );

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
        <Link to="/admin/notifications" className="sidebar-item">
          <img src={notificationIcon} alt="Notifications" className="sidebar-icon" />
          <span>Notifications</span>
        </Link>
        <Link to="/login" className="sidebar-item">
          <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
          <span>Logout</span>
        </Link>
      </>
    );

  return (
    <div className="dashboard-container">
      <TopBar onSearch={handleSearch} menuItems={menuItems}>
      <button
          className="topbar-button"
          ref={notifBtnRef}
          onClick={handleNotifClick}
        >
          <img src={notificationIcon} alt="Notifications" className="topbar-icon" />
          <span>Notifications</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/admin-home')}>
          <img src={homeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/login')}>
          <img src={logoutIcon} alt="logout" className="topbar-icon" />
          <span>Logout</span>
        </button>
      </TopBar>

      <div className="main-content">
        <section className="internship-section">
          <div className="inner-container">
            <h2 className="section-title-all">All Internships</h2>

            <div className="filters-bar-all">
              <Filter title="Industry" value={filters.industry} onChange={handleFilter('industry')}>
                <option value="">All</option>
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </Filter>

              <Filter title="Duration" value={filters.duration} onChange={handleFilter('duration')}>
                <option value="">All</option>
                {durations.map(dur => <option key={dur} value={dur}>{dur}</option>)}
              </Filter>

              <Filter title="Pay" value={filters.paid} onChange={handleFilter('paid')}>
                <option value="">All</option>
                {payOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </Filter>

              <Filter
                title="Application Status"
                value={filters.status}
                onChange={handleFilter('status')}
              >
                <option value="">All</option>
                {statusOptions.map(st => (
                  <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
                ))}
              </Filter>
            </div>

            <div className="internship-cards">
              {displayed.length
                ? displayed.map(i => <InternshipCard key={i.id} {...i} hideStatus={true}/>)
                : <p className="no-results">No internships match your filters.</p>
              }
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        GUC Internship Platform © 2025
      </footer>
    </div>
  );
};

export default AdminInternships;
