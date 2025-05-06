// File: src/components/InternshipCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InternshipCard.css';

const InternshipCard = ({
  id,
  title,
  company,
  location,
  industry,
  duration,
  paid,
  salary,
  date,
  early,
  logo,       
}) => {
  const navigate = useNavigate();

  const logoSrc = require(`../assets/companies/${logo}`);

  const handleClick = () => {
    navigate(`/internship/${id}`);
  };

  return (
    <button
      type="button"
      className="internship-card-row"
      onClick={handleClick}
    >
      <div className="logo-wrapper">
        <img
          src={logoSrc}
          alt={`${company} logo`}
          className="logo-left"
        />
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
          {paid && salary && (
            <span className="meta-line">Salary: {salary}</span>
          )}
        </div>
      </div>
    </button>
  );
};

export default InternshipCard;
