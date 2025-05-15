import React, { useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom'
import './StudentHome.css';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import InternshipCard from '../components/InternshipCard';
import ProfileOverview from '../components/ProfileOverview';
import Notifications from '../components/Notifications';
import StudentNotifications from '../components/StudentNotifications';

import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon        from '../assets/icons/eval-icon.png';
import profileIcon     from '../assets/icons/profile-icon.png';
import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';

import internshipsData from '../data/internships.json';

const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const StudentHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() =>
    JSON.parse(sessionStorage.getItem('student-notifications')) || []
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsPosition, setNotificationsPosition] = useState(null);
  const notifBtnRef = useRef(null);

  useEffect(() => {
    // Load notifications from JSON file
    fetch('/data/student-notifications.json')
      .then(response => response.json())
      .then(data => {
        // Filter notifications for current student
        const studentNotifications = data.filter(notif => 
          String(notif.studentId) === String(user.id)
        );
        setNotifications(studentNotifications);
        // Store in sessionStorage for persistence
        sessionStorage.setItem('student-notifications', JSON.stringify(studentNotifications));
      })
      .catch(error => {
        console.error('Error loading notifications:', error);
        // Fallback to sessionStorage if fetch fails
        const storedNotifications = JSON.parse(sessionStorage.getItem('student-notifications')) || [];
        setNotifications(storedNotifications);
      });
  }, [user.id]);

  const handleNotificationClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setNotificationsPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX
    });
    setIsNotificationsOpen(true);
  };

  const handleNotificationAction = (action, notification) => {
    // Handle different notification actions
    switch (action.type) {
      case 'view_report':
      case 'appeal':
        navigate(action.link);
        break;
      case 'accept_call':
        // Handle call acceptance
        console.log('Accepting call:', notification.callId);
        // You would typically make an API call here
        break;
      case 'reject_call':
        // Handle call rejection
        console.log('Rejecting call:', notification.callId);
        // You would typically make an API call here
        break;
      case 'register':
        navigate(action.link);
        break;
      case 'decline':
        // Handle workshop decline
        console.log('Declining workshop:', notification.workshopId);
        // You would typically make an API call here
        break;
      default:
        if (action.link && action.link !== '#') {
          navigate(action.link);
        }
    }
    setIsNotificationsOpen(false);
  };

  // 1) Base list by department
  const baseList = internshipsData.filter(i => {
    if (user.id === '1') return i.department === 'IT';
    if (user.id === '2') return ['Finance','Marketing'].includes(i.department);
    return false;
  });

  // 2) Unique dropdown values
  const industries = Array.from(new Set(baseList.map(i => i.industry)));
  const durations  = Array.from(new Set(baseList.map(i => i.duration)));
  const payOptions = ['Paid','Unpaid'];

  // 3) Search + filter state
  const [filters, setFilters] = useState({
    title:   '',
    company: '',
    industry:'',
    duration:'',
    paid:    ''
  });

  const handleSearch = (title, company) => {
    setFilters(f => ({
      ...f,
      title:   title.toLowerCase(),
      company: company.toLowerCase()
    }));
  };
  const handleFilter = key => e =>
    setFilters(f => ({ ...f, [key]: e.target.value }));

  // 4) Apply search & dropdown filters
  const displayed = baseList
    .filter(i => {
      const t = i.title.toLowerCase();
      const c = i.company.toLowerCase();
      return (
        (!filters.title   || t.includes(filters.title)) &&
        (!filters.company || c.includes(filters.company))
      );
    })
    .filter(i => (
      (!filters.industry || i.industry === filters.industry) &&
      (!filters.duration  || i.duration  === filters.duration) &&
      (!filters.paid      ||
        (filters.paid === 'Paid' ? i.paid === true
                                : i.paid === false))
    ))
    // 5) ONLY show "not applied"
    .filter(i => i.status === 'not applied');

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
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

    const isPro=user.status==='Pro'?true:false;

    const menuItems=isPro?[
      <Link to="/student-home" className="sidebar-item">
        <img src={homeIcon} alt="dashboard" className="sidebar-icon" />
        <span>Dashboard</span>
        </Link>,
        <Link to="/all-internships" className="sidebar-item">
        <img src={internshipIcon} alt="Internships" className="sidebar-icon" />
        <span>All Internships</span>
        </Link>,
        <Link to="/student-applications" className="sidebar-item">
          <img src={applicationIcon} alt="applications" className="sidebar-icon" />
          <span>My Applications</span>
        </Link>,
        <Link to="/student-internships" className="sidebar-item">
          <img src={evalIcon} alt="eval" className="sidebar-icon" />
          <span>My Internships & Reports</span>
        </Link>,
        <Link to="/student-appointments" className="sidebar-item">
          <img src={appointmentIcon} alt="Appointments" className="sidebar-icon" />
          <span>Appointments</span>
        </Link>,
        <Link to="/student-workshops" className="sidebar-item">
        <img src={workshopIcon} alt="Workshops" className="sidebar-icon" />
        <span>Workshops</span>
        </Link>,
        <Link to="/student-profile" className="sidebar-item">
        <img src={profileIcon} alt="profile" className="sidebar-icon" />
        <span>Profile</span>
        </Link>,
        <Link to="/login" className="sidebar-item">
          <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
          <span>Logout</span>
        </Link>
        ] : [<Link to="/student-home" className="sidebar-item">
          <img src={homeIcon} alt="dashboard" className="sidebar-icon" />
          <span>Dashboard</span>
          </Link>,
          <Link to="/all-internships" className="sidebar-item">
          <img src={internshipIcon} alt="Internships" className="sidebar-icon" />
          <span>All Internships</span>
          </Link>,
          <Link to="/student-applications" className="sidebar-item">
            <img src={applicationIcon} alt="applications" className="sidebar-icon" />
            <span>My Applications</span>
          </Link>,
          <Link to="/student-internships" className="sidebar-item">
            <img src={evalIcon} alt="eval" className="sidebar-icon" />
            <span>My Internships & Reports</span>
          </Link>,
          <Link to="/student-profile" className="sidebar-item">
          <img src={profileIcon} alt="profile" className="sidebar-icon" />
          <span>Profile</span>
          </Link>,
          <Link to="/login" className="sidebar-item">
            <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
            <span>Logout</span>
          </Link>];


  return (
    <div className="dashboard-container">
      <TopBar onSearch={handleSearch} menuItems={menuItems}>
        <StudentNotifications />
        <button className="topbar-button" onClick={()=> navigate('/student-home')}>
          <img src={homeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/student-profile')}>
          <img src={profileIcon} alt="profile" className="topbar-icon" />
          <span>Profile</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/login')}>
          <img src={logoutIcon} alt="logout" className="topbar-icon" />
          <span>Logout</span>
        </button>
      </TopBar>

      <Notifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        position={notificationsPosition}
      >
        {notifications}
      </Notifications>

      <div className="main-content">
        <aside className="overview">
          <ProfileOverview
            name={user.name}
            email={user.email}
            major={user.major}
            status={user.status}
            completedMonths={user.completedMonths}
            totalMonths={3}
            cycle={{ state:'Active', start:'March 1, 2025', end:'June 1, 2025' }}
            profileUrl={'/student-profile'}
            profilePicture={user.profilePicture}
          >
          </ProfileOverview>
        </aside>

        <section className="internship-section">
          <h2 className="section-title">Suggested for you!</h2>

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
              ? displayed.map(i => <InternshipCard key={i.id} {...i} />)
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

export default StudentHome;
