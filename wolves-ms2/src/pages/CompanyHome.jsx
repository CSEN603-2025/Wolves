// File: src/pages/CompanyHome.jsx
import React, { useState ,useEffect} from 'react';
import './StudentHome.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import InternshipCard from '../components/InternshipCard';
import ProfileOverview from '../components/ProfileOverview';

import applicationIcon from '../assets/icons/application-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import NewPost     from '../assets/icons/new-icon.png';
import MyPosts     from '../assets/icons/posts-icon.png';
import Interns     from '../assets/icons/interns-icon.png';
import HomeIcon        from '../assets/icons/home-icon.png';

import internshipsData from '../data/internships.json';

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

  return (
    <div className="dashboard-container">
      <TopBar onSearch={handleSearch}>
        <button className="topbar-button" onClick={()=> navigate('/company-posts')}>
          <img src={MyPosts} alt="my-posts"  className="topbar-icon" />
          <span>My Posts</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/company-applications')}>
          <img src={applicationIcon} alt="Applications"  className="topbar-icon" />
          <span>Applications</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/company-interns')}>
          <img src={Interns}     alt="interns"       className="topbar-icon" />
          <span>Interns</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/company-home')}>
          <img src={HomeIcon}     alt="home"       className="topbar-icon" />
          <span>Home</span>
        </button>
      </TopBar>

      <div className="main-content">
        <aside className="sidebar">
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
            <button className="po-btn" onClick={()=> navigate('/')}>
              <img src={MyPosts} alt="" /> My Posts
            </button>
            <button className="po-btn" onClick={()=> navigate('/')}>
              <img src={applicationIcon} alt="" /> Applications
            </button>
            <button className="po-btn" onClick={()=> navigate('/')}>
              <img src={Interns} alt="" /> Interns & Evaluations
            </button>
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
