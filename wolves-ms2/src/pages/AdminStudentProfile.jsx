import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import './AdminStudentProfile.css';
import TopBar from '../components/TopBar';
import ProfileOverview from '../components/ProfileOverview';
import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';

import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';

const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const majorsList = [
  { name: 'MET', semesters: [1,2,3,4,5,6,7,8,9,10] },
  { name: 'IET', semesters: [1,2,3,4,5,6,7,8,9,10] },
  { name: 'Mechatronics', semesters: [1,2,3,4,5,6,7,8,9,10] },
  { name: 'Management', semesters: [1,2,3,4,5,6,7,8] },
  { name: 'BI', semesters: [1,2,3,4,5,6,7,8] },
  { name: 'Applied Arts', semesters: [1,2,3,4,5,6,7,8,9,10] }
];

// Mock data for non-editable students
const MOCK_PROFILE = {
  jobInterests: 'Interested in UI/UX, Data Science, and Project Management.',
  prevInternships: [
    { company: 'Mock Company A', duration: '2 months', responsibilities: 'Assisted with design.' },
    { company: 'Mock Company B', duration: '1 month', responsibilities: 'Worked on data entry.' }
  ],
  activities: ['Chess Club Member', 'Volunteer at Local NGO'],
  major: 'MET',
  semester: 5,
  assessments: [
    { id: 1, name: 'React Basics', score: 85, isPublic: true },
    { id: 2, name: 'JavaScript Fundamentals', score: 90, isPublic: false }
  ]
};

const AdminStudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [profileData, setProfileData] = useState(MOCK_PROFILE);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);

  useEffect(() => {
    // Load students from students.json and merge with CRUD/sessionStorage
    const loadStudent = async () => {
      const base = await import('../data/students.json').then(m => m.default);
      const crud = JSON.parse(sessionStorage.getItem('admin-students') || '[]');
      const merged = base.map(stu => {
        const updated = crud.find(s => String(s.id) === String(stu.id));
        return { ...stu, ...(updated || {}) };
      });
      const found = merged.find(s => String(s.id) === String(id));
      setStudent(found || null);
      if (found) {
        const m = majorsList.find(m => m.name === found.major);
        if (m) setSemesterOptions(m.semesters);
        // For id 1 or 2, use CRUD/sessionStorage for profile data
        if (String(found.id) === '1' || String(found.id) === '2') {
          setProfileData({
            jobInterests: sessionStorage.getItem(`profile-${found.id}-interests`) || '',
            prevInternships: JSON.parse(sessionStorage.getItem(`profile-${found.id}-internships`) || '[]'),
            activities: JSON.parse(sessionStorage.getItem(`profile-${found.id}-activities`) || '[]'),
            major: sessionStorage.getItem(`profile-${found.id}-major`) || found.major,
            semester: parseInt(sessionStorage.getItem(`profile-${found.id}-semester`)) || found.semester,
            assessments: JSON.parse(sessionStorage.getItem(`profile-${found.id}-assessments`) || '[]'),
          });
        } else {
          setProfileData(MOCK_PROFILE);
        }
      }
    };
    loadStudent();
  }, [id]);

  if (!student) {
    return <div className="admin-student-profile-page"><TopBar /><div className="not-found">Student not found.</div></div>;
  }

  const isPro = student.completedMonths >= 3;
  // Companies viewed (mocked for now)
  // const companiesViewed = ['Microsoft','PwC','Deloitte'];
  const assessments = profileData.assessments || [];

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
      <Link to="/admin-home/companies" className="sidebar-item">
        <img src={companyIcon} alt="Companies" className="sidebar-icon" />
        <span>Companies</span>
      </Link>
      <Link to="/admin-home/internships" className="sidebar-item">
        <img src={internshipIcon} alt="Internships" className="sidebar-icon" />
        <span>Internships</span>
      </Link>
      <Link to="/admin/students" className="sidebar-item">
        <img src={studentIcon} alt="Students" className="sidebar-icon" />
        <span>Students</span>
      </Link>
      <Link to="/admin/workshops" className="sidebar-item">
        <img src={workshopIcon} alt="Workshops" className="sidebar-icon" />
        <span>Workshops</span>
      </Link>
      <Link to="/admin/reports" className="sidebar-item">
        <img src={reportsIcon} alt="Reports" className="sidebar-icon" />
        <span>Reports</span>
      </Link>
      <Link to="/admin-appointments" className="sidebar-item">
        <img src={appointmentIcon} alt="apointments" className="sidebar-icon" />
        <span>Appointments</span>
      </Link>
      <Link to="/admin/notifications" className="sidebar-item">
        <img src={notificationIcon} alt="Notifications" className="sidebar-icon" />
        <span>Notifications</span>
      </Link>
      <Link to="/login" className="sidebar-item">
        <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
        <span>Logout</span>
      </Link>
    </>
  );

  return (
    <div className="admin-student-profile-page">
      <TopBar showSearch={false} menuItems={menuItems}>
      <button
          className="topbar-button"
          ref={notifBtnRef}
          onClick={handleNotifClick}
        >
          <img src={notificationIcon} alt="Notifications" className="topbar-icon" />
          <span>Notifications</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/admin-home')}>
          <img src={homeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/login')}>
          <img src={logoutIcon} alt="logout" className="topbar-icon" />
          <span>Logout</span>
        </button>
      </TopBar>
      <div className="profile-content">
        <aside className="profile-sidebar">
          <ProfileOverview
            name={student.name}
            email={student.email}
            major={student.major}
            status={student.status}
            completedMonths={student.completedMonths}
            totalMonths={3}
            profileUrl={student.profileUrl}
            profilePicture={student.profilePicture}
          />
        </aside>
        <main className="profile-main">
          <button type="button" className="admin-back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
          <div className="tab-content">
            <form className="profile-form" autoComplete="off">
              <div className="form-section">
                <h3>Job Interests</h3>
                <textarea value={profileData.jobInterests || ''} readOnly tabIndex={-1} />
              </div>
              <div className="form-section">
                <h3>Previous Internships &amp; Part-time Jobs</h3>
                {(profileData.prevInternships || []).map((it, i) => (
                  <div key={i} className="entry-card">
                    <input type="text" value={it.company} readOnly tabIndex={-1} />
                    <input type="text" value={it.duration} readOnly tabIndex={-1} />
                    <textarea value={it.responsibilities} readOnly tabIndex={-1} />
                  </div>
                ))}
              </div>
              <div className="form-section">
                <h3>College Activities</h3>
                {(profileData.activities || []).map((act, i) => (
                  <div key={i} className="entry-card">
                    <input type="text" value={act} readOnly tabIndex={-1} />
                  </div>
                ))}
              </div>
              <div className="form-section">
                <h3>Major &amp; Semester</h3>
                <div className="select-group">
                  <select value={student.major} disabled tabIndex={-1}>
                    {majorsList.map(m => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  <select value={profileData.semester || student.semester} disabled tabIndex={-1}>
                    {semesterOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
            {isPro && (
              <div className="assessments-section">
                <h3>Online Assessments</h3>
                {assessments.filter(a => a.isPublic).map(a => (
                  <div key={a.id} className="assessment-card">
                    <div className="assessment-info">
                      <span className="assessment-name">{a.name}</span>
                      {a.score !== null && (
                        <span className="assessment-score">
                          Grade: {a.score}/100
                        </span>
                      )}
                    </div>
                    <div className="assessment-actions">
                      <span className="assessment-status">Public</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminStudentProfile; 