import React, { useState } from 'react';
import { useNavigate }      from 'react-router-dom';
import { useAuth }          from '../context/AuthContext';
import TopBar               from '../components/TopBar';
import SearchBar            from '../components/SearchBar';
import Filter               from '../components/Filter';
import InternshipCard       from '../components/InternshipCard';
import applicationsData     from '../data/company-student.json';
import internshipsData      from '../data/student-internships.json';
import './StudentInternships.css';

import internshipIcon  from '../assets/icons/internships-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon        from '../assets/icons/eval-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import profileIcon     from '../assets/icons/profile-icon.png';
import HomeIcon        from '../assets/icons/home-icon.png';

export default function StudentInternships() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1) Merge current student’s applications with internship details
  const mergedList = applicationsData
    .filter(a => String(a.studentId) === String(user.id))
    .map(a => {
      const i = internshipsData.find(x => String(x.id) === String(a.internshipId)) || {};
      return {
        id:       i.id,
        title:    i.title,
        company:  i.company,
        location: i.location,
        industry: i.industry,
        duration: i.duration,
        paid:     i.paid,
        salary:   i.salary,
        logo:     i.logo,
        status:   i.status
      };
    });

  // 2) Search & filter state
  const [searchTitle,   setSearchTitle]   = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [statusFilter,  setStatusFilter]  = useState('All');

  // 3) Handlers
  const handleSearch = (title, company) => {
    setSearchTitle(title.trim().toLowerCase());
    setSearchCompany(company.trim().toLowerCase());
  };
  const handleStatusChange = e => {
    setStatusFilter(e.target.value);
  };

  // 4) Apply filters
  const displayed = mergedList
    .filter(item => {
      const t = item.title.toLowerCase();
      const c = item.company.toLowerCase();
      return (
        (!searchTitle   || t.includes(searchTitle)) &&
        (!searchCompany || c.includes(searchCompany))
      );
    })
    .filter(item =>
      statusFilter === 'All' ||
      item.status === statusFilter
    );

  return (
    <div className="si-dashboard">
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

      <div className="si-container">
        <h2 className="si-title">My Internships</h2>

        <div className="si-controls">
          <Filter
            title="Internship Status"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option>All</option>
            <option>Current Intern</option>
            <option>Internship Complete</option>
          </Filter>
        </div>

        <div className="si-list">
          {displayed.length > 0 ? (
            displayed.map(item => (
              <InternshipCard key={item.id} {...item} evaluation={item.status}/>
            ))
          ) : (
            <p className="si-no-results">
              No internships match your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
