import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import './AdminWorkshop.css';

const AdminWorkshop = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Try to get workshop from navigation state, else from sessionStorage
  let initialWorkshop = location.state?.workshop;
  if (!initialWorkshop) {
    const stored = sessionStorage.getItem('selectedWorkshop');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.id === id) {
        initialWorkshop = parsed;
      }
    }
  }
  const [workshop, setWorkshop] = useState(initialWorkshop);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFields, setEditFields] = useState(workshop);

  if (!workshop) {
    return <div className="admin-workshop-page"><TopBar showSearch={false} /><div className="not-found">Workshop not found.</div></div>;
  }

  const handleEdit = (e) => {
    e.preventDefault();
    setWorkshop(editFields);
    // Update workshops in sessionStorage
    const stored = sessionStorage.getItem('admin-workshops');
    if (stored) {
      const arr = JSON.parse(stored);
      const updated = arr.map(w => w.id === workshop.id ? editFields : w);
      sessionStorage.setItem('admin-workshops', JSON.stringify(updated));
      window.dispatchEvent(new Event('workshops-updated'));
    }
    setEditMode(false);
  };

  const handleDelete = () => {
    // Remove from sessionStorage
    const stored = sessionStorage.getItem('admin-workshops');
    if (stored) {
      const arr = JSON.parse(stored);
      const updated = arr.filter(w => w.id !== workshop.id);
      sessionStorage.setItem('admin-workshops', JSON.stringify(updated));
      window.dispatchEvent(new Event('workshops-updated'));
    }
    setShowDeleteModal(false);
    navigate(-1);
  };

  console.log('AdminWorkshop id:', id, 'workshop:', workshop);

  return (
    <div className="admin-workshop-page">
      <TopBar showSearch={false} />
      <div className="workshop-details-container">
        <div className="workshop-actions-row">
          <button className="iv-btn secondary" onClick={() => navigate(-1)}>Back</button>
          <button className="iv-btn" onClick={() => setEditMode(true)}>Edit</button>
          <button className="iv-btn reject" onClick={() => setShowDeleteModal(true)}>Delete</button>
        </div>
        <h1>{workshop.name}</h1>
        <div className="workshop-meta">
          <span><strong>Date:</strong> {workshop.startDate} {workshop.startTime} - {workshop.endDate} {workshop.endTime}</span>
        </div>
        <div className="workshop-section">
          <h3>Short Description</h3>
          <p>{workshop.shortDescription}</p>
        </div>
        <div className="workshop-section">
          <h3>Speaker Bio</h3>
          <p>{workshop.speakerBio}</p>
        </div>
        <div className="workshop-section">
          <h3>Agenda</h3>
          <pre className="workshop-agenda">{workshop.agenda}</pre>
        </div>
      </div>
      <Modal isOpen={editMode} onClose={() => setEditMode(false)} title="Edit Workshop">
        <form className="workshop-form" onSubmit={handleEdit}>
          <div className="form-group">
            <label>Name</label>
            <input value={editFields.name} onChange={e => setEditFields({ ...editFields, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={editFields.startDate} onChange={e => setEditFields({ ...editFields, startDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={editFields.endDate} onChange={e => setEditFields({ ...editFields, endDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input type="time" value={editFields.startTime} onChange={e => setEditFields({ ...editFields, startTime: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input type="time" value={editFields.endTime} onChange={e => setEditFields({ ...editFields, endTime: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Short Description</label>
            <textarea value={editFields.shortDescription} onChange={e => setEditFields({ ...editFields, shortDescription: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Speaker Bio</label>
            <textarea value={editFields.speakerBio} onChange={e => setEditFields({ ...editFields, speakerBio: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Agenda</label>
            <textarea value={editFields.agenda} onChange={e => setEditFields({ ...editFields, agenda: e.target.value })} required />
          </div>
          <button className="iv-btn primary" type="submit">Save Changes</button>
        </form>
      </Modal>
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Workshop">
        <div style={{padding: '1rem 0'}}>Are you sure you want to delete this workshop?</div>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
          <button className="iv-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="iv-btn reject" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminWorkshop; 