import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { jsPDF } from 'jspdf';
import './AdminReportDetails.css';
import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';

import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';
const statusOptions = ['pending', 'flagged', 'rejected', 'accepted'];
const MODAL_WIDTH = 340; // should match min-width in Notifications.css


const FacultyReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);
  const [reports, setReports] = useState(() =>
    JSON.parse(sessionStorage.getItem('admin-reports')) || []
  );
  const [notifications, setNotifications] = useState(() =>
    JSON.parse(sessionStorage.getItem('admin-notifs')) || []
  );
  const [status, setStatus] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const report = reports.find(r => String(r.id) === String(id));

  useEffect(() => {
    if (report) {
      setStatus(report.status);
      setAdminComment(report.adminComment || '');
    }
  }, [report]);

  if (!report) {
    return <div className="admin-report-details-page"><p>Report not found.</p></div>;
  }

  const handleStatusChange = e => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    
    // Update report status in sessionStorage
    const updatedReports = reports.map(r =>
      String(r.id) === String(id) ? { ...r, status: newStatus } : r
    );
    setReports(updatedReports);
    sessionStorage.setItem('admin-reports', JSON.stringify(updatedReports));

    // Create notification for student
    const notif = {
      id: Date.now(),
      studentId: report.studentId,
      title: 'Internship Report Status Updated',
      body: `Your internship report "${report.title}" status has been set to: ${newStatus}.`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      type: 'report_status'
    };

    // Add admin comment if provided
    if (adminComment.trim()) {
      notif.body += `\nAdmin Comment: ${adminComment}`;
    }

    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    sessionStorage.setItem('admin-notifs', JSON.stringify(updatedNotifs));
    setSuccessMsg('Status updated and student notified!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleCommentChange = e => {
    setAdminComment(e.target.value);
    // Update report comment in sessionStorage
    const updatedReports = reports.map(r =>
      String(r.id) === String(id) ? { ...r, adminComment: e.target.value } : r
    );
    setReports(updatedReports);
    sessionStorage.setItem('admin-reports', JSON.stringify(updatedReports));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 40;
    doc.setFontSize(20).text(`${report.companyName} - Internship Report`, 40, y);
    y += 30;
    doc.setFontSize(16).text(`Student: ${report.studentName}`, 40, y); y += 20;
    doc.setFontSize(12).text(`Major: ${report.major}`, 40, y); y += 20;
    doc.text(`Supervisor: ${report.mainSupervisor}`, 40, y); y += 20;
    doc.text(`Dates: ${report.startDate} to ${report.endDate}`, 40, y); y += 20;
    doc.text(`Status: ${report.status}`, 40, y); y += 30;
    doc.setFontSize(14).text(`Title: ${report.title}`, 40, y); y += 20;
    doc.setFontSize(12).text(`Introduction: ${report.introduction}`, 40, y); y += 20;
    doc.text('Body:', 40, y); y += 16;
    doc.text(report.body, 40, y); y += 30;
    doc.save(`Internship_Report_${report.id}.pdf`);
  };

  const handleNotifClick = (e) => {
    const rect = notifBtnRef.current.getBoundingClientRect();
    let left = rect.right - MODAL_WIDTH;
    if (left < 8) left = 8; // prevent going off the left edge
    setNotifPosition({
      top: rect.bottom + 8, // 8px below the button
      left,
    });
    setShowNotifications(true);
  };

  const menuItems = (
    <>
      <Link to="/admin-home" className="sidebar-item">
        <img src={homeIcon} alt="Dashboard" className="sidebar-icon" />
        <span>Dashboard</span>
      </Link>
      <Link to="/admin/reports" className="sidebar-item">
        <img src={reportsIcon} alt="Reports" className="sidebar-icon" />
        <span>Reports</span>
      </Link>
      <Link to="/login" className="sidebar-item">
        <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
        <span>Logout</span>
      </Link>
    </>
  );

  return (
    <div className="admin-report-details-page">
      <TopBar showSearch={false} menuItems={menuItems}>
        <button className="topbar-button" onClick={()=> navigate('/faculty-home')}>
          <img src={homeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/login')}>
          <img src={logoutIcon} alt="logout" className="topbar-icon" />
          <span>Logout</span>
        </button>
      </TopBar>
      <div className="admin-report-details-container">
      <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h2>{report.title}</h2>
        <div className="admin-report-meta">
          <span><strong>Student:</strong> {report.studentName}</span>
          <span><strong>Major:</strong> {report.major}</span>
          <span><strong>Company:</strong> {report.companyName}</span>
          <span><strong>Supervisor:</strong> {report.mainSupervisor}</span>
          <span><strong>Dates:</strong> {report.startDate} - {report.endDate}</span>
        </div>
        <div className="admin-report-status-row">
          <label htmlFor="status">Status:</label>
          <select id="status" value={status} onChange={handleStatusChange}>
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button className="iv-btn primary" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        </div>
        {(status === 'flagged' || status === 'rejected') && (
          <div className="admin-comment-section">
            <label htmlFor="adminComment">Admin Comment:</label>
            <textarea
              id="adminComment"
              value={adminComment}
              onChange={handleCommentChange}
              placeholder="Add a comment explaining the status..."
              rows="3"
            />
          </div>
        )}
        {successMsg && <div className="success-msg">{successMsg}</div>}
        <div className="admin-report-section">
          <h3>Introduction</h3>
          <p>{report.introduction}</p>
        </div>
        <div className="admin-report-section">
          <h3>Body</h3>
          <p>{report.body}</p>
        </div>
        {report.evaluation && (
          <div className="admin-report-section">
            <h3>Student Evaluation</h3>
            <div className="evaluation-status">
              <span className={`recommendation-badge ${report.evaluation.recommend ? 'recommended' : 'not-recommended'}`}>
                {report.evaluation.recommend ? 'Recommended' : 'Not Recommended'}
              </span>
            </div>
            <p className="evaluation-comment">{report.evaluation.comment}</p>
          </div>
        )}
        {report.appeal && report.appeal.status !== 'none' && (
          <div className="admin-report-section">
            <h3>Appeal</h3>
            <div className="appeal-status">
              <span className={`appeal-badge ${report.appeal.status}`}>
                {report.appeal.status.charAt(0).toUpperCase() + report.appeal.status.slice(1)}
              </span>
            </div>
            <p className="appeal-message">{report.appeal.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyReportDetails; 