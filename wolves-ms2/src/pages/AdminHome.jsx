import React, { useState } from 'react';
import './AdminHome.css';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import SearchBar from '../components/SearchBar';

import companiesData from '../data/companies.json';

import homeIcon from '../assets/icons/home-icon.png';
import companiesIcon from '../assets/icons/internships-icon.png';
import adminIcon from '../assets/icons/profile-icon.png';

const AdminHome = () => {
const navigate = useNavigate();
const [selectedCompany, setSelectedCompany] = useState(null);
const [companies, setCompanies] = useState(companiesData);

// Filter state
const [filters, setFilters] = useState({
name: '',
industry: ''
});

// Unique industries for filter dropdown
const industries = Array.from(new Set(companies.map(c => c.industry)));

// Handle search by company name
const handleSearch = (name) => {
setFilters(f => ({ ...f, name: name.toLowerCase() }));
};

// Handle industry filter
const handleFilter = (key) => (e) => {
setFilters(f => ({ ...f, [key]: e.target.value }));
};

// Apply filters
const filteredCompanies = companies.filter(company => {
const nameMatch = !filters.name ||
company.name.toLowerCase().includes(filters.name);
const industryMatch = !filters.industry ||
company.industry === filters.industry;
return nameMatch && industryMatch;
});

// Handle company actions
const handleViewDetails = (company) => {
setSelectedCompany(company);
};

const handleAccept = (companyId) => {
setCompanies(companies.filter(c => c.id !== companyId));
// In a real app, you would also update the backend here
};

const handleReject = (companyId) => {
setCompanies(companies.filter(c => c.id !== companyId));
// In a real app, you would also update the backend here
};

return (
<div className="dashboard-container">
<TopBar showSearch={false} >
<button className="topbar-button" onClick={() => navigate('/admin-home')}>
<img src={homeIcon} alt="Home" className="topbar-icon" />
<span>Home</span>
</button>
<button className="topbar-button" onClick={() => navigate('/admin-companies')}>
<img src={companiesIcon} alt="Companies" className="topbar-icon" />
<span>Companies</span>
</button>
<button className="topbar-button" onClick={() => navigate('/admin-profile')}>
<img src={adminIcon} alt="Profile" className="topbar-icon" />
<span>Profile</span>
</button>
</TopBar>
  <div className="main-content">
    <aside className="sidebar">
      <div className="profile-overview">
        <h2>SCAD Admin</h2>
        <p>Welcome to the administration panel</p>
        <div className="admin-stats">
          <p>Pending Applications: {companies.length}</p>
          <p>Total Companies: {companiesData.length}</p>
        </div>
      </div>
    </aside>

    <section className="companies-section">
      <h2 className="section-title">Company Applications</h2>

      <div className="filters-bar">
        <SearchBar 
          onSearch={(name) => handleSearch(name)} 
          placeholder="Search companies..."
        />
        
        <Filter
          title="Industry"
          value={filters.industry}
          onChange={handleFilter('industry')}
        >
          <option value="">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </Filter>
      </div>

      <div className="companies-cards">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map(company => (
            <div key={company.id} className="company-card">
              <img 
                src={`/assets/logos/${company.logo}`} 
                alt={`${company.name} logo`} 
                className="company-logo" 
              />
              <h3 className="company-name">{company.name}</h3>
              <p className="company-industry">{company.industry}</p>
              <p className="company-email">{company.email}</p>
              <div className="company-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleViewDetails(company)}
                >
                  View
                </button>
                <button 
                  className="action-btn accept-btn"
                  onClick={() => handleAccept(company.id)}
                >
                  Accept
                </button>
                <button 
                  className="action-btn reject-btn"
                  onClick={() => handleReject(company.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No companies match your filters.</p>
        )}
      </div>
    </section>
  </div>

  {selectedCompany && (
    <div className="modal-overlay">
      <div className="modal-content">
        <button 
          className="modal-close"
          onClick={() => setSelectedCompany(null)}
        >
          ×
        </button>
        <h3 className="modal-header">{selectedCompany.name}</h3>
        <div className="modal-details">
          <div>
            <p className="modal-label">Industry</p>
            <p className="modal-value">{selectedCompany.industry}</p>
          </div>
          <div>
            <p className="modal-label">Contact Email</p>
            <p className="modal-value">{selectedCompany.email}</p>
          </div>
          <div>
            <p className="modal-label">Application Status</p>
            <p className="modal-value">Pending</p>
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="action-btn reject-btn"
            onClick={() => {
              handleReject(selectedCompany.id);
              setSelectedCompany(null);
            }}
          >
            Reject
          </button>
          <button 
            className="action-btn accept-btn"
            onClick={() => {
              handleAccept(selectedCompany.id);
              setSelectedCompany(null);
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )}

  <footer className="footer">
    SCAD Administration Portal © 2025
  </footer>
</div>);
};

export default AdminHome;