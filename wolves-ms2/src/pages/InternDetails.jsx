import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }   from 'react-router-dom';
import TopBar                        from '../components/TopBar';
import ProfileOverview               from '../components/ProfileOverview';
import applicationsData              from '../data/interns.json';
import studentsData                  from '../data/students.json';
import internshipsData               from '../data/internships.json';
import evaluationsData               from '../data/evaluations.json';
import './InternDetails.css';

export default function InternDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();

  // look up the application
  const application = applicationsData
    .find(a => String(a.id) === id) || {};
  // only proceed if they've completed
  useEffect(() => {
    if (application.status !== 'Internship Complete') {
      navigate('/company-interns', { replace: true });
    }
  }, [application, navigate]);

  const student    = studentsData
    .find(s => String(s.id) === String(application.studentId)) || {};
  const internship = internshipsData
    .find(i => String(i.id) === String(application.internshipId)) || {};

  // initial evals for *this* intern
  const [evals, setEvals] = useState(
    evaluationsData.filter(ev => String(ev.internshipId) === id)
  );
  const [newText, setNewText]         = useState('');
  const [editingId, setEditingId]     = useState(null);
  const [editingText, setEditingText] = useState('');

  // Add
  const handleAdd = e => {
    e.preventDefault();
    if (!newText.trim()) return;
    const nextId = Math.max(0, ...evals.map(e => e.id)) + 1;
    setEvals([
      ...evals,
      { id: nextId, internshipId: id, text: newText.trim() }
    ]);
    setNewText('');
  };

  // Start editing
  const startEdit = ev => {
    setEditingId(ev.id);
    setEditingText(ev.text);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };
  // Save edit
  const saveEdit = e => {
    e.preventDefault();
    setEvals(evals.map(ev =>
      ev.id === editingId ? { ...ev, text: editingText } : ev
    ));
    cancelEdit();
  };
  // Delete
  const deleteEval = id => {
    setEvals(evals.filter(ev => ev.id !== id));
  };

  return (
    <div className="intern-details-dashboard">
      <TopBar showSearch={false}>
        <button
          className="intern-back-btn"
          onClick={() => navigate(-1)}
        >
          <span className="chevron-left" />
          <span className="topbar-button">Back</span>
        </button>
      </TopBar>

      <div className="intern-details-main">
        <aside className="intern-details-sidebar">
          <ProfileOverview
            name={student.name}
            email={student.email}
            major={student.major}
            status={student.status}
            completedMonths={student.completedMonths}
            totalMonths={student.totalMonths || 3}
            hideCycle={true}
            profileUrl={`/student-profile/${student.id}`}
            profilePicture={student.profilePicture}
          />
        </aside>

        <section className="intern-details-content">
          <h2 className="intern-details-title">
            Intern Overview — {internship.title} @ {internship.company}
          </h2>

          <div className="intern-details-section">
            <h3>Contact & Major</h3>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Major:</strong> {student.major}</p>
          </div>

          <div className="intern-details-section">
            <h3>Job Interests</h3>
            <ul>
              <li>UI/UX Design</li>
              <li>Frontend Development</li>
              <li>React</li>
            </ul>
          </div>

          <div className="intern-details-section">
            <h3>Previous Internships</h3>
            <ul>
              <li>Web Intern @ Acme Co.</li>
              <li>Research Asst. @ GUC</li>
            </ul>
          </div>

          <div className="intern-details-section">
            <h3>College Activities</h3>
            <ul>
              <li>Media Engineering Club</li>
              <li>Robotics Team</li>
              <li>AI Study Group</li>
            </ul>
          </div>

          <div className="intern-details-section">
            <h3>Documents</h3>
            <ul className="intern-details-docs">
              <li><a href="/sample.pdf" download>Download CV</a></li>
              <li><a href="/sample.pdf" download>Download Cover Letter</a></li>
              <li><a href="/sample.pdf" download>Download Certificates</a></li>
            </ul>
          </div>

          {/** ———————————— Evaluation CRUD ———————————— **/}
          <div className="intern-details-eval-section">
            <h3>Evaluations</h3>
            <ul className="eval-list">
              {evals.map(ev => (
                <li key={ev.id} className="eval-card">
                  {editingId === ev.id ? (
                    <form onSubmit={saveEdit} className="eval-form">
                      <textarea
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        required
                      />
                      <div className="eval-form-buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="eval-text">{ev.text}</p>
                      <div className="eval-buttons">
                        <button onClick={() => startEdit(ev)}>Edit</button>
                        <button onClick={() => deleteEval(ev.id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <form onSubmit={handleAdd} className="eval-add-form">
              <textarea
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="Add a new evaluation…"
                required
              />
              <button type="submit">Add Evaluation</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
