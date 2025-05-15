import React, { useState, useEffect, useRef } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import ReportCard from '../components/ReportCard';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import reportsData from '../data/reports.json';
import './AdminReports.css';
import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';

import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';

const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))];
const MODAL_WIDTH = 340; // should match min-width in Notifications.css


const AdminReports = () => {
  // Turning Point 1: session-persisted reports
  const [reports, setReports] = useState(() =>
    JSON.parse(sessionStorage.getItem('admin-reports')) || reportsData
  );
  useEffect(() => {
    sessionStorage.setItem('admin-reports', JSON.stringify(reports));
  }, [reports]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [majorFilter, setMajorFilter] = useState('all');
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);

  const majors = getUnique(reports, 'major');
  const statuses = getUnique(reports, 'status');

  const filteredReports = reports.filter(r =>
    (statusFilter === 'all' || r.status === statusFilter) &&
    (majorFilter === 'all' || r.major === majorFilter)
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
    <div className="admin-reports-page">
      <TopBar showSearch={true} menuItems={menuItems}>
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
      <div className="admin-reports-content">
        <h1 className="admin-reports-title">Internship Reports</h1>
        <div className="admin-reports-filters-row">
          <Filter
            title="Status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </Filter>
          <Filter
            title="Major"
            value={majorFilter}
            onChange={e => setMajorFilter(e.target.value)}
          >
            <option value="all">All Majors</option>
            {majors.map(m => <option key={m} value={m}>{m}</option>)}
          </Filter>
        </div>
        <div className="admin-reports-list">
          {filteredReports.length ? filteredReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => navigate(`/admin/reports/${report.id}`)}
            />
          )) : <div className="no-reports">No reports found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminReports; 