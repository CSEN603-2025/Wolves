import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';
import AppealModal from './AppealModal';
import NotificationIcon from '../assets/icons/notif-icon.png';
import NewNotificationIcon from '../assets/icons/new-notif-icon.png';

const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const StudentNotifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const [notifications, setNotifications] = useState(
    () => JSON.parse(sessionStorage.getItem('student-notifications')) || []
  );
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(
    () => JSON.parse(sessionStorage.getItem('student-has-unread')) || false
  );
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [appealMessage, setAppealMessage] = useState('');
  const notifBtnRef = useRef(null);

  // Load notifications
  useEffect(() => {
    import('../data/student-notifications.json').then(m => {
      const allNotifications = m.default;
      // Filter out Pro-only notifications for non-Pro users
      const filteredNotifications = allNotifications.filter(notif => 
        !notif.isPro || (notif.isPro && user.status === 'Pro')
      );
      setNotifications(filteredNotifications);
      sessionStorage.setItem('student-notifications', JSON.stringify(filteredNotifications));
      setHasUnreadNotifications(true);
      sessionStorage.setItem('student-has-unread', 'true');
    });
  }, [user.status]);

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
    sessionStorage.setItem('student-has-unread', 'false');
  };

  const handleNotificationClick = (notification) => {
    setShowNotifications(false); // Close the notifications dropdown
    
    // Remove the clicked notification
    const updatedNotifications = notifications.filter(n => n.id !== notification.id);
    setNotifications(updatedNotifications);
    sessionStorage.setItem('student-notifications', JSON.stringify(updatedNotifications));
    
    if (notification.type === 'report' && (notification.status === 'flagged' || notification.status === 'rejected')) {
      setSelectedNotification(notification);
      setShowAppealModal(true);
    } else if (notification.clickable && notification.link) {
      navigate(notification.link);
    }
  };

  const handleAppealSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the appeal to the server
    console.log('Appeal submitted:', {
      notificationId: selectedNotification.id,
      message: appealMessage
    });
    setShowAppealModal(false);
    setAppealMessage('');
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

      <AppealModal 
        isOpen={showAppealModal} 
        onClose={() => {
          setShowAppealModal(false);
          setAppealMessage('');
          setSelectedNotification(null);
        }}
        title={`Appeal ${selectedNotification?.status === 'flagged' ? 'Flagged' : 'Rejected'} Report`}
        comments={selectedNotification?.comments}
        onSubmit={handleAppealSubmit}
        appealMessage={appealMessage}
        setAppealMessage={setAppealMessage}
      />
    </>
  );
};

export default StudentNotifications; 