import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';
import NotificationIcon from '../assets/icons/notif-icon.png';
import NewNotificationIcon from '../assets/icons/new-notif-icon.png';

const MODAL_WIDTH = 340; // should match min-width in Notifications.css

const CompanyNotifications = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifPosition, setNotifPosition] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const notifBtnRef = useRef(null);

  // Load notifications
  useEffect(() => {
    import('../data/company-notifications.json').then(m => {
      const allNotifications = m.default;
      setNotifications(allNotifications);
      sessionStorage.setItem('company-notifications', JSON.stringify(allNotifications));
      setHasUnreadNotifications(true);
      sessionStorage.setItem('company-has-unread', 'true');
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
    sessionStorage.setItem('company-has-unread', 'false');
  };

  const handleNotificationClick = (notification) => {
    // Close the notifications dropdown
    setShowNotifications(false);
    
    // Create a new array without the clicked notification
    const updatedNotifications = notifications.filter(n => n.id !== notification.id);
    
    // Update state and session storage
    setNotifications(updatedNotifications);
    sessionStorage.setItem('company-notifications', JSON.stringify(updatedNotifications));
    
    // Handle navigation if the notification is clickable
    if (notification.clickable && notification.link) {
      navigate(notification.link);
    }
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
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

      <Notifications isOpen={showNotifications} onClose={handleCloseNotifications} position={notifPosition}>
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
    </>
  );
};

export default CompanyNotifications; 