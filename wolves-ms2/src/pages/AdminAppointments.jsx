import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import AppointmentCard from '../components/AppointmentCard';
import Modal from '../components/Modal';
import './AdminAppointments.css';
import notificationIcon from '../assets/icons/notif-icon.png';
import homeIcon from '../assets/icons/home-icon.png';
import logoutIcon from '../assets/icons/logout-icon.png';

import studentIcon from '../assets/icons/interns-icon.png';
import companyIcon from '../assets/icons/companies-icon.png';
import internshipIcon from '../assets/icons/internships-icon.png';
import workshopIcon from '../assets/icons/workshop-icon.png';
import reportsIcon from '../assets/icons/eval-icon.png';
import appointmentIcon from '../assets/icons/appointment-icon.png';


const MODAL_WIDTH = 340; // should match min-width in Notifications.css


const AdminAppointments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sent');
  const [appointments, setAppointments] = useState([]);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: 'Career Guidance'
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const notifBtnRef = useRef(null);

  // Mock user data
  const user = { id: 'admin1', email: 'admin@guc.edu.eg' };

  useEffect(() => {
    // Load appointments from mock data
    fetch('/data/admin-appointments.json')
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
    console.log('Admin starting call for appointment:', appointmentId);
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'waiting' }
        : appointment
    );
    setAppointments(updatedAppointments);
  };

  const handleAcceptCall = (appointmentId) => {
    console.log('Admin accepting call for appointment:', appointmentId);
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
      receiverId: 'student1',
      receiverEmail: 'student1@example.com',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString()
    };

    console.log('Created appointment:', appointment);

    const updatedAppointments = [...appointments, appointment];
    setAppointments(updatedAppointments);
    setShowNewAppointmentModal(false);
    setNewAppointment({ title: 'Career Guidance' });
  };
  const handleNotifClick = (e) => {
    const rect = notifBtnRef.current.getBoundingClientRect();
    let left = rect.right - MODAL_WIDTH;
    if (left < 8) left = 8; // prevent going off the left edge
    setNotifPosition({
      top: rect.bottom + 8, // 8px below the button
      left,
    });
    setShowNotifications(true);
  };

  const menuItems = (
    <>
      <Link to="/admin-home" className="sidebar-item">
        <img src={homeIcon} alt="Dashboard" className="sidebar-icon" />
        <span>Dashboard</span>
      </Link>
      <Link to="/admin-home/companies" className="sidebar-item">
        <img src={companyIcon} alt="Companies" className="sidebar-icon" />
        <span>Companies</span>
      </Link>
      <Link to="/admin-home/internships" className="sidebar-item">
        <img src={internshipIcon} alt="Internships" className="sidebar-icon" />
        <span>Internships</span>
      </Link>
      <Link to="/admin/students" className="sidebar-item">
        <img src={studentIcon} alt="Students" className="sidebar-icon" />
        <span>Students</span>
      </Link>
      <Link to="/admin/workshops" className="sidebar-item">
        <img src={workshopIcon} alt="Workshops" className="sidebar-icon" />
        <span>Workshops</span>
      </Link>
      <Link to="/admin/reports" className="sidebar-item">
        <img src={reportsIcon} alt="Reports" className="sidebar-icon" />
        <span>Reports</span>
      </Link>
      <Link to="/admin-appointments" className="sidebar-item">
        <img src={appointmentIcon} alt="apointments" className="sidebar-icon" />
        <span>Appointments</span>
      </Link>
      <Link to="/admin/notifications" className="sidebar-item">
        <img src={notificationIcon} alt="Notifications" className="sidebar-icon" />
        <span>Notifications</span>
      </Link>
      <Link to="/login" className="sidebar-item">
        <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
        <span>Logout</span>
      </Link>
    </>
  );

  return (
    <div className="appointments-page">
      <TopBar showSearch={false} menuItems={menuItems}>
        <button
          className="topbar-button"
          ref={notifBtnRef}
          onClick={handleNotifClick}
        >
          <img src={notificationIcon} alt="Notifications" className="topbar-icon" />
          <span>Notifications</span>
        </button>
        <button className="topbar-button" onClick={()=> navigate('/admin-home')}>
          <img src={homeIcon} alt="Dashboard" className="topbar-icon" />
          <span>Dashboard</span>
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

export default AdminAppointments; 