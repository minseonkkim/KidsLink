import { useState, useEffect } from 'react';
import { FaRegBell, FaTrash } from 'react-icons/fa6'; // 삭제 아이콘 추가
import { FcAdvertising, FcReading, FcPicture, FcVoicePresentation, FcContacts } from 'react-icons/fc';
import { FaBus } from 'react-icons/fa';
import { getAllAlarms, deleteAlarm, deleteAllAlarms } from '../../../api/alarm';
import { formatDate } from '../../../utils/parent/dateUtils';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 추가
import { Notification } from './MainHeader';

interface Alarm {
  id: number;
  date: string;
  contents: string;
  code: string;
}

interface AlaramBellProps {
  notificationCount: number;
  notifications: Notification[];
}

export default function AlaramBell({ notificationCount: initialNotificationCount, notifications: initialNotifications }: AlaramBellProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notificationCount, setNotificationCount] = useState(initialNotificationCount);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications: Alarm[] = await getAllAlarms();
        const transformedNotifications: Notification[] = fetchedNotifications.map((alarm: Alarm) => ({
          id: alarm.id,
          date: alarm.date,
          contents: alarm.contents,
          code: alarm.code as Notification['code'],
        }));
        setNotifications(transformedNotifications);
        setNotificationCount(transformedNotifications.length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    switch (notification.code) {
      case 'NOTICE':
        navigate('/notice');
        break;
      case 'ALBUM':
        navigate('/album');
        break;
      case 'BUS':
        navigate('/bus');
        break;
      case 'DIARY':
        navigate('/growth');
        break;
      case 'MEETING':
        navigate('/meeting');
        break;
      case 'DOCUMENT':
        navigate('/document');
        break;
      default:
        break;
    }
  };

  const handleDeleteClick = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    try {
      await deleteAlarm(id);
      const updatedNotifications = notifications.filter(notification => notification.id !== id);
      setNotifications(updatedNotifications);
      setNotificationCount(updatedNotifications.length);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleRemoveAllNotifications = async () => {
    try {
      await deleteAllAlarms();
      setNotifications([]);
      setNotificationCount(0);
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
    }
  };

  const getIcon = (code: string) => {
    switch (code) {
      case 'NOTICE':
        return <FcAdvertising className="w-6 h-6" />;
      case 'DIARY':
        return <FcReading className="w-6 h-6" />;
      case 'ALBUM':
        return <FcPicture className="w-6 h-6" />;
      case 'BUS':
        return <FaBus className="w-5 h-5 text-orange-600" />;
      case 'MEETING':
        return <FcVoicePresentation className="w-6 h-6" />;
      case 'DOCUMENT':
        return <FcContacts className="w-6 h-6" />;
      default:
        return <FaRegBell className="w-6 h-6 text-yellow-600" />;
    }
  };

  return (
    <div className="font-KoPubDotum relative">
      <FaRegBell className="w-6 h-6 text-gray-700 cursor-pointer" onClick={() => setIsModalOpen(!isModalOpen)} />
      {notificationCount > 0 && (
        <div className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white rounded-full text-xs" style={{ transform: 'translate(50%, -50%)' }}>
          {notificationCount}
        </div>
      )}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={() => setIsModalOpen(false)}></div>
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full px-8" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4 mt-8">
              {[...notifications].reverse().map((notification, index) => (
                <div key={notification.id} className="relative">
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    className="flex items-center p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                  >
                    <div className="mr-3">
                      {getIcon(notification.code)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{notification.contents}</div>
                      <div className="text-xs text-gray-600">{formatDate(notification.date)}</div>
                    </div>
                    {/* 삭제 아이콘 */}
                    <div onClick={(e) => handleDeleteClick(notification.id, e)} className="ml-3 text-red-600 hover:text-red-800">
                      <FaTrash className="w-4 h-4" />
                    </div>
                  </div>
                  {index === notifications.length - 1 && (
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleRemoveAllNotifications}
                        className="text-xs text-white bg-gray-500 bg-opacity-70 rounded-full px-3 py-1"
                      >
                        전체 삭제
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
