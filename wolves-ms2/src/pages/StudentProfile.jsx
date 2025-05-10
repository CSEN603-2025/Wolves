// File: src/pages/StudentProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentProfile.css';
import TopBar from '../components/TopBar';
import ProfileOverview from '../components/ProfileOverview';
import { useAuth } from '../context/AuthContext';

import internshipIcon from '../assets/icons/internships-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon from '../assets/icons/eval-icon.png';
import notifIcon from '../assets/icons/notif-icon.png';
import profileIcon from '../assets/icons/profile-icon.png';
import internshipGuide from '../assets/videos/internship-guide.mp4';

const companyLogos = {
  Microsoft: require('../assets/companies/microsoft-logo.png'),
  PwC: require('../assets/companies/pwc-logo.png'),
  Deloitte: require('../assets/companies/deloitte-logo.png'),
};

const majorsList = [
  { name: 'MET', semesters: [1,2,3,4,5,6,7,8,9,10] },
  { name: 'IET', semesters: [1,2,3,4,5,6,7,8,9,10] },
  { name: 'Mechatronics', semesters: [1,2,3,4,5,6,7,8,9,10] },
  { name: 'Management', semesters: [1,2,3,4,5,6,7,8] },
  { name: 'BI', semesters: [1,2,3,4,5,6,7,8] },
  { name: 'Applied Arts', semesters: [1,2,3,4,5,6,7,8,9,10] }
];

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Load profile data from sessionStorage or initialize with defaults
  const [jobInterests, setJobInterests] = useState(() => 
    sessionStorage.getItem(`profile-${user.id}-interests`) || ''
  );
  const [prevInternships, setPrevInternships] = useState(() => {
    const saved = sessionStorage.getItem(`profile-${user.id}-internships`);
    return saved ? JSON.parse(saved) : [{ company:'', duration:'', responsibilities:'' }];
  });
  const [activities, setActivities] = useState(() => {
    const saved = sessionStorage.getItem(`profile-${user.id}-activities`);
    return saved ? JSON.parse(saved) : [''];
  });
  const [selectedMajor, setSelectedMajor] = useState(() => 
    sessionStorage.getItem(`profile-${user.id}-major`) || user.major
  );
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(() => 
    parseInt(sessionStorage.getItem(`profile-${user.id}-semester`)) || 1
  );
  const [formMessage, setFormMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  // Pro features state
  const [companiesViewed] = useState(['Microsoft','PwC','Deloitte']);
  const [assessments, setAssessments] = useState(() => {
    const saved = sessionStorage.getItem(`profile-${user.id}-assessments`);
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'React Basics',
        score: null,
        isPublic: false,
        url: 'https://www.google.com/'
      },
      {
        id: 2,
        name: 'JavaScript Fundamentals',
        score: null,
        isPublic: false,
        url: 'https://www.google.com/'
      }
    ];
  });

  // Update semester options when major changes
  useEffect(() => {
    const m = majorsList.find(m => m.name === selectedMajor);
    if (m) {
      setSemesterOptions(m.semesters);
      setSelectedSemester(m.semesters[0]);
    }
  }, [selectedMajor]);

  // Save data to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(`profile-${user.id}-interests`, jobInterests);
  }, [jobInterests, user.id]);

  useEffect(() => {
    sessionStorage.setItem(`profile-${user.id}-internships`, JSON.stringify(prevInternships));
  }, [prevInternships, user.id]);

  useEffect(() => {
    sessionStorage.setItem(`profile-${user.id}-activities`, JSON.stringify(activities));
  }, [activities, user.id]);

  useEffect(() => {
    sessionStorage.setItem(`profile-${user.id}-major`, selectedMajor);
  }, [selectedMajor, user.id]);

  useEffect(() => {
    sessionStorage.setItem(`profile-${user.id}-semester`, selectedSemester.toString());
  }, [selectedSemester, user.id]);

  useEffect(() => {
    sessionStorage.setItem(`profile-${user.id}-assessments`, JSON.stringify(assessments));
  }, [assessments, user.id]);

  // Handlers for dynamic lists
  const handleAddInternship = () => setPrevInternships([...prevInternships, { company:'', duration:'', responsibilities:'' }]);
  const handleInternshipChange = (i, f, v) => {
    const a = [...prevInternships];
    a[i][f] = v;
    setPrevInternships(a);
  };
  const handleRemoveInternship = i => setPrevInternships(prev => prev.filter((_, j) => j !== i));

  const handleAddActivity = () => setActivities([...activities, '']);
  const handleActivityChange = (i, v) => {
    const a = [...activities];
    a[i] = v;
    setActivities(a);
  };
  const handleRemoveActivity = i => setActivities(prev => prev.filter((_, j) => j !== i));

  // Save profile
  const handleSaveProfile = e => {
    e.preventDefault();
    setSaving(true);
    setFormMessage(null);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setFormMessage({ type: 'success', text: 'Profile updated successfully.' });
    }, 1200);
  };

  // Assessment handlers
  const handleTakeAssessment = id => {
    const ass = assessments.find(a => a.id === id);
    if (ass?.url) window.open(ass.url, '_blank', 'noopener');
    const grade = Math.floor(Math.random() * 101);
    setAssessments(as => as.map(a => a.id === id ? {...a, score: grade} : a));
  };

  const handleToggleVisibility = id => {
    setAssessments(as =>
      as.map(a => a.id === id ? {...a, isPublic: !a.isPublic} : a)
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form className="profile-form" onSubmit={handleSaveProfile}>
            <div className="form-section">
              <h3>Job Interests</h3>
              <textarea
                value={jobInterests}
                onChange={e => setJobInterests(e.target.value)}
                placeholder="e.g. Front-end development, Data Analysis…"
              />
            </div>

            <div className="form-section">
              <h3>Previous Internships &amp; Part-time Jobs</h3>
              {prevInternships.map((it, i) => (
                <div key={i} className="entry-card">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={it.company}
                    onChange={e => handleInternshipChange(i, 'company', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 3 months)"
                    value={it.duration}
                    onChange={e => handleInternshipChange(i, 'duration', e.target.value)}
                  />
                  <textarea
                    placeholder="Responsibilities"
                    value={it.responsibilities}
                    onChange={e => handleInternshipChange(i, 'responsibilities', e.target.value)}
                  />
                  {prevInternships.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveInternship(i)}
                    >×</button>
                  )}
                </div>
              ))}
              <button type="button" className="add-btn" onClick={handleAddInternship}>
                + Add Position
              </button>
            </div>

            <div className="form-section">
              <h3>College Activities</h3>
              {activities.map((act, i) => (
                <div key={i} className="entry-card">
                  <input
                    type="text"
                    placeholder="e.g. IEEE Chapter Member"
                    value={act}
                    onChange={e => handleActivityChange(i, e.target.value)}
                  />
                  {activities.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveActivity(i)}
                    >×</button>
                  )}
                </div>
              ))}
              <button type="button" className="add-btn" onClick={handleAddActivity}>
                + Add Activity
              </button>
            </div>

            <div className="form-section">
              <h3>Major &amp; Semester</h3>
              <div className="select-group">
                <select
                  value={selectedMajor}
                  onChange={e => setSelectedMajor(e.target.value)}
                >
                  {majorsList.map(m => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
                <select
                  value={selectedSemester}
                  onChange={e => setSelectedSemester(+e.target.value)}
                >
                  {semesterOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>What counts as an internship?</h3>
              <div className="video-container">
                <video
                  controls
                  src={internshipGuide}
                  className="guide-video"
                >
                  Your browser doesn't support HTML5 video.
                </video>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
            {formMessage && (
              <div className={`form-message ${formMessage.type}`}>
                {formMessage.text}
              </div>
            )}
          </form>
        );

      case 'assessments':
        return (
          <div className="assessments-section">
            <h3>Online Assessments</h3>
            {assessments.map(a => (
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
                  {a.score === null ? (
                    <button onClick={() => handleTakeAssessment(a.id)}>
                      Take Assessment
                    </button>
                  ) : (
                    <select
                      value={a.isPublic ? 'public' : 'private'}
                      onChange={() => handleToggleVisibility(a.id)}
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'views':
        return (
          <div className="views-section">
            <h3>Who's Viewed My Profile</h3>
            <div className="companies-grid">
              {companiesViewed.map(c => (
                <div key={c} className="company-card">
                  <img
                    src={companyLogos[c]}
                    alt={c}
                    className="company-logo"
                  />
                  <span className="company-name">{c}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <TopBar showSearch={false}>
        <button className="topbar-button" onClick={() => navigate('/all-internships')}>
          <img src={internshipIcon} alt="Internships" className="topbar-icon"/><span>Internships</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/student-applications')}>
          <img src={applicationIcon} alt="Applications" className="topbar-icon"/><span>Applications</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/evaluations')}>
          <img src={evalIcon} alt="Evaluations" className="topbar-icon"/><span>Evaluations</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/notifications')}>
          <img src={notifIcon} alt="Notifications" className="topbar-icon"/><span>Notifications</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/student-profile')}>
          <img src={profileIcon} alt="Profile" className="topbar-icon"/><span>Profile</span>
        </button>
      </TopBar>

      <div className="profile-content">
        <aside className="profile-sidebar">
          <ProfileOverview
            name={user.name}
            email={user.email}
            major={selectedMajor}
            status={user.status}
            completedMonths={user.completedMonths}
            totalMonths={3}
            profileUrl={user.profileUrl}
            profilePicture={user.profilePicture}
          >
            <button className="po-btn"><img src={notifIcon} alt=""/>Notifications</button>
            <button className="po-btn"><img src={applicationIcon} alt=""/>Applications</button>
            <button className="po-btn"><img src={evalIcon} alt=""/>Evaluations</button>
          </ProfileOverview>
        </aside>

        <main className="profile-main">
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            {user.status === 'Pro' && (
              <>
                <button
                  className={`tab-btn ${activeTab === 'assessments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('assessments')}
                >
                  Assessments
                </button>
                <button
                  className={`tab-btn ${activeTab === 'views' ? 'active' : ''}`}
                  onClick={() => setActiveTab('views')}
                >
                  Profile Views
                </button>
              </>
            )}
          </div>

          <div className="tab-content">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;
