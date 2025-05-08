
import React, { useState } from 'react';
import { useNavigate }       from 'react-router-dom';
import TopBar                from '../components/TopBar';
import Filter                from '../components/Filter';
import InternshipCard        from '../components/InternshipCard';
import internshipsData       from '../data/internships.json';

import applicationIcon from '../assets/icons/application-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import NewPost         from '../assets/icons/new-icon.png';
import MyPosts         from '../assets/icons/posts-icon.png';
import Interns         from '../assets/icons/interns-icon.png';
import HomeIcon        from '../assets/icons/home-icon.png';

import './AllInternships.css';

const CompanyPosts = () => {
  const navigate = useNavigate();

  const baseList = internshipsData.filter(i =>
    [1, 2, 3, 4].includes(Number(i.id))
  );

  const industries = Array.from(new Set(baseList.map(i => i.industry)));
  const durations  = Array.from(new Set(baseList.map(i => i.duration)));
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

  const displayed = baseList
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

  return (
    <div className="dashboard-container">
      <TopBar onSearch={handleSearch}>
        <button className="topbar-button" onClick={() => navigate('/company-home', {state: { openNewPostModal: true }})}>
            <img src={NewPost} alt="new-post" className="topbar-icon" />
            <span>New Post</span>
            </button>
            <button className="topbar-button" onClick={() => navigate('/company-posts')}>
                <img src={MyPosts} alt="My Posts" className="topbar-icon" />
                <span>My Posts</span>
            </button>
            <button className="topbar-button" onClick={() => navigate('/company-applications')}>
                <img src={applicationIcon} alt="Applications" className="topbar-icon" />
                <span>Applications</span>
            </button>
            <button className="topbar-button" onClick={() => navigate('/company-interns')}>
                <img src={Interns} alt="Interns" className="topbar-icon" />
                <span>Interns</span>
            </button>
            <button className="topbar-button">
                <img src={notifIcon} alt="Notifications" className="topbar-icon" />
                <span>Notifications</span>
            </button>
            <button className="topbar-button" onClick={() => navigate('/company-home')}>
                <img src={HomeIcon} alt="Home" className="topbar-icon" />
                <span>Home</span>
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
