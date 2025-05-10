import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminStudentProfile.css';
import TopBar from '../components/TopBar';
import ProfileOverview from '../components/ProfileOverview';

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

  return (
    <div className="admin-student-profile-page">
      <TopBar showSearch={false} />
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