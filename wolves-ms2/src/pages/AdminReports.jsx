import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportCard from '../components/ReportCard';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import reportsData from '../data/reports.json';
import './AdminReports.css';

const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))];

const AdminReports = () => {
  // Turning Point 1: session-persisted reports
  const [reports, setReports] = useState(() =>
    JSON.parse(sessionStorage.getItem('admin-reports')) || reportsData
  );
  useEffect(() => {
    sessionStorage.setItem('admin-reports', JSON.stringify(reports));
  }, [reports]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [majorFilter, setMajorFilter] = useState('all');
  const navigate = useNavigate();

  const majors = getUnique(reports, 'major');
  const statuses = getUnique(reports, 'status');

  const filteredReports = reports.filter(r =>
    (statusFilter === 'all' || r.status === statusFilter) &&
    (majorFilter === 'all' || r.major === majorFilter)
  );

  return (
    <div className="admin-reports-page">
      <TopBar showSearch={true} />
      <div className="admin-reports-content">
        <h1 className="admin-reports-title">Internship Reports</h1>
        <div className="admin-reports-filters-row">
          <Filter
            title="Status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </Filter>
          <Filter
            title="Major"
            value={majorFilter}
            onChange={e => setMajorFilter(e.target.value)}
          >
            <option value="all">All Majors</option>
            {majors.map(m => <option key={m} value={m}>{m}</option>)}
          </Filter>
        </div>
        <div className="admin-reports-list">
          {filteredReports.length ? filteredReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => navigate(`/admin/reports/${report.id}`)}
            />
          )) : <div className="no-reports">No reports found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminReports; 