import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import AlarmBell from './AlarmBell'
import { getAllAlarms } from '../../../api/alarm'
import { Notification } from './MainHeader'

interface CommonHeaderProps {
  title: string;
}


export default function SubHeader({ title }: CommonHeaderProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // console.log("Fetching notifications...");
        const fetchedNotifications = await getAllAlarms();
        setNotifications(fetchedNotifications.reverse());
        setNotificationCount(fetchedNotifications.length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleBack = () => {
    const path = location.pathname;
    if (path === '/meeting' || path === '/document' || path === '/notice' || path === '/album' || path === '/growth' || path === 'bus') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-md w-full z-50 fixed w-full h-[67px] border-b bg-white border-gray-300 p-4 shadow-md flex items-center justify-between">
      <button onClick={handleBack} className="flex items-center justify-center w-10 h-10">
        <FaArrowLeft className="w-6 h-6 text-gray-700" />
      </button>
      <p className="text-[22px] font-bold text-[#212121]">
        {title}
      </p>
      <AlarmBell notificationCount={notificationCount} notifications={notifications} />
    </div>
  );
}
