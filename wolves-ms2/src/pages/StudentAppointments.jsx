import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import AppointmentCard from '../components/AppointmentCard';
import Modal from '../components/Modal';
import './StudentAppointments.css';

const StudentAppointments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sent');
  const [appointments, setAppointments] = useState([]);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: 'Career Guidance'
  });

  // Get user from session storage
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing user from session storage:', e);
      }
    }
    // Default user if none found
    return { id: '1', email: 'student@example.com' };
  });

  useEffect(() => {
    // Load appointments from JSON file
    fetch('/data/appointments.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Loaded appointments:', data.appointments);
        if (Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
          sessionStorage.setItem('appointments', JSON.stringify(data.appointments));
        } else {
          console.error('Invalid appointments data structure:', data);
          setAppointments([]);
        }
      })
      .catch(error => {
        console.error('Error loading appointments:', error);
        // Try to load from session storage
        const storedAppointments = sessionStorage.getItem('appointments');
        if (storedAppointments) {
          try {
            const parsedAppointments = JSON.parse(storedAppointments);
            setAppointments(parsedAppointments);
          } catch (e) {
            console.error('Error parsing stored appointments:', e);
            setAppointments([]);
          }
        } else {
          setAppointments([]);
        }
      });
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    // Check if the appointment is for this student (either as sender or receiver)
    const isStudentAppointment = appointment.senderEmail === user.email || 
                               appointment.receiverEmail === user.email;

    if (!isStudentAppointment) return false;

    const isSender = appointment.senderEmail === user.email;
    const isReceiver = appointment.receiverEmail === user.email;

    switch (activeTab) {
      case 'sent':
        return isSender;
      case 'received':
        return isReceiver;
      case 'scheduled':
        return (isSender || isReceiver) && 
               (appointment.status === 'scheduled' || appointment.status === 'accepted');
      default:
        return false;
    }
  });

  const handleAccept = (appointmentId) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'accepted' }
        : appointment
    );
    setAppointments(updatedAppointments);
    sessionStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const handleReject = (appointmentId) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'rejected' }
        : appointment
    );
    setAppointments(updatedAppointments);
    sessionStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const handleStartCall = (appointmentId) => {
    // Will be implemented when we add the video call functionality
    console.log('Starting call for appointment:', appointmentId);
  };

  const handleAcceptCall = (appointmentId) => {
    // Will be implemented when we add the video call functionality
    console.log('Accepting call for appointment:', appointmentId);
  };

  const handleNewAppointmentSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting appointment with user:', user);
    console.log('New appointment data:', newAppointment);

    const newId = (appointments.length + 1).toString();
    const appointment = {
      id: newId,
      title: newAppointment.title,
      status: 'pending',
      senderId: user.id,
      senderEmail: user.email,
      receiverId: 'admin1',
      receiverEmail: 'admin@guc.edu.eg',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString()
    };

    console.log('Created appointment:', appointment);

    const updatedAppointments = [...appointments, appointment];
    setAppointments(updatedAppointments);
    sessionStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setShowNewAppointmentModal(false);
    setNewAppointment({ title: 'Career Guidance' });
  };

  return (
    <div className="appointments-page">
      <TopBar showSearch={false}>
        <button className="iv-btn secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </TopBar>

      <div className="appointments-container">
        <div className="appointments-header">
          <h1>Appointments</h1>
          <button 
            className="iv-btn primary"
            onClick={() => setShowNewAppointmentModal(true)}
          >
            Request New Appointment
          </button>
        </div>

        <div className="appointments-tabs">
          <button
            className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent
          </button>
          <button
            className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Received
          </button>
          <button
            className={`tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduled')}
          >
            Scheduled
          </button>
        </div>

        <div className="appointments-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                {...appointment}
                currentUserEmail={user.email}
                onAccept={handleAccept}
                onReject={handleReject}
                onStartCall={handleStartCall}
                onAcceptCall={handleAcceptCall}
              />
            ))
          ) : (
            <div className="no-appointments">
              No appointments found in this category.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        title="Request New Appointment"
      >
        <form onSubmit={handleNewAppointmentSubmit} className="appointment-form">
          <div className="form-group">
            <label>Appointment Type</label>
            <select
              value={newAppointment.title}
              onChange={(e) => setNewAppointment({ title: e.target.value })}
              required
            >
              <option value="Career Guidance">Career Guidance</option>
              <option value="Report Clarifications">Report Clarifications</option>
            </select>
          </div>
          <button type="submit" className="iv-btn primary">
            Submit Request
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentAppointments; 