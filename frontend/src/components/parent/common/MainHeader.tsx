import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AlarmBell from './AlarmBell'
import { getAllAlarms } from '../../../api/alarm'
import { Alarm } from "../../../types/alarm"


export default function MainHeader() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Alarm[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
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

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header className="max-w-md w-full fixed z-10 w-full h-[67px] border-b bg-white border-gray-300 p-4 shadow-md flex items-center justify-between">
      <p
        className="text-[30px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer"
        onClick={handleHomeClick}
      >
        키즈링크
      </p>
      <AlarmBell notificationCount={notificationCount} notifications={notifications} />
    </header>
  );
}
