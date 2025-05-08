// File: src/pages/CompanyInterns.jsx
import React, { useState } from 'react';
import { useNavigate }      from 'react-router-dom';
import TopBar               from '../components/TopBar';
import Filter               from '../components/Filter';
import SearchBar            from '../components/SearchBar';
import ApplicationOverview  from '../components/ApplicationOverview';
import applicationsData     from '../data/interns.json';
import internshipsData      from '../data/internships.json';
import studentsData         from '../data/students.json';

import NewPost         from '../assets/icons/new-icon.png';
import MyPosts         from '../assets/icons/posts-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import Interns         from '../assets/icons/interns-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import HomeIcon        from '../assets/icons/home-icon.png';
import './CompanyInterns.css';

const CompanyInterns = () => {
  const navigate = useNavigate();

  // 1) only current interns / completed
  const allInterns = applicationsData
    .filter(a => ['Current Intern','Internship Complete'].includes(a.status))
    .map(a => {
      const s = studentsData.find(s => String(s.id) === String(a.studentId))      || {};
      const i = internshipsData.find(i => String(i.id) === String(a.internshipId)) || {};
      return {
        ...a,
        studentName:     s.name        || `#${a.studentId}`,
        internshipTitle: i.title       || `#${a.internshipId}`
      };
    });

  // 2) search + filter state
  const [filters, setFilters] = useState({ queryName: '', queryJob: '', status: '' });
  const applySearch = (name, job) => {
    setFilters(f => ({ ...f, queryName: name.trim(), queryJob: job.trim() }));
  };
  const handleFilter = key => e =>
    setFilters(f => ({ ...f, [key]: e.target.value }));

  // 3) apply search & status filter
  const displayed = allInterns
    .filter(item =>
      (!filters.queryName   || item.studentName.toLowerCase().includes(filters.queryName.toLowerCase())) &&
      (!filters.queryJob    || item.internshipTitle.toLowerCase().includes(filters.queryJob.toLowerCase()))
    )
    .filter(item =>
      !filters.status ||
      filters.status === 'All' ||
      item.status === filters.status
    );

  return (
    <div className="ci-container">
      <TopBar showSearch={false}>
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

      <main className="ci-main">
        <div className="ci-panel">
          <h2 className="ci-title">My Current Interns</h2>

          <div className="ci-filters">
            {/* <SearchBar> now searches by student name & job title */}
            <SearchBar
              onSearch={applySearch}
              placeholderPrimary="Student name…"
              placeholderSecondary="Job title…"
              showSecondary={true}
            />

            <Filter
              title="Status"
              value={filters.status}
              onChange={handleFilter('status')}
            >
              <option value="All">All</option>
              <option value="Current Intern">Current Intern</option>
              <option value="Internship Complete">Internship Complete</option>
            </Filter>
          </div>

          <div className="ci-list">
            {displayed.length > 0 ? (
              displayed.map(app => (
                <ApplicationOverview
                  key={app.id}
                  id={app.id}
                  studentName={app.studentName}
                  internshipTitle={app.internshipTitle}
                  status={app.status}
                  basePath="company-interns"
                />
              ))
            ) : (
              <p className="ci-no-results">No interns match your criteria.</p>
            )}
          </div>
        </div>
      </main>

      <footer className="ci-footer">
        GUC Internship Platform © 2025
      </footer>
    </div>
  );
};

export default CompanyInterns;
