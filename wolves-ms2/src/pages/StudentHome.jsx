import React, { useState } from 'react';
import './StudentHome.css';

import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import InternshipCard from '../components/InternshipCard';
import ProfileOverview from '../components/ProfileOverview';

import internshipIcon  from '../assets/icons/internships-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon        from '../assets/icons/eval-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import profileIcon     from '../assets/icons/profile-icon.png';

import internshipsData from '../data/internships.json';

const StudentHome = () => {
  const { user } = useAuth();

  // all base internships by department
  const baseList = internshipsData.filter(i => {
    if (user.id === '1')    return i.department === 'IT';
    if (user.id === '2') {
      return ['Finance', 'Marketing'].includes(i.department);
    }
    return false;
  });

  // unique values for our dropdowns
  const industries = Array.from(new Set(baseList.map(i => i.industry)));
  const durations  = Array.from(new Set(baseList.map(i => i.duration)));
  const payOptions = ['Paid', 'Unpaid'];

  // search + filter state
  const [filters, setFilters] = useState({
    title:    '',
    company:  '',
    industry: '',
    duration: '',
    paid:     ''
  });

  const handleSearch = (title, company) => {
    setFilters(f => ({ ...f,
      title:   title.toLowerCase(),
      company: company.toLowerCase()
    }));
  };

  const handleFilter = key => e =>
    setFilters(f => ({ ...f, [key]: e.target.value }));

  // apply text + dropdown filters
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
        (filters.paid === 'Paid'   ? i.paid === true
                                   : i.paid === false))
    ));

  return (
    <div className="dashboard-container">
      <TopBar onSearch={handleSearch}>
        <button className="topbar-button">
          <img src={internshipIcon}  alt="Internships"  className="topbar-icon" />
          <span>Internships</span>
        </button>
        <button className="topbar-button">
          <img src={applicationIcon} alt="Applications"  className="topbar-icon" />
          <span>Applications</span>
        </button>
        <button className="topbar-button">
          <img src={evalIcon}        alt="Evaluations"   className="topbar-icon" />
          <span>Evaluations</span>
        </button>
        <button className="topbar-button">
          <img src={notifIcon}       alt="Notifications" className="topbar-icon" />
          <span>Notifications</span>
        </button>
        <button className="topbar-button">
          <img src={profileIcon}     alt="Profile"       className="topbar-icon" />
          <span>Profile</span>
        </button>
      </TopBar>

      <div className="main-content">
        <aside className="sidebar">
          <ProfileOverview
            name={user.name}
            email={user.email}
            major={user.major}
            status={user.status}
            completedMonths={user.completedMonths}
            totalMonths={3}
            cycle={{ state: 'Active', start: 'March 1, 2025', end: 'June 1, 2025' }}
            profileUrl={user.profileUrl}
            profilePicture={user.profilePicture}
          >
            <button className="po-btn">
              <img src={notifIcon} alt="Notifications" /> Notifications
            </button>
            <button className="po-btn">
              <img src={applicationIcon} alt="Applications" /> Applications
            </button>
            <button className="po-btn">
              <img src={evalIcon} alt="Evaluations" /> Evaluations
            </button>
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
