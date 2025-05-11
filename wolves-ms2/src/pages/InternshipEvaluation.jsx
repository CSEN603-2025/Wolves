import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import internshipsData from '../data/student-internships.json';
import coursesData from '../data/courses.json';
import { jsPDF } from 'jspdf';
import './InternshipEvaluation.css';

import internshipIcon  from '../assets/icons/internships-icon.png';
import applicationIcon from '../assets/icons/application-icon.png';
import evalIcon        from '../assets/icons/eval-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import profileIcon     from '../assets/icons/profile-icon.png';
import HomeIcon     from '../assets/icons/home-icon.png';


const TABS = ['Evaluation', 'Report', 'Courses', 'Finalize'];

const InternshipEvaluation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // localStorage keys
  const evalKey = `eval-${id}`;
  const repoKey = `report-${id}`;
  const coursesKey = `courses-${id}`;

  // state
  const [evaluations, setEvaluations] = useState(() =>
    JSON.parse(localStorage.getItem(evalKey)) || []
  );
  const [reports, setReports] = useState(() =>
    JSON.parse(localStorage.getItem(repoKey)) || []
  );
  const [selectedCourses, setSelectedCourses] = useState(() =>
    JSON.parse(localStorage.getItem(coursesKey)) || []
  );
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // form fields & edit flags
  const [evalComment, setEvalComment] = useState('');
  const [evalRecommend, setEvalRecommend] = useState(false);
  const [isEditingEval, setIsEditingEval] = useState(false);

  const [reportTitle, setReportTitle] = useState('');
  const [reportIntro, setReportIntro] = useState('');
  const [reportBody, setReportBody] = useState('');
  const [isEditingReport, setIsEditingReport] = useState(false);

  const [mainSupervisor, setMainSupervisor] = useState('');

  // feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [successType, setSuccessType] = useState(''); // 'recommend' | 'norecommend' | 'report'

  // persist
  useEffect(() => {
    localStorage.setItem(evalKey, JSON.stringify(evaluations));
  }, [evaluations]);
  useEffect(() => {
    localStorage.setItem(repoKey, JSON.stringify(reports));
  }, [reports]);
  useEffect(() => {
    localStorage.setItem(coursesKey, JSON.stringify(selectedCourses));
  }, [selectedCourses]);

  const internship = internshipsData.find(i => String(i.id) === id);
  if (!internship) {
    return (
      <div className="internship-eval-page">
        <p>Internship not found.</p>
      </div>
    );
  }

  // --- Handlers --------------------------------------------------------------

  // Create or update evaluation
  const handleAddOrUpdateEval = () => {
    if (!evalComment.trim()) {
      setError('Evaluation cannot be empty.');
      return;
    }
    const newEval = {
      id: evaluations[0]?.id || Date.now(),
      comment: evalComment,
      recommend: evalRecommend
    };
    setEvaluations([newEval]);
    setIsEditingEval(false);
    setError('');
    setSuccessType(evalRecommend ? 'recommend' : 'norecommend');
    setSuccessMsg(
      evalRecommend
        ? 'You recommend this company.'
        : 'You do not recommend this company.'
    );
    setEvalComment('');
    setEvalRecommend(false);
  };

  const handleEditEval = () => {
    const ev = evaluations[0];
    setEvalComment(ev.comment);
    setEvalRecommend(ev.recommend);
    setIsEditingEval(true);
    setError('');
    setSuccessMsg('');
  };

  const handleDeleteEval = () => {
    setEvaluations([]);
    setSuccessMsg('');
  };

  // Create or update report
  const handleAddOrUpdateReport = () => {
    if (!reportTitle.trim() || !reportIntro.trim() || !reportBody.trim() || !mainSupervisor.trim()) {
      setError('All report fields are required.');
      return;
    }
    const newRpt = {
      id: reports[0]?.id || Date.now(),
      title: reportTitle,
      intro: reportIntro,
      body: reportBody,
      mainSupervisor: mainSupervisor
    };
    setReports([newRpt]);
    setIsEditingReport(false);
    setError('');
    setSuccessType('report');
    setSuccessMsg('Report saved successfully.');
    setReportTitle('');
    setReportIntro('');
    setReportBody('');
    setMainSupervisor('');
  };

  const handleEditReport = () => {
    const rpt = reports[0];
    setReportTitle(rpt.title);
    setReportIntro(rpt.intro);
    setReportBody(rpt.body);
    setIsEditingReport(true);
    setError('');
    setSuccessMsg('');
  };

  const handleDeleteReport = () => {
    setReports([]);
    setSuccessMsg('');
  };

  // Courses toggle
  const toggleCourse = cid => {
    setError('');
    setSelectedCourses(sel =>
      sel.includes(cid) ? sel.filter(x => x !== cid) : [...sel, cid]
    );
  };

  // Finalize → PDF
  const handleFinalize = () => {
    if (!evaluations.length || !reports.length || !selectedCourses.length) {
      setError(
        'Complete evaluation, report, and course selection before finalizing.'
      );
      return;
    }
    generatePDF();
  };

  const generatePDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 40;
    doc.setFontSize(20).text(`${internship.company} - Internship Report`, 40, y);
    y += 30;

    // Report
    const rpt = reports[0];
    doc.setFontSize(16).text(`Title: ${rpt.title}`, 40, y); y += 20;
    doc.setFontSize(12).text(`Introduction: ${rpt.intro}`, 40, y); y += 20;
    doc.text('Body:', 40, y); y += 16;
    doc.text(rpt.body, 40, y); y += 30;

    // Courses
    doc.text('Courses that helped:', 40, y); y += 20;
    selectedCourses.forEach((cid, idx) => {
      const name = coursesData.find(c => c.id === cid)?.name;
      doc.text(`${idx + 1}. ${name}`, 60, y); y += 16;
    });
    y += 20;

    // Evaluation
    const ev = evaluations[0];
    doc.text('Evaluation:', 40, y); y += 20;
    doc.text(
      `${ev.recommend ? 'Recommend' : 'Do not recommend'}: ${ev.comment}`,
      60,
      y
    );

    doc.save(`Internship_Report_${internship.id}.pdf`);
  };

  // Submit report to admin-reports in sessionStorage
  const handleSubmitReport = () => {
    if (!evaluations.length || !reports.length || !selectedCourses.length) {
      setError('Complete evaluation, report, and course selection before submitting.');
      return;
    }
    const report = reports[0];
    const evaluation = evaluations[0];
    const adminReports = JSON.parse(sessionStorage.getItem('admin-reports')) || [];
    // Calculate dates
    const endDate = new Date();
    let startDate = new Date();
    // Parse duration (e.g., "3 months")
    const durationMatch = internship.duration.match(/(\d+)\s*month/);
    if (durationMatch) {
      const months = parseInt(durationMatch[1], 10);
      startDate.setMonth(endDate.getMonth() - months);
    }
    const formatDate = d => d.toISOString().slice(0, 10);
    const newReport = {
      id: Date.now(),
      studentId: user?.id,
      studentName: user?.name,
      profilePicture: user?.profilePicture || '/assets/icons/default-pp.png',
      companyName: internship.company,
      mainSupervisor: report.mainSupervisor,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      title: report.title,
      introduction: report.intro,
      body: report.body,
      status: 'pending',
      major: user?.major || '',
      evaluation: evaluation,
      courses: selectedCourses,
    };
    sessionStorage.setItem('admin-reports', JSON.stringify([newReport, ...adminReports]));
    setSuccessMsg('Report submitted successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
    // Optionally, clear local data or redirect
  };

  // --- Render ---------------------------------------------------------------
  return (
    <div className="internship-eval-page">
      <TopBar showSearch={false}>
        <button className="topbar-button" onClick={() => navigate('/all-internships')}>
            <img src={internshipIcon}  alt="Internships"  className="topbar-icon" />
            <span>Internships</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/student-applications')}>
            <img src={applicationIcon} alt="Applications"  className="topbar-icon" />
            <span>Applications</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/student-internships')}>
            <img src={evalIcon}        alt="My Internships"   className="topbar-icon" />
            <span>My Internships</span>
        </button>
        <button className="topbar-button">
            <img src={notifIcon}       alt="Notifications" className="topbar-icon" />
            <span>Notifications</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/student-profile')}>
            <img src={profileIcon}     alt="Profile"       className="topbar-icon" />
            <span>Profile</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/student-home')}>
            <img src={HomeIcon}     alt="home"       className="topbar-icon" />
            <span>Home</span>
        </button>
      </TopBar>

      <main className="iv-listing-main eval-container">
        <button className="iv-back-btn" onClick={() => navigate(-1)}>
          Back
        </button>

        {/* --- Internship Summary Card --- */}
        <div className="iv-listing-header">
          <img
            src={require(`../assets/companies/${internship.logo}`)}
            alt="Company Logo"
            className="iv-listing-logo"
          />
          <div>
            <h2 className="iv-listing-title">{internship.title}</h2>
            <div className="iv-listing-company">{internship.company}</div>
          </div>
        </div>
        <div className="iv-listing-meta">
          <span><strong>Location:</strong> {internship.location}</span>
          <span><strong>Industry:</strong> {internship.industry}</span>
          <span><strong>Duration:</strong> {internship.duration}</span>
          <span><strong>Pay:</strong> {internship.paid ? 'Paid' : 'Unpaid'}</span>
          {internship.paid && (
            <span><strong>Salary:</strong> {internship.salary}</span>
          )}
        </div>
        <section className="iv-listing-section">
          <h3>Description</h3>
          <p>{internship.description}</p>
        </section>
        <section className="iv-listing-section">
          <h3>Skills</h3>
          <ul className="iv-skills-list">
            {internship.skills.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>
        <div className={`iv-status-badge iv-status-${internship.status.replace(' ', '-')}`}>{internship.status}</div>

        {successMsg && (
          <div className={`success-text ${successType}`}>{successMsg}</div>
        )}
        {error && <div className="error-text">{error}</div>}

        {/* --- Tabs --- */}
        <nav className="iv-tabs-bar" aria-label="Evaluation Tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              className={`iv-tab-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setError('');
                setSuccessMsg('');
              }}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="tab-content">
          {/* Evaluation Tab */}
          {activeTab === 'Evaluation' && (
            <section className="eval-section eval-card-section">
              {(isEditingEval || !evaluations.length) && (
                <>
                  <textarea
                    className="eval-input"
                    value={evalComment}
                    onChange={e => setEvalComment(e.target.value)}
                    placeholder="Your thoughts…"
                  />
                  <div className="checkbox-row">
                    <input
                      type="checkbox"
                      id="rec"
                      checked={evalRecommend}
                      onChange={e => setEvalRecommend(e.target.checked)}
                    />
                    <label htmlFor="rec">Recommend to other students</label>
                  </div>
                  <button
                    className="iv-btn primary"
                    onClick={handleAddOrUpdateEval}
                  >
                    {isEditingEval ? 'Update' : 'Submit'}
                  </button>
                  {isEditingEval && (
                    <button
                      className="iv-btn secondary"
                      onClick={() => {
                        setIsEditingEval(false);
                        setEvalComment('');
                        setEvalRecommend(false);
                        setError('');
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
              {evaluations[0] && !isEditingEval && (
                <div className="iv-eval-card eval-card-section">
                  <p className="eval-text">{evaluations[0].comment}</p>
                  <button
                    className="iv-btn secondary"
                    onClick={handleEditEval}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={handleDeleteEval}
                  >
                    Delete
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Report Tab */}
          {activeTab === 'Report' && (
            <section className="report-section eval-card-section">
              {(isEditingReport || !reports.length) && (
                <>
                  <input
                    type="text"
                    className="eval-input"
                    value={reportTitle}
                    onChange={e => setReportTitle(e.target.value)}
                    placeholder="Title"
                  />
                  <textarea
                    className="eval-input"
                    value={reportIntro}
                    onChange={e => setReportIntro(e.target.value)}
                    placeholder="Introduction…"
                  />
                  <textarea
                    className="eval-input"
                    value={reportBody}
                    onChange={e => setReportBody(e.target.value)}
                    placeholder="Body…"
                  />
                  <input
                    type="text"
                    className="eval-input"
                    value={mainSupervisor}
                    onChange={e => setMainSupervisor(e.target.value)}
                    placeholder="Main Supervisor"
                  />
                  <button
                    className="iv-btn primary"
                    onClick={handleAddOrUpdateReport}
                  >
                    {isEditingReport ? 'Update Report' : 'Save Report'}
                  </button>
                  {isEditingReport && (
                    <button
                      className="iv-btn secondary"
                      onClick={() => {
                        setIsEditingReport(false);
                        setReportTitle('');
                        setReportIntro('');
                        setReportBody('');
                        setMainSupervisor('');
                        setError('');
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
              {reports[0] && !isEditingReport && (
                <div className="iv-eval-card eval-card-section">
                  <h4 className="report-title">{reports[0].title}</h4>
                  <p className="report-intro">{reports[0].intro}</p>
                  <p className="report-body">{reports[0].body}</p>
                  <p className="report-supervisor"><strong>Supervisor:</strong> {reports[0].mainSupervisor}</p>
                  <button
                    className="iv-btn secondary"
                    onClick={handleEditReport}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={handleDeleteReport}
                  >
                    Delete
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Courses Tab */}
          {activeTab === 'Courses' && (
            <section className="courses-section eval-card-section">
              <div className="courses-grid">
                {coursesData.map(c => (
                  <label key={c.id} className="course-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(c.id)}
                      onChange={() => toggleCourse(c.id)}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* Finalize Tab */}
          {activeTab === 'Finalize' && (
            <section className="finalize-section eval-card-section">
              <button className="iv-btn primary" onClick={handleFinalize}>
                Download PDF
              </button>
              <button className="iv-btn primary" style={{marginLeft:'1rem'}} onClick={handleSubmitReport}>
                Submit Report
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default InternshipEvaluation;
