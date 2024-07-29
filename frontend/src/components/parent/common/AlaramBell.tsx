import React, { useState } from 'react';
import { FaRegBell } from 'react-icons/fa6';
import { IoCloseSharp } from 'react-icons/io5';
import { FaBook, FaComment, FaPhotoVideo } from 'react-icons/fa';
import ThreeModel from '../../ThreeModel';

interface Notification {
  time: string;
  title: string;
  contents: string;
  code: 'Notice' | '상담' | '앨범';
}

interface AlaramBellProps {
  notificationCount: number;
  notifications: Notification[];
}

const AlaramBell: React.FC<AlaramBellProps> = ({ notificationCount, notifications: initialNotifications }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleNotificationClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleRemoveNotification = (index: number) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  const handleRemoveAllNotifications = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case '알림장':
        return <FaBook className="w-6 h-6 text-black" />;
      case '상담':
        return <FaComment className="w-6 h-6 text-black" />;
      case '앨범':
        return <FaPhotoVideo className="w-6 h-6 text-black" />;
      default:
        return null;
    }
  };

  return (
    <div className="font-KoPubDotum relative">
      <FaRegBell className="w-6 h-6 text-gray-700 cursor-pointer" onClick={handleNotificationClick} />
      {notificationCount > 0 && (
        <div className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white rounded-full text-xs" style={{ transform: 'translate(50%, -50%)' }}>
          {notificationCount}
        </div>
      )}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={handleNotificationClick}></div>
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-screen-sm px-4">
            <div className="space-y-4 mt-8">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  onClick={() => handleRemoveNotification(index)}
                  className="relative flex flex-col p-4 bg-white bg-opacity-30 border border-white rounded-lg shadow-md backdrop-filter backdrop-blur-md text-white cursor-pointer"
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <div className="flex items-center mb-1">
                    {getIcon(notification.type)}
                    <span className="font-bold text-gray-800 ml-2">{notification.title}</span>
                  </div>
                  <span className="text-xs text-gray-600">{notification.time}</span>
                  <p className="text-gray-700">{notification.content}</p>
                </div>
              ))}
              {notifications.length > 0 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleRemoveAllNotifications}
                    className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-30 border border-white rounded-full shadow-md backdrop-filter backdrop-blur-md text-white"
                    style={{
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <IoCloseSharp className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
            <ThreeModel />
          </div>
        </>
      )}
    </div>
  );
};

export default AlaramBell;
