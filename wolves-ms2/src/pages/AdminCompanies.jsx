import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import CompanyCard from '../components/CompanyCard';
import Filter from '../components/Filter';
import SearchBar from '../components/SearchBar';
import './AdminCompanies.css';

const CARD_CONTAINER_WIDTH = 1000;

const AdminCompanies = () => {
  const [tab, setTab] = useState('applying');
  const [applying, setApplying] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const navigate = useNavigate();

  // Load data from sessionStorage or initialize from JSON files
  useEffect(() => {
    const loadData = async () => {
      let applyingData = JSON.parse(sessionStorage.getItem('admin-applying-companies'));
      let registeredData = JSON.parse(sessionStorage.getItem('admin-companies'));

      if (!applyingData) {
        const module = await import('../data/applying-companies.json');
        applyingData = module.default;
        sessionStorage.setItem('admin-applying-companies', JSON.stringify(applyingData));
      }

      if (!registeredData) {
        const module = await import('../data/companies.json');
        registeredData = module.default;
        sessionStorage.setItem('admin-companies', JSON.stringify(registeredData));
      }

      setApplying(applyingData);
      setRegistered(registeredData);
    };

    loadData();
  }, []);

  // Listen for changes in sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const applyingData = JSON.parse(sessionStorage.getItem('admin-applying-companies')) || [];
      const registeredData = JSON.parse(sessionStorage.getItem('admin-companies')) || [];
      setApplying(applyingData);
      setRegistered(registeredData);
    };

    // Listen for both storage events and custom events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('companies-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('companies-updated', handleStorageChange);
    };
  }, []);

  const filteredApplying = applying.filter(c =>
    (!search || c.name.toLowerCase().includes(search.toLowerCase())) &&
    (!industry || c.industry === industry)
  );
  const industries = Array.from(new Set(applying.map(c => c.industry)));

  const handleSearch = (name) => {
    setSearch(name);
  };

  return (
    <div className="admin-companies-page">
      <TopBar showSearch={false} />
      <main className="admin-companies-main">
        <h1 className="admin-companies-title">Companies</h1>
        <div className="admin-companies-tabs">
          <button
            className={`iv-btn${tab === 'applying' ? ' primary' : ' secondary'}`}
            onClick={() => setTab('applying')}
          >
            Applying Companies
          </button>
          <button
            className={`iv-btn${tab === 'registered' ? ' primary' : ' secondary'}`}
            onClick={() => setTab('registered')}
          >
            Registered Companies
          </button>
        </div>
        {tab === 'applying' && (
          <section className="admin-companies-section">
            <div className="admin-companies-filters">
              <div className="admin-companies-search">
                <SearchBar onSearch={(name) => handleSearch(name)} companySearch={true}/>
              </div>
              <Filter title="Industry" value={industry} onChange={e => setIndustry(e.target.value)}>
                <option value="">All</option>
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </Filter>
            </div>
            {filteredApplying.length ? filteredApplying.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={() => navigate(`/admin-home/companies/${company.id}`)}
              />
            )) : <div className="admin-companies-no-results">No applying companies found.</div>}
          </section>
        )}
        {tab === 'registered' && (
          <section className="admin-companies-section">
            {registered.length ? registered.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={null}
              />
            )) : <div className="admin-companies-no-results">No registered companies found.</div>}
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminCompanies; 