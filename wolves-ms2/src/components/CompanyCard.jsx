import React from 'react';
import './CompanyCard.css';

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

const CompanyCard = ({ company, onClick }) => {
  const sizeLabel = company.size ? capitalize(company.size) : '';
  return (
    <div
      className="ccard-card glassy clickable"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick && onClick()}
      role="button"
      style={{ cursor: 'pointer' }}
    >
      <div className="ccard-header">
        <img src={require(`../assets/companies/${company.logo || 'valeo-logo.png'}`)} alt={company.name} className="ccard-logo" />
        <div className="ccard-info">
          <h3 className="ccard-name">{company.name}</h3>
          <div className="ccard-industry">{company.industry}</div>
        </div>
        {sizeLabel && <div className={`ccard-size-label ccard-size-${company.size}`}>{sizeLabel}</div>}
      </div>
      <div className="ccard-meta">
        <span className="ccard-email">{company.email}</span>
      </div>
    </div>
  );
};

export default CompanyCard; 