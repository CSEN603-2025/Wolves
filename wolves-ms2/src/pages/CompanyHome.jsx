// File: src/pages/CompanyHome.jsx
import React, { useState ,useEffect} from 'react';
import './StudentHome.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import InternshipCard from '../components/InternshipCard';
import ProfileOverview from '../components/ProfileOverview';

import applicationIcon from '../assets/icons/application-icon.png';
import notifIcon       from '../assets/icons/notif-icon.png';
import NewPost     from '../assets/icons/new-icon.png';
import MyPosts     from '../assets/icons/posts-icon.png';
import Interns     from '../assets/icons/interns-icon.png';
import HomeIcon        from '../assets/icons/home-icon.png';

import internshipsData from '../data/internships.json';

const CompanyHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // base list & filter dropdown values
  const baseList   = internshipsData;
  const industries = Array.from(new Set(baseList.map(i => i.industry)));
  const durations  = Array.from(new Set(baseList.map(i => i.duration)));
  const payOptions = ['Paid','Unpaid'];

  // search + filter state
  const [filters, setFilters] = useState({
    title:   '',
    industry:'',
    duration:'',
    paid:    ''
  });
  const handleSearch = (t, c) => {
    setFilters(f => ({ ...f, title:t.toLowerCase() }));
  };
  const handleFilter = key => e =>
    setFilters(f => ({ ...f, [key]: e.target.value }));

  // apply filters
  const displayed = baseList
    .filter(i =>
      (!filters.title   || i.title.toLowerCase().includes(filters.title)) &&
      (!filters.industry || i.industry === filters.industry) &&
      (!filters.duration  || i.duration  === filters.duration) &&
      (!filters.paid      ||
        (filters.paid === 'Paid' ? i.paid : !i.paid))
    );

  //
  // -- Modal "New Post" state & handlers --
  //
  const [showModal,      setShowModal]      = useState(false);
  const [jobTitle,       setJobTitle]       = useState('');
  const [durationInput,  setDurationInput]  = useState('');
  const [paidInput,      setPaidInput]      = useState('Paid');
  const [salaryInput,    setSalaryInput]    = useState('');
  const [skillsInput,    setSkillsInput]    = useState('');
  const [descriptionInput,setDescriptionInput]=useState('');
  const [posting,        setPosting]        = useState(false);
  const [postMessage,    setPostMessage]    = useState(null);

  const openModal = () => {
    window.scrollTo(0,4460) 
    setShowModal(true);
    setPostMessage(null);
    setJobTitle('');
    setDurationInput('');
    setPaidInput('Paid');
    setSalaryInput('');
    setSkillsInput('');
    setDescriptionInput('');
  };
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    if (location.state?.openNewPostModal) {
      openModal();
    }
  }, [location.state]);

  const handleCreate = e => {
    e.preventDefault();
    setPosting(true);
    setPostMessage(null);
    // simulate API call
    setTimeout(() => {
      setPosting(false);
      setPostMessage('Internship posted successfully!');
    }, 1200);
  };

  return (
    <div className="dashboard-container">
      <TopBar onSearch={handleSearch}>
        <button className="topbar-button" onClick={openModal}>
          <img src={NewPost}  alt="new-post"  className="topbar-icon" />
          <span>New Post</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/company-posts')}>
          <img src={MyPosts} alt="my-posts"  className="topbar-icon" />
          <span>My Posts</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/company-applications')}>
          <img src={applicationIcon} alt="Applications"  className="topbar-icon" />
          <span>Applications</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/company-interns')}>
          <img src={Interns}     alt="interns"       className="topbar-icon" />
          <span>Interns</span>
        </button>
        <button className="topbar-button">
          <img src={notifIcon}       alt="Notifications" className="topbar-icon" />
          <span>Notifications</span>
        </button>
        <button className="topbar-button" onClick={() => navigate('/company-home')}>
          <img src={HomeIcon}     alt="home"       className="topbar-icon" />
          <span>Home</span>
        </button>
      </TopBar>

      <div className="main-content">
        <aside className="sidebar">
          <ProfileOverview
            name={user.name}
            email={user.email}
            major={null}
            status={user.status}
            completedMonths={null}
            totalMonths={null}
            cycle={{ state:'Active', start:'March 1, 2025', end:'June 1, 2025' }}
            profileUrl={'/company-home'}
            profilePicture={'companies/microsoft-logo.png'}
            hideMajor={true}
            hideProgress={true}
          >
            <button className="po-btn" onClick={openModal}>
              <img src={NewPost} alt="" /> New Post
            </button>
            <button className="po-btn" onClick={()=> navigate('/')}>
              <img src={MyPosts} alt="" /> My Posts
            </button>
            <button className="po-btn" onClick={()=> navigate('/')}>
              <img src={applicationIcon} alt="" /> Applications
            </button>
            <button className="po-btn" onClick={()=> navigate('/')}>
              <img src={Interns} alt="" /> Interns & Evaluations
            </button>
          </ProfileOverview>
        </aside>

        <section className="internship-section">
          <h2 className="section-title">All Internships</h2>

          <div className="filters-bar">
            <Filter
              title="Industry"
              value={filters.industry}
              onChange={handleFilter('industry')}
            >
              <option value="">All</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </Filter>

            <Filter
              title="Duration"
              value={filters.duration}
              onChange={handleFilter('duration')}
            >
              <option value="">All</option>
              {durations.map(dur => (
                <option key={dur} value={dur}>{dur}</option>
              ))}
            </Filter>

            <Filter
              title="Pay"
              value={filters.paid}
              onChange={handleFilter('paid')}
            >
              <option value="">All</option>
              {payOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Filter>
          </div>

          <div className="internship-cards">
            {displayed.length
              ? displayed.map(i => <InternshipCard
                key={i.id}
                {...i}
                hideStatus={true}
              />)
              : <p className="no-results">No internships match your filters.</p>
            }
          </div>
        </section>
      </div>

      <footer className="footer">
        GUC Internship Platform © 2025
      </footer>
    {/* </div> */}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h3>New Internship Post</h3>
            <form className="modal-form" onSubmit={handleCreate}>
              <label>
                Job Title
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e=>setJobTitle(e.target.value)}
                  required
                />
              </label>
              <label>
                Duration
                <input
                  type="text"
                  value={durationInput}
                  onChange={e=>setDurationInput(e.target.value)}
                  placeholder="e.g. 3 months"
                  required
                />
              </label>
              <label>
                Paid / Unpaid
                <select
                  value={paidInput}
                  onChange={e=>setPaidInput(e.target.value)}
                >
                  <option value="Paid">Unpaid</option>
                  <option value="Unpaid">Paid</option>
                </select>
              </label>
              {paidInput === 'Unpaid' && (
                <label>
                  Expected Salary
                  <input
                    type="text"
                    value={salaryInput}
                    onChange={e=>setSalaryInput(e.target.value)}
                    placeholder="e.g. 5000 EGP/month"
                    required
                  />
                </label>
              )}
              <label>
                Required Skills
                <textarea
                  value={skillsInput}
                  onChange={e=>setSkillsInput(e.target.value)}
                  placeholder="Comma-separated, e.g. React, Node.js"
                  required
                />
              </label>
              <label>
                Job Description
                <textarea
                  value={descriptionInput}
                  onChange={e=>setDescriptionInput(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                className="modal-submit"
                disabled={posting}
              >
                {posting ? 'Posting…' : 'Post Internship'}
              </button>
              {postMessage && (
                <p className="submit-message">{postMessage}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyHome;
