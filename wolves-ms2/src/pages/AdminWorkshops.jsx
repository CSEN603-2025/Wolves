import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import WorkshopCard from '../components/WorkshopCard';
import Modal from '../components/Modal';
import workshopsData from '../data/workshops.json';
import './AdminWorkshops.css';

const AdminWorkshops = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newWorkshop, setNewWorkshop] = useState({
    name: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    shortDescription: '',
    speakerBio: '',
    agenda: ''
  });

  // Load from sessionStorage or JSON
  useEffect(() => {
    let workshopsDataArr = [];
    try {
      workshopsDataArr = JSON.parse(sessionStorage.getItem('admin-workshops'));
      if (!Array.isArray(workshopsDataArr)) {
        workshopsDataArr = workshopsData.workshops || [];
        sessionStorage.setItem('admin-workshops', JSON.stringify(workshopsDataArr));
      }
    } catch {
      workshopsDataArr = workshopsData.workshops || [];
      sessionStorage.setItem('admin-workshops', JSON.stringify(workshopsDataArr));
    }
    // Ensure every workshop has a status
    setWorkshops(workshopsDataArr.map(w => ({ ...w, status: w.status || 'soon' })));
  }, []);

  // Listen for changes in sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const workshopsDataArr = JSON.parse(sessionStorage.getItem('admin-workshops')) || [];
      setWorkshops(workshopsDataArr);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('workshops-updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('workshops-updated', handleStorageChange);
    };
  }, []);

  // Update sessionStorage and dispatch event
  const updateWorkshops = (updated) => {
    setWorkshops(updated);
    sessionStorage.setItem('admin-workshops', JSON.stringify(updated));
    window.dispatchEvent(new Event('workshops-updated'));
  };

  const handleCreateWorkshop = (e) => {
    e.preventDefault();
    const newId = (workshops.length + 1).toString();
    const workshop = { id: newId, status: 'soon', ...newWorkshop };
    updateWorkshops([workshop, ...workshops]);
    setShowModal(false);
    setNewWorkshop({
      name: '', startDate: '', endDate: '', startTime: '', endTime: '', shortDescription: '', speakerBio: '', agenda: ''
    });
  };

  return (
    <div className="admin-workshops-page">
      <TopBar showSearch={false} />
      <div className="workshops-list-container">
        <div className="workshops-header-row">
          <h1>Workshops</h1>
          <button className="iv-btn primary" onClick={() => setShowModal(true)}>
            + Create New Workshop
          </button>
        </div>
        <div className="workshops-list">
          {Array.isArray(workshops) && workshops.map(w => (
            <WorkshopCard
              key={w.id}
              workshop={w}
              onAction={() => {
                sessionStorage.setItem('selectedWorkshop', JSON.stringify(w));
                navigate(`/admin/workshops/${w.id}`);
              }}
            />
          ))}
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Workshop">
        <form className="workshop-form" onSubmit={handleCreateWorkshop}>
          <div className="form-group">
            <label>Name</label>
            <input value={newWorkshop.name} onChange={e => setNewWorkshop({ ...newWorkshop, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={newWorkshop.startDate} onChange={e => setNewWorkshop({ ...newWorkshop, startDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={newWorkshop.endDate} onChange={e => setNewWorkshop({ ...newWorkshop, endDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input type="time" value={newWorkshop.startTime} onChange={e => setNewWorkshop({ ...newWorkshop, startTime: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input type="time" value={newWorkshop.endTime} onChange={e => setNewWorkshop({ ...newWorkshop, endTime: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Short Description</label>
            <textarea value={newWorkshop.shortDescription} onChange={e => setNewWorkshop({ ...newWorkshop, shortDescription: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Speaker Bio</label>
            <textarea value={newWorkshop.speakerBio} onChange={e => setNewWorkshop({ ...newWorkshop, speakerBio: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Agenda</label>
            <textarea value={newWorkshop.agenda} onChange={e => setNewWorkshop({ ...newWorkshop, agenda: e.target.value })} required />
          </div>
          <button className="iv-btn primary" type="submit">Create Workshop</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminWorkshops; 