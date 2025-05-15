import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminStudents.css';
import StudentCard from '../components/StudentCard';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';

import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';
const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const STATUS_OPTIONS = [
  '',
  'Regular Student',
  'Pro Student'
];

const getMergedStudents = async () => {
  // Load base students from students.json
  const base = await import('../data/students.json').then(m => m.default);
  // Load CRUD/sessionStorage data
  const crud = JSON.parse(sessionStorage.getItem('admin-students') || '[]');
  // Merge: if CRUD has a student with same id, use CRUD data, else base
  const merged = base.map(stu => {
    const updated = crud.find(s => String(s.id) === String(stu.id));
    const mergedStu = { ...stu, ...(updated || {}) };
    // Set status
    mergedStu.status = (mergedStu.completedMonths >= 3) ? 'Pro Student' : 'Regular Student';
    return mergedStu;
  });
  return merged;
};

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);

  useEffect(() => {
    getMergedStudents().then(setStudents);
  }, []);

  const filtered = statusFilter
    ? students.filter(s => s.status === statusFilter)
    : students;

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
    <div className="admin-students-page">
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
      <div className="students-header">
        <h1>All Students</h1>
        <div className="students-filter-bar">
          <Filter
            title="Student Status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Regular Student">Regular Student</option>
            <option value="Pro Student">Pro Student</option>
          </Filter>
        </div>
      </div>
      <div className="students-list">
        {filtered.length === 0 ? (
          <div className="no-students">No students found.</div>
        ) : (
          filtered.map(student => (
            <StudentCard
              key={student.id}
              {...student}
              internshipStatus={student.status}
              completedMonths={student.completedMonths}
              totalMonths={3}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStudents; 