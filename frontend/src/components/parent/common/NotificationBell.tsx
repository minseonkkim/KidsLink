import React, { useState } from 'react';
import { FaRegBell } from 'react-icons/fa6';

interface Notification {
  time: string;
  title: string;
  content: string;
}

interface NotificationBellProps {
  notificationCount: number;
  notifications: Notification[];
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notificationCount, notifications: initialNotifications }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleNotificationClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleRemoveNotification = (index: number) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <div className="font-KoPubDotum relative">
      <FaRegBell className="w-8 h-8 text-gray-700 cursor-pointer" onClick={handleNotificationClick} />
      <div className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full text-sm">
        {notificationCount}
      </div>
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={handleNotificationClick}></div>
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-screen-lg px-4">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="flex flex-col mb-1 p-4 rounded-2xl bg-white shadow-lg transition-transform duration-200 cursor-pointer"
                onClick={() => handleRemoveNotification(index)}
                style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">{notification.title}</span>
                  <span className="text-xs text-gray-600">{notification.time}</span>
                </div>
                <p className="text-gray-700">{notification.content}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
