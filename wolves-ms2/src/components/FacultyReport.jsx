import React from 'react';
import './InternshipCard.css';
import defaultPP from '../assets/icons/default-pp.png';

const statusClass = status => {
  if (!status) return '';
  return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
};

const FacultyReport = ({ report, onClick }) => {
  return (
    <button
      type="button"
      className="internship-card-row report-card-row"
      onClick={onClick}
    >
      <div className="logo-wrapper">
        <img
          src={defaultPP}
          alt={report.studentName + ' profile'}
          className="logo-left"
        />
      </div>
      <div className="info">
        <div className="header">
          <h3 className="job-title">{report.title}</h3>
          <div className="company-name">{report.companyName}</div>
        </div>
        <div className="details">
          <span className="meta-line">Student: {report.studentName}</span>
          <span className="meta-line">Major: {report.major}</span>
          <span className="meta-line">Supervisor: {report.mainSupervisor}</span>
          <span className="meta-line">{report.startDate} - {report.endDate}</span>
        </div>
        <div className="status-row">
          <span className={`status-badge ${statusClass(report.status)}`}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </span>
        </div>
      </div>
    </button>
  );
};

export default FacultyReport; 