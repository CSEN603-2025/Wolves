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

  const handleClick = () => {
    if (basePath === 'company-interns') {
      // For interns, navigate to intern details
      navigate(`/company-interns/${id}`);
    } else {
      // For applications, navigate to application details
      navigate(`/${basePath}/${id}`);
    }
  };

  return (
    <button
      type="button"
      className="appov-card-row"
      onClick={handleClick}
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
