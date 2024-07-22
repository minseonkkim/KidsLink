import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const HomeHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const notificationCount = 5;
  const notifications = [
    {
      time: '오후 2:21',
      title: '새 대화 알림',
      content: '박경림님: 안녕하세요',
    },
    {
      time: '오후 2:20',
      title: '새 서비스 알림',
      content: '김다우 사장 [알림] 운영자 확인이 필요한 근태 정보가 있습니다. 근태관리에서 확인하세요.',
    },
    {
      time: '오후 2:20',
      title: '김다우',
      content: '[출근완료] 다우오피스에 출근체크 되었습니다.',
    },
    {
      time: '오후 2:19',
      title: '프로모션 알림',
      content: '새로운 프로모션이 시작되었습니다. 지금 확인해보세요!',
    },
    {
      time: '오후 2:18',
      title: '시스템 업데이트',
      content: '시스템 업데이트가 완료되었습니다. 재로그인 해주세요.',
    },
  ];

  return (
    <header className="fixed w-full h-[67px] border-b bg-white border-gray-300 p-4 shadow-md flex items-center justify-between">
      <p
        className="text-[30px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer"
        onClick={handleHomeClick}
      >
        키즈링크
      </p>
      <NotificationBell notificationCount={notificationCount} notifications={notifications} />
    </header>
  );
};

export default HomeHeader;
