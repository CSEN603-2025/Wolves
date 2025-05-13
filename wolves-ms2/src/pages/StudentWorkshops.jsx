import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import WorkshopCard from '../components/WorkshopCard';
import mockWorkshops from '../data/student-workshops.json';
import './StudentWorkshops.css';

const StudentWorkshops = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('register');
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    // Load workshops from sessionStorage or mock data
    const storedWorkshops = sessionStorage.getItem('workshops');
    if (storedWorkshops) {
      setWorkshops(JSON.parse(storedWorkshops));
    } else {
      console.log('Loading workshops from mock data:', mockWorkshops.workshops);
      setWorkshops(mockWorkshops.workshops);
    }
  }, []);

  const filteredWorkshops = workshops.filter(workshop => {
    switch (activeTab) {
      case 'register':
        return workshop.type === 'register';
      case 'upcoming':
        return ['soon', 'live', 'pre-recorded'].includes(workshop.status);
      case 'concluded':
        return workshop.status === 'concluded';
      default:
        return false;
    }
  });

  const handleWorkshopAction = (workshop) => {
    navigate(`/workshop/${workshop.id}`);
  };

  return (
    <div className="workshops-page">
      <TopBar showSearch={false}>
        <button className="iv-btn secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </TopBar>

      <div className="workshops-container">
        <div className="workshops-header">
          <h1>Workshops</h1>
        </div>

        <div className="workshops-tabs">
          <button
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
          <button
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`tab-btn ${activeTab === 'concluded' ? 'active' : ''}`}
            onClick={() => setActiveTab('concluded')}
          >
            Concluded
          </button>
        </div>

        <div className="workshops-list">
          {filteredWorkshops.length > 0 ? (
            filteredWorkshops.map(workshop => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                onAction={() => handleWorkshopAction(workshop)}
              />
            ))
          ) : (
            <div className="no-workshops">
              No workshops found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentWorkshops; 