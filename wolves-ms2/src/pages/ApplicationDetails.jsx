import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ProfileOverview from '../components/ProfileOverview';
import applicationsData from '../data/applications.json';
import studentsData     from '../data/students.json';
import internshipsData         from '../data/internships.json';
import './ApplicationDetails.css';

const STATUS_OPTIONS = [
  'Pending',
  'Finalized',
  'Accepted',
  'Current Intern',
  'Internship Complete',
  'Rejected'
];

const sampleDoc = require('../assets/docs/sample.pdf');

export default function ApplicationDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const application  = applicationsData.find(a => String(a.id) === id) || {};
 
  const [status, setStatus] = useState(application.status || 'Pending');
  const student = studentsData.find(s => String(s.id) === String(application.studentId)) || {};
  const internship = internshipsData.find(i => String(i.id) === String(application.internshipId)) || {};

  const jobInterests = ['UI/UX Design', 'Frontend Development', 'React'];
  const prevInterns  = ['Web Intern @ Acme Co.', 'Research Asst. @ GUC'];
  const activities   = ['Media Engineering Club', 'Robotics Team', 'AI Study Group'];

  const handleStatusChange = e => setStatus(e.target.value);

  const statusClass = status.toLowerCase().replace(/\s+/g,'-');

  return (
    <div className="ad-dashboard">
        <TopBar showSearch={false}>
        <button
        className="topbar-button ad-back"
        onClick={() => navigate(-1)}
        >
        <span className="chevron-left" />
        <span className="topbar-label">Back</span>
        </button>
      </TopBar>

      <div className="ad-main">
        <aside className="ad-sidebar">
          <ProfileOverview
            name={student.name}
            email={student.email}
            major={student.major}
            status={student.status}
            completedMonths={student.completedMonths}
            totalMonths={3}
            hideCycle={true}
            profileUrl={`/student-profile`}
            profilePicture={student.profilePicture}
          />
        </aside>

        <section className="ad-content">
          <div className="ad-card">
          <h2 className="ad-title">
            Applicant Overview — {internship.title} @ {internship.company}
            </h2>

            <div className="ad-section">
              <h3>Contact & Major</h3>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Major:</strong> {student.major}</p>
            </div>

            <div className="ad-section">
              <h3>Job Interests</h3>
              <ul>
                {jobInterests.map((i,idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>

            <div className="ad-section">
              <h3>Previous Internships</h3>
              <ul>
                {prevInterns.map((i,idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>

            <div className="ad-section">
              <h3>College Activities</h3>
              <ul>
                {activities.map((a,idx) => <li key={idx}>{a}</li>)}
              </ul>
            </div>

            <div className="ad-section">
              <h3>Documents</h3>
              <ul className="ad-docs">
                <li><a href={sampleDoc} download>Download CV</a></li>
                <li><a href={sampleDoc} download>Download Cover Letter</a></li>
                <li><a href={sampleDoc} download>Download Certificates</a></li>
              </ul>
            </div>

            <div className="ad-section status-block">
              <h3>Status</h3>
              <select
                className={`ad-status-select ${statusClass}`}
                value={status}
                onChange={handleStatusChange}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
