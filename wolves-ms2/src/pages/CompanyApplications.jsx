import React, { useState } from 'react';
import { useNavigate }      from 'react-router-dom';
import TopBar               from '../components/TopBar';
import Filter               from '../components/Filter';
import ApplicationOverview  from '../components/ApplicationOverview';
import applicationsData     from '../data/applications.json';
import internshipsData      from '../data/internships.json';
import studentsData         from '../data/students.json';

import NewPost         from '../assets/icons/new-icon.png';
import MyPosts         from '../assets/icons/posts-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import Interns         from '../assets/icons/interns-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import HomeIcon        from '../assets/icons/home-icon.png';

import './CompanyApplications.css';

const CompanyApplications = () => {
  const navigate = useNavigate();

  const baseList = applicationsData;

  const internshipOptions = Array.from(
    new Set(baseList.map(a => String(a.internshipId)))
  ).map(id => {
    const i = internshipsData.find(x => String(x.id) === id);
    return i && { id, title: i.title };
  }).filter(Boolean);

  const [filters, setFilters] = useState({ internship: '' });
  const handleFilter = key => e =>
    setFilters(f => ({ ...f, [key]: e.target.value }));

  const displayed = baseList
    .filter(a =>
      !filters.internship ||
      String(a.internshipId) === filters.internship
    )
    .map(app => {
      const student = studentsData.find(s =>
        String(s.id) === String(app.studentId)
      );
      const internship = internshipsData.find(i =>
        String(i.id) === String(app.internshipId)
      );
      return {
        ...app,
        studentName:     student ? student.name : `#${app.studentId}`,
        internshipTitle: internship ? internship.title : `#${app.internshipId}`
      };
    });

  return (
    <div className="company-apps-container">
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

      <div className="company-apps-main">
        <section className="company-apps-panel">
          <h2 className="company-apps-title">All Applications</h2>

          <div className="company-apps-filters">
            <Filter
              title="Internship"
              value={filters.internship}
              onChange={handleFilter('internship')}
            >
              <option value="">All</option>
              {internshipOptions.map(o => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </Filter>
          </div>

          <div className="company-apps-list">
            {displayed.length > 0 ? (
              displayed.map(app => (
                <ApplicationOverview
                  key={app.id}
                  id={app.id}
                  studentName={app.studentName}
                  internshipTitle={app.internshipTitle}
                  status={app.status}
                />
              ))
            ) : (
              <p className="company-apps-no-results">
                No applications match your filters.
              </p>
            )}
          </div>
        </section>
      </div>

      <footer className="company-apps-footer">
        GUC Internship Platform © 2025
      </footer>
    </div>
  );
};

export default CompanyApplications;
