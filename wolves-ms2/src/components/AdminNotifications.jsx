import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';
import AppealResponseModal from './AppealResponseModal';
import NotificationIcon from '../assets/icons/notif-icon.png';
import NewNotificationIcon from '../assets/icons/new-notif-icon.png';

const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const [notifications, setNotifications] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-notifications')) || []
  );
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(
    () => JSON.parse(sessionStorage.getItem('admin-has-unread')) || false
  );
  const [showAppealResponseModal, setShowAppealResponseModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const notifBtnRef = useRef(null);

  // Load notifications
  useEffect(() => {
    import('../data/admin-notifications.json').then(m => {
      const allNotifications = m.default;
      setNotifications(allNotifications);
      sessionStorage.setItem('admin-notifications', JSON.stringify(allNotifications));
      setHasUnreadNotifications(true);
      sessionStorage.setItem('admin-has-unread', 'true');
    });
  }, []);

  const handleNotifClick = (e) => {
    const rect = notifBtnRef.current.getBoundingClientRect();
    let left = rect.right - MODAL_WIDTH;
    if (left < 8) left = 8; // prevent going off the left edge
    setNotifPosition({
      top: rect.bottom + 8, // 8px below the button
      left,
    });
    setShowNotifications(true);
    setHasUnreadNotifications(false);
    sessionStorage.setItem('admin-has-unread', 'false');
  };

  const handleNotificationClick = (notification) => {
    setShowNotifications(false); // Close the notifications dropdown
    
    // Remove the clicked notification
    const updatedNotifications = notifications.filter(n => n.id !== notification.id);
    setNotifications(updatedNotifications);
    sessionStorage.setItem('admin-notifications', JSON.stringify(updatedNotifications));
    
    if (notification.type === 'appeal') {
      setSelectedNotification(notification);
      setShowAppealResponseModal(true);
    } else if (notification.clickable && notification.link) {
      navigate(notification.link);
    }
  };

  const handleAppealResponseSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the response to the server
    console.log('Appeal response submitted:', {
      notificationId: selectedNotification.id,
      studentId: selectedNotification.studentId,
      reportId: selectedNotification.reportId,
      response: responseMessage
    });
    setShowAppealResponseModal(false);
    setResponseMessage('');
    setSelectedNotification(null);
  };

  return (
    <>
      <button
        className="topbar-button"
        ref={notifBtnRef}
        onClick={handleNotifClick}
      >
        <img 
          src={hasUnreadNotifications ? NewNotificationIcon : NotificationIcon} 
          alt="Notifications" 
          className="topbar-icon" 
          style={{ filter: 'none' }} // Preserve original colors
        />
        <span>Notifications</span>
      </button>

      <Notifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} position={notifPosition}>
        {notifications && notifications.length > 0 ? (
          notifications.map((notif, idx) => (
            <div 
              className={`notif-card ${notif.clickable ? 'clickable' : ''}`} 
              key={notif.id || idx} 
              tabIndex={0}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="notif-title">{notif.title}</div>
              <div className="notif-body">{notif.body}</div>
              <div className="notif-date">{new Date(notif.date).toLocaleString()}</div>
            </div>
          ))
        ) : (
          <div className="notif-empty">No notifications to show.</div>
        )}
      </Notifications>

      <AppealResponseModal 
        isOpen={showAppealResponseModal} 
        onClose={() => {
          setShowAppealResponseModal(false);
          setResponseMessage('');
          setSelectedNotification(null);
        }}
        studentName={selectedNotification?.studentName}
        originalStatus={selectedNotification?.originalStatus}
        originalComments={selectedNotification?.originalComments}
        appealMessage={selectedNotification?.appealMessage}
        onSubmit={handleAppealResponseSubmit}
        responseMessage={responseMessage}
        setResponseMessage={setResponseMessage}
      />
    </>
  );
};

export default AdminNotifications; 