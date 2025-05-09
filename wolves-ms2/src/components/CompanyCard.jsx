import React from 'react';
import './CompanyCard.css';

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

const CompanyCard = ({ company, onClick }) => {
  const sizeLabel = company.size ? capitalize(company.size) : '';
  return (
    <div
      className="company-card glassy clickable"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick && onClick()}
      role="button"
      style={{ cursor: 'pointer' }}
    >
      <div className="company-card-header">
        <img src={require(`../assets/companies/${company.logo || 'valeo-logo.png'}`)} alt={company.name} className="company-logo" />
        <div className="company-info">
          <h3 className="company-name">{company.name}</h3>
          <div className="company-industry">{company.industry}</div>
        </div>
        {sizeLabel && <div className={`company-size-label size-${company.size}`}>{sizeLabel}</div>}
      </div>
      <div className="company-card-meta">
        <span className="company-email">{company.email}</span>
      </div>
    </div>
  );
};

export default CompanyCard; 