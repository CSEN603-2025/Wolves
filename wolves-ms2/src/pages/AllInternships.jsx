import React, { useState } from 'react';
import { useNavigate }       from 'react-router-dom';
import { useAuth }           from '../context/AuthContext';
import TopBar                from '../components/TopBar';
import Filter                from '../components/Filter';
import InternshipCard        from '../components/InternshipCard';
import internshipsData       from '../data/internships.json';

import internshipIcon  from '../assets/icons/internships-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon        from '../assets/icons/eval-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import profileIcon     from '../assets/icons/profile-icon.png';
import HomeIcon        from '../assets/icons/home-icon.png';

import './AllInternships.css';

const AllInternships = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="dashboard-container">
      <TopBar onSearch={handleSearch}>
        <button className="topbar-button" onClick={() => navigate('/all-internships')}>
          <img src={internshipIcon}  alt="Internships"  className="topbar-icon" />
          <span>Internships</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/student-applications')}>
          <img src={applicationIcon} alt="Applications"  className="topbar-icon" />
          <span>Applications</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/student-internships')}>
          <img src={evalIcon}        alt="My Internships"   className="topbar-icon" />
          <span>My Internships</span>
        </button>
        <button className="topbar-button">
          <img src={notifIcon}       alt="Notifications" className="topbar-icon" />
          <span>Notifications</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/student-profile')}>
          <img src={profileIcon}     alt="Profile"       className="topbar-icon" />
          <span>Profile</span>
        </button>
          <button className="topbar-button" onClick={() => navigate('/student-home')}>
          <img src={HomeIcon}     alt="home"       className="topbar-icon" />
          <span>Home</span>
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
                ? displayed.map(i => <InternshipCard key={i.id} {...i} />)
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

export default AllInternships;
