import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import AppointmentCard from '../components/AppointmentCard';
import Modal from '../components/Modal';
import './StudentAppointments.css';
import profileIcon     from '../assets/icons/profile-icon.png';
import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';

const StudentAppointments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sent');
  const [appointments, setAppointments] = useState([]);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: 'Career Guidance'
  });

  // Mock user data
  const user = { id: '1', email: 'student@example.com' };

  useEffect(() => {
    // Load appointments from mock data
    fetch('/data/student-appointments.json')
      .then(response => response.json())
      .then(data => {
        console.log('Loaded appointments:', data.appointments);
        setAppointments(data.appointments);
      })
      .catch(error => {
        console.error('Error loading appointments:', error);
        setAppointments([]);
      });
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const isSender = appointment.senderEmail === user.email;
    const isReceiver = appointment.receiverEmail === user.email;
    const isScheduledOrWaiting = appointment.status === 'scheduled' || appointment.status === 'waiting';

    switch (activeTab) {
      case 'sent':
        return isSender && !isScheduledOrWaiting;
      case 'received':
        return isReceiver && !isScheduledOrWaiting;
      case 'scheduled':
        return (isSender || isReceiver) && isScheduledOrWaiting;
      default:
        return false;
    }
  });

  const handleAccept = (appointmentId) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'scheduled' }
        : appointment
    );
    setAppointments(updatedAppointments);
  };

  const handleReject = (appointmentId) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'rejected' }
        : appointment
    );
    setAppointments(updatedAppointments);
  };

  const handleStartCall = (appointmentId) => {
    console.log('Student starting call for appointment:', appointmentId);
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'waiting' }
        : appointment
    );
    setAppointments(updatedAppointments);
  };

  const handleAcceptCall = (appointmentId) => {
    console.log('Student accepting call for appointment:', appointmentId);
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'scheduled' }
        : appointment
    );
    setAppointments(updatedAppointments);
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
    setShowNewAppointmentModal(false);
    setNewAppointment({ title: 'Career Guidance' });
  };

  return (
    <div className="appointments-page">
      <TopBar showSearch={false}>
      <button className="topbar-button" onClick={()=> navigate('/student-home')}>
          <img src={homeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/student-profile')}>
          <img src={profileIcon} alt="profile" className="topbar-icon" />
          <span>Profile</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/login')}>
          <img src={logoutIcon} alt="logout" className="topbar-icon" />
          <span>Logout</span>
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