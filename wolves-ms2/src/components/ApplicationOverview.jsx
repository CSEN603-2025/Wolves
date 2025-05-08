// src/components/ApplicationOverview.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ApplicationOverview.css';

const ApplicationOverview = ({
  id,
  studentName,
  internshipTitle,
  status,
  basePath = 'company-applications' // default for the apps page
}) => {
  const navigate = useNavigate();
  const statusKey = status.toLowerCase().replace(/\s+/g, '-');

  return (
    <button
      type="button"
      className="appov-card-row"
      onClick={() => navigate(`/${basePath}/${id}`)}
    >
      <div className="appov-info">
        <h3 className="appov-student">{studentName}</h3>
        <p className="appov-intern">{internshipTitle}</p>
      </div>
      <span className={`appov-badge appov-${statusKey}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </button>
  );
};

export default ApplicationOverview;
