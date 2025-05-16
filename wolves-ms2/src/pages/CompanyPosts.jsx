import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link }       from 'react-router-dom';
import TopBar                from '../components/TopBar';
import Filter                from '../components/Filter';
import InternshipCard        from '../components/InternshipCard';
import internshipsData       from '../data/internships.json';
import './AllInternships.css';
import ApplicationIcon from '../assets/icons/application-icon.png';
import MyPosts     from '../assets/icons/posts-icon.png';
import Interns     from '../assets/icons/interns-icon.png';
import NotificationIcon from '../assets/icons/notif-icon.png';
import HomeIcon from '../assets/icons/home-icon.png';
import LogoutIcon from '../assets/icons/logout-icon.png';
import CompanyNotifications from '../components/CompanyNotifications';
const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const CompanyPosts = () => {
  const navigate = useNavigate();
  
  // Initialize posts from sessionStorage or default to first 4 internships
  const [posts, setPosts] = useState(() => {
    const savedPosts = sessionStorage.getItem('companyPosts');
    if (savedPosts) {
      return JSON.parse(savedPosts);
    }
    return internshipsData.filter(i => [1, 2, 3, 4].includes(Number(i.id)));
  });

  // Save posts to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('companyPosts', JSON.stringify(posts));
  }, [posts]);

  const industries = Array.from(new Set(posts.map(i => i.industry)));
  const durations  = Array.from(new Set(posts.map(i => i.duration)));
  const payOptions = ['Paid','Unpaid'];

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

  const handleCardClick = (id) => {
    navigate(`/company-posts/${id}`);
  };

  const handleEdit = (id) => {
    // Store the post being edited in sessionStorage
    const postToEdit = posts.find(post => String(post.id) === String(id));
    if (postToEdit) {
      sessionStorage.setItem('editingPost', JSON.stringify(postToEdit));
      // Ensure we're using the correct ID format
      navigate(`/company-posts/${String(id)}/edit`);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this internship post?')) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const displayed = posts
    .filter(i => {
      const t = i.title.toLowerCase();
      const c = i.company.toLowerCase();
      return (!filters.title   || t.includes(filters.title))
          && (!filters.company || c.includes(filters.company));
    })
    .filter(i =>
      (!filters.industry || i.industry === filters.industry) &&
      (!filters.duration  || i.duration  === filters.duration) &&
      (!filters.paid      ||
         (filters.paid === 'Paid' ? i.paid === true : i.paid === false))
    )
    .filter(i =>
      (!filters.status || filters.status === 'All') ||
      i.status === filters.status
    );

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
        <section className="internship-section">
          <div className="inner-container">
            <h2 className="section-title-all">Posted Internships</h2>

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
            </div>

            <div className="internship-cards">
              {displayed.length
                ? displayed.map(i =>
                    <InternshipCard
                      key={i.id}
                      {...i}
                      hideStatus={true}
                      viewCount={true}
                      onClick={() => handleCardClick(i.id)}
                    />
                  )
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

export default CompanyPosts;
