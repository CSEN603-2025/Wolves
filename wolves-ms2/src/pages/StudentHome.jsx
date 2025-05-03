import React from 'react';
import './StudentHome.css';
import TopBar from '../components/TopBar';
import InternshipCard from '../components/InternshipCard';
import ProfileOverview from '../components/ProfileOverview';

const StudentHome = () => {
  const internships = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Google',
      location: 'Berlin',
      salary: 'Paid',
      duration: '3 Months',
      date: '3 days ago',
      early: true
    },
    {
      id: 2,
      title: 'Marketing Intern',
      company: 'Unilever',
      location: 'Hamburg',
      salary: 'Unpaid',
      duration: '2 Months',
      date: '3 days ago',
      early: true
    },
    {
      id: 3,
      title: 'Data Analyst Intern',
      company: 'SAP',
      location: 'Munich',
      salary: 'Paid',
      duration: '1 Month',
      date: '2 days ago',
      early: false
    }
  ];

  return (
    <div className="dashboard-container">
      <TopBar />

      <div className="main-content">
        <aside className="sidebar">
          <ProfileOverview />
        </aside>

        <section className="internship-section">
          <h2 className="section-title" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>Suggested for you!</h2>
          <div className="internship-cards">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} {...internship} />
            ))}
          </div>
        </section>
      </div>

      <footer className="footer" style={{ textAlign: 'left', paddingLeft: '2rem', fontSize: '0.8rem' }}>
        <p>GUC Internship Platform © 2025</p>
      </footer>
    </div>
  );
};

export default StudentHome;
