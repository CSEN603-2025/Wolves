import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import './StudentReportDetails.css';

const StudentReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState(() =>
    JSON.parse(sessionStorage.getItem('admin-reports')) || []
  );
  const [appealMessage, setAppealMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const report = reports.find(r => String(r.id) === String(id));

  useEffect(() => {
    if (report?.appeal?.message) {
      setAppealMessage(report.appeal.message);
    }
  }, [report]);

  if (!report) {
    return <div className="student-report-details-page"><p>Report not found.</p></div>;
  }

  const handleAppealSubmit = () => {
    if (!appealMessage.trim()) {
      setSuccessMsg('Please enter an appeal message.');
      return;
    }

    const updatedReports = reports.map(r =>
      String(r.id) === String(id)
        ? {
            ...r,
            appeal: {
              message: appealMessage,
              status: 'pending'
            }
          }
        : r
    );

    setReports(updatedReports);
    sessionStorage.setItem('admin-reports', JSON.stringify(updatedReports));

    // Create notification for admin
    const adminNotifs = JSON.parse(sessionStorage.getItem('admin-notifs')) || [];
    const notif = {
      id: Date.now(),
      title: 'New Report Appeal',
      body: `Student ${report.studentName} has submitted an appeal for their report "${report.title}".`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      type: 'report_appeal'
    };
    sessionStorage.setItem('admin-notifs', JSON.stringify([notif, ...adminNotifs]));

    setSuccessMsg('Appeal submitted successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  return (
    <div className="student-report-details-page">
      <TopBar showSearch={false}>
        <button className="iv-btn secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </TopBar>
      <div className="student-report-details-container">
        <h2>{report.title}</h2>
        <div className="student-report-meta">
          <span><strong>Company:</strong> {report.companyName}</span>
          <span><strong>Supervisor:</strong> {report.mainSupervisor}</span>
          <span><strong>Dates:</strong> {report.startDate} - {report.endDate}</span>
          <span className={`status-badge ${report.status}`}>{report.status}</span>
        </div>

        {successMsg && <div className="success-msg">{successMsg}</div>}

        {(report.status === 'flagged' || report.status === 'rejected') && report.adminComment && (
          <div className="admin-comment-section">
            <h3>Admin Comment</h3>
            <p>{report.adminComment}</p>
          </div>
        )}

        <div className="report-section">
          <h3>Introduction</h3>
          <p>{report.introduction}</p>
        </div>
        <div className="report-section">
          <h3>Body</h3>
          <p>{report.body}</p>
        </div>

        {(report.status === 'flagged' || report.status === 'rejected') && (
          <div className="appeal-section">
            <h3>Appeal</h3>
            {report.appeal && report.appeal.status !== 'none' ? (
              <div className="appeal-status">
                <span className={`appeal-badge ${report.appeal.status}`}>
                  {report.appeal.status.charAt(0).toUpperCase() + report.appeal.status.slice(1)}
                </span>
                <p className="appeal-message">{report.appeal.message}</p>
              </div>
            ) : (
              <>
                <textarea
                  value={appealMessage}
                  onChange={e => setAppealMessage(e.target.value)}
                  placeholder="Enter your appeal message..."
                  rows="4"
                />
                <button className="iv-btn primary" onClick={handleAppealSubmit}>
                  Submit Appeal
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentReportDetails; 