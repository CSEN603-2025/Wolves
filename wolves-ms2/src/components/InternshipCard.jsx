import React from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  status,
  hideStatus =false,
  viewCount=false,
  evaluation,
  count,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const logoSrc = require(`../assets/companies/${logo}`);
  const srcLocation = useLocation();
  const { user } = useAuth();

  const handleClick = (e) => {
    // Don't navigate if clicking edit/delete buttons
    if (e.target.closest('.card-actions')) {
      return;
    }

    if (evaluation === 'Internship Complete') {
      navigate(
        `/student-internships/${id}`, 
        { state: { from: srcLocation.pathname } }
      );
    } else {
      if (user?.role === 'student') {
        navigate(
          `/student-internships/${id}`,
          { state: { from: srcLocation.pathname } }
        );
      } else if (user?.role === 'admin') {
        navigate(
          `/admin-home/internships/${id}`,
          { state: { from: srcLocation.pathname } }
        );
      } else if (user?.role === 'company') {
        navigate(
          `/company-posts/${id}`,
          { state: { from: srcLocation.pathname } }
        );
      }
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  // build a CSS‐friendly class from status text
  const statusClass = status.toLowerCase().replace(/\s+/g, '-');

  // Check if this internship should show edit/delete buttons
  const showEditDelete = [1, 2, 3, 4].includes(Number(id));

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
          {viewCount && (<span className={`status-badge status-pending`}>Applications: {count}</span>)}
        </div>

        {/* new, full-width status row */}
        {!hideStatus && (<div className="status-row">
          <span className={`status-badge status-${statusClass}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>)}
      </div>
    </button>
  );
};

export default InternshipCard;
