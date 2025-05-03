// File: src/components/InternshipCard.jsx

import React from 'react';
import './InternshipCard.css';
import logo from '../assets/scad-logo.png';

const InternshipCard = ({ title, company, location, industry, duration, paid, datePosted, early }) => {
  return (
    <button className="internship-card-row">
      <div className="logo-wrapper">
        <div className="logo-bg">
          <img src={logo} alt="Logo" className="logo-left" />
        </div>
      </div>
      <div className="info">
        <div className="header">
          <h3 className="job-title">{title}</h3>
          <div className="company-name">{company}</div>
          {early && <div className="early-badge">Be an early applicant</div>}
        </div>
        <div className="details">
          <span className="meta-line">Location: {location}</span>
          <span className="meta-line">Industry: {industry}</span>
          <span className="meta-line">Duration: {duration}</span>
          <span className="meta-line">Pay: {paid ? 'Paid' : 'Unpaid'}</span>
        </div>
        <div className="card-footer">
          <span className="date-posted">Posted: {datePosted}</span>
          <span className="view-arrow">→ View</span>
        </div>
      </div>
    </button>
  );
};

export default InternshipCard;
