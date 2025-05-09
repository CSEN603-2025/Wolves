import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import './CompanyDetails.css';

const DEFAULT_DOC = require('../assets/docs/sample.pdf');

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [status, setStatus] = useState('applying');
  const [doc, setDoc] = useState(DEFAULT_DOC);

  useEffect(() => {
    const findCompany = () => {
      const applying = JSON.parse(sessionStorage.getItem('admin-applying-companies')) || [];
      const registered = JSON.parse(sessionStorage.getItem('admin-companies')) || [];
      
      let found = applying.find(c => String(c.id) === id);
      if (found) {
        setCompany(found);
        setStatus('applying');
        setDoc(found.document ? require(`../assets/docs/${found.document}`) : DEFAULT_DOC);
        return;
      }
      
      found = registered.find(c => String(c.id) === id);
      if (found) {
        setCompany(found);
        setStatus('registered');
        setDoc(DEFAULT_DOC);
      }
    };

    findCompany();
  }, [id]);

  const handleAccept = () => {
    const applying = JSON.parse(sessionStorage.getItem('admin-applying-companies')) || [];
    const registered = JSON.parse(sessionStorage.getItem('admin-companies')) || [];
    
    const found = applying.find(c => String(c.id) === id);
    if (found) {
      // Remove from applying
      const newApplying = applying.filter(c => String(c.id) !== id);
      // Add to registered
      const newRegistered = [...registered, found];
      
      // Update sessionStorage
      sessionStorage.setItem('admin-applying-companies', JSON.stringify(newApplying));
      sessionStorage.setItem('admin-companies', JSON.stringify(newRegistered));
      
      // Dispatch custom event for immediate update
      window.dispatchEvent(new Event('companies-updated'));
    }
    navigate('/admin-home/companies');
  };

  const handleReject = () => {
    const applying = JSON.parse(sessionStorage.getItem('admin-applying-companies')) || [];
    const newApplying = applying.filter(c => String(c.id) !== id);
    
    // Update sessionStorage
    sessionStorage.setItem('admin-applying-companies', JSON.stringify(newApplying));
    
    // Dispatch custom event for immediate update
    window.dispatchEvent(new Event('companies-updated'));
    navigate('/admin-home/companies');
  };

  if (!company) return <div className="company-details-page"><TopBar showSearch={false} /><main className="company-details-main"><h1>Loading…</h1></main></div>;

  return (
    <div className="company-details-page">
      <TopBar showSearch={false} />
      <main className="company-details-main">
        <div className="company-details-card">
        <button
          className="company-details-back-btn"
          onClick={() => navigate(-1)}
        >
        Back
        </button>
          <div className="company-details-header">
            <img 
              src={require(`../assets/companies/${company.logo || 'valeo-logo.png'}`)} 
              alt={company.name} 
              className="company-details-logo" 
            />
            <div className="company-details-info">
              <h2 className="company-details-name">{company.name}</h2>
            </div>
          </div>
          <div className="company-details-content">
          <div className="company-details-meta">
                <span className="company-details-meta-label">Email:</span> {capitalize(company.email)}
              </div>
            <div className="company-details-meta">
                <span className="company-details-meta-label">Industry:</span> {capitalize(company.industry)}
              </div>
              <div className="company-details-meta">
                <span className="company-details-meta-label">Size:</span> {capitalize(company.size)}
              </div>
          </div>
          <div className="company-details-document">
            <span className="company-details-label">Verification Document:</span>
            <div className="company-details-document-container">
            <a 
              href={doc} 
              download 
              target="_blank" 
              rel="noopener noreferrer" 
              className="iv-btn secondary company-details-download-btn"
            >
              Download PDF
            </a>
            </div>
          </div>
          {status === 'applying' && (
            <div className="company-details-actions">
              <button className="iv-btn primary company-details-action-btn" onClick={handleAccept}>
                Accept
              </button>
              <button className="iv-btn danger company-details-action-btn" onClick={handleReject}>
                Reject
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyDetails; 