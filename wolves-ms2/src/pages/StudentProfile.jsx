// File: src/pages/StudentProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate }           from 'react-router-dom';
import './StudentProfile.css';
import TopBar                    from '../components/TopBar';
import ProfileOverview           from '../components/ProfileOverview';
import { useAuth }               from '../context/AuthContext';

import internshipIcon  from '../assets/icons/internships-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon        from '../assets/icons/eval-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import profileIcon     from '../assets/icons/profile-icon.png';
// placeholder video
import internshipGuide from '../assets/videos/internship-guide.mp4';

// map company names → their logo files
const companyLogos = {
    Microsoft: require('../assets/companies/microsoft-logo.png'),
    PwC:    require('../assets/companies/pwc-logo.png'),
    Deloitte:  require('../assets/companies/deloitte-logo.png'),
    };

const majorsList = [
  { name: 'MET', semesters: [1,2,3,4,5,6] },
  { name: 'Management', semesters: [1,2,3,4,5,6,7,8] },
  { name: 'Media Engineering', semesters: [1,2,3,4,5,6] },
  { name: 'Computer Science', semesters: [1,2,3,4,5,6,7,8] }
];

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // PERSONAL INFO
  const [jobInterests, setJobInterests]       = useState('');
  const [prevInternships, setPrevInternships] = useState([{ company:'', duration:'', responsibilities:'' }]);
  const [activities, setActivities]           = useState(['']);
  const [selectedMajor, setSelectedMajor]     = useState(user.major);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [formMessage, setFormMessage]         = useState(null);
  const [saving, setSaving]                   = useState(false);

  // PRO FEATURES
  const [companiesViewed] = useState(['Microsoft','PwC','Deloitte']);
  const [assessments, setAssessments] = useState([
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
  ]);

  // update semester options whenever major changes
  useEffect(() => {
    const m = majorsList.find(m=>m.name===selectedMajor);
    if (m) {
      setSemesterOptions(m.semesters);
      setSelectedSemester(m.semesters[0]);
    }
  }, [selectedMajor]);

  // handlers for dynamic lists
  const handleAddInternship    = () => setPrevInternships([...prevInternships, { company:'', duration:'', responsibilities:'' }]);
  const handleInternshipChange = (i,f,v) => {
    const a=[...prevInternships]; a[i][f]=v; setPrevInternships(a);
  };
  const handleRemoveInternship = i => setPrevInternships(prev=>prev.filter((_,j)=>j!==i));

  const handleAddActivity      = () => setActivities([...activities,'']);
  const handleActivityChange   = (i,v) => {
    const a=[...activities]; a[i]=v; setActivities(a);
  };
  const handleRemoveActivity   = i => setActivities(prev=>prev.filter((_,j)=>j!==i));

  // simulate API save
  const handleSaveProfile = e => {
    e.preventDefault();
    setSaving(true);
    setFormMessage(null);
    setTimeout(() => {
      setSaving(false);
      setFormMessage({ type:'success', text:'Profile updated successfully.' });
    }, 1200);
  };

  // open external assessment link + random grade
  const handleTakeAssessment = id => {
    const ass = assessments.find(a=>a.id===id);
    if (ass?.url) window.open(ass.url,'_blank','noopener');
    const grade = Math.floor(Math.random()*101);
    setAssessments(as=>as.map(a=>a.id===id?{...a,score:grade}:a));
  };

  // toggle public/private visibility
  const handleToggleVisibility = id => {
    setAssessments(as=>
      as.map(a=>a.id===id?{...a,isPublic:!a.isPublic}:a)
    );
  };

  return (
    <div className="profile-page">
      <TopBar showSearch={false}>
        <button className="topbar-button" onClick={()=>navigate('/all-internships')}>
          <img src={internshipIcon} alt="Internships" className="topbar-icon"/><span>Internships</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/student-applications')}>
          <img src={applicationIcon} alt="Applications" className="topbar-icon"/><span>Applications</span>
        </button>
        <button className="topbar-button" onClick={()=>navigate('/evaluations')}>
          <img src={evalIcon} alt="Evaluations" className="topbar-icon"/><span>Evaluations</span>
        </button>
        <button className="topbar-button" onClick={()=>navigate('/notifications')}>
          <img src={notifIcon} alt="Notifications" className="topbar-icon"/><span>Notifications</span>
        </button>
        <button className="topbar-button" onClick={()=>navigate('/student-profile')}>
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
            cycle={user.cycle}
            profileUrl={user.profileUrl}
            profilePicture={user.profilePicture}
          >
            <button className="po-btn"><img src={notifIcon} alt=""/>Notifications</button>
            <button className="po-btn"><img src={applicationIcon} alt=""/>Applications</button>
            <button className="po-btn"><img src={evalIcon} alt=""/>Evaluations</button>
          </ProfileOverview>
        </aside>

        <main className="profile-main">
          <h2 className="profile-title">My Profile</h2>

          <form className="profile-form" onSubmit={handleSaveProfile}>
            {/* Job Interests */}
            <section className="profile-section">
              <h3>Job Interests</h3>
              <textarea
                value={jobInterests}
                onChange={e=>setJobInterests(e.target.value)}
                placeholder="e.g. Front-end development, Data Analysis…"
              />
            </section>

            {/* Previous Internships */}
            <section className="profile-section">
              <h3>Previous Internships &amp; Part-time Jobs</h3>
              {prevInternships.map((it,i)=>(
                <div key={i} className="internship-entry">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={it.company}
                    onChange={e=>handleInternshipChange(i,'company',e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 3 months)"
                    value={it.duration}
                    onChange={e=>handleInternshipChange(i,'duration',e.target.value)}
                  />
                  <textarea
                    placeholder="Responsibilities"
                    value={it.responsibilities}
                    onChange={e=>handleInternshipChange(i,'responsibilities',e.target.value)}
                  />
                  {prevInternships.length>1 && (
                    <button
                      type="button"
                      className="remove-item"
                      onClick={()=>handleRemoveInternship(i)}
                    >×</button>
                  )}
                </div>
              ))}
              <button type="button" className="add-item" onClick={handleAddInternship}>
                + Add Position
              </button>
            </section>

            {/* College Activities */}
            <section className="profile-section">
              <h3>College Activities</h3>
              {activities.map((act,i)=>(
                <div key={i} className="activity-entry">
                  <input
                    type="text"
                    placeholder="e.g. IEEE Chapter Member"
                    value={act}
                    onChange={e=>handleActivityChange(i,e.target.value)}
                  />
                  {activities.length>1 && (
                    <button
                      type="button"
                      className="remove-item"
                      onClick={()=>handleRemoveActivity(i)}
                    >×</button>
                  )}
                </div>
              ))}
              <button type="button" className="add-item" onClick={handleAddActivity}>
                + Add Activity
              </button>
            </section>

            {/* Major & Semester */}
            <section className="profile-section">
              <h3>Major &amp; Semester</h3>
              <div className="two-cols">
                <select
                  value={selectedMajor}
                  onChange={e=>setSelectedMajor(e.target.value)}
                >
                  {majorsList.map(m=>(
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
                <select
                  value={selectedSemester}
                  onChange={e=>setSelectedSemester(+e.target.value)}
                >
                  {semesterOptions.map(s=>(
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* Instructional Video */}
            <section className="profile-section">
              <h3>What counts as an internship?</h3>
              <div className="video-wrapper">
                <video
                  controls
                  src={internshipGuide}
                  className="profile-video"
                >
                  Your browser doesn’t support HTML5 video.
                </video>
              </div>
            </section>

            {/* Save */}
            <div className="save-bar">
              <button
                type="submit"
                className="button-primary"
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

          {/* Pro-Only Features */}
          {user.status==='Pro' && (
            <section className="pro-features">
              <h3>Pro-Only Features</h3>

              <div className="companies-viewed">
                <h4>Who’s Viewed My Profile</h4>
                <ul>
             {companiesViewed.map(c=>(
                <li key={c} className="company-item">
                  <img
                    src={companyLogos[c]}
                    alt={c}
                    className="company-logo"
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
              </div>

              <div className="assessments">
                <h4>Online Assessments</h4>
                {assessments.map(a=>(
                  <div key={a.id} className="assessment-card">
                    <div className="assessment-info">
                      <span className="assessment-name">{a.name}</span>
                      {a.score!==null && (
                        <span className="assessment-score">
                          Grade: {a.score}/100
                        </span>
                      )}
                    </div>
                    <div className="assessment-actions">
                      {a.score===null ? (
                        <button onClick={()=>handleTakeAssessment(a.id)}>
                          Take Assessment
                        </button>
                      ) : (
                        <select
                          value={a.isPublic ? 'public' : 'private'}
                          onChange={()=>handleToggleVisibility(a.id)}
                        >
                          <option value="private">Private</option>
                          <option value="public">Public</option>
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;
