import React from 'react';
import { useNavigate } from 'react-router-dom';
import AlaramBell from './AlaramBell';


// 나중에 data 타입 다 한곳에 모아서 export 시키기
interface Notification {
  time: string;
  title: string;
  contents: string;
  code: 'NOTICE' | 'DIARY' | 'ALBUM' | 'BUS' |'MEETING' | 'DOCUMENT';
}

const HomeHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const notificationCount = 5;
  const notifications: Notification[] = [
    {
      time: '오후 2:21',
      title: '새 대화 알림',
      contents: '박경림님: 안녕하세요',
      code: 'BUS'
    },
    {
      time: '오후 2:20',
      title: '새 서비스 알림',
      contents: '김다우 사장 [알림] 운영자 확인이 필요한 근태 정보가 있습니다. 근태관리에서 확인하세요.',
      code: 'BUS'
    },
    {
      time: '오후 2:20',
      title: '김다우',
      contents: '[출근완료] 다우오피스에 출근체크 되었습니다.',
      code: 'BUS'
    },
    {
      time: '오후 2:19',
      title: '프로모션 알림',
      contents: '새로운 프로모션이 시작되었습니다. 지금 확인해보세요!',
      code: 'BUS'
    },
    {
      time: '오후 2:18',
      title: '시스템 업데이트',
      contents: '시스템 업데이트가 완료되었습니다. 재로그인 해주세요.',
      code: 'BUS'
    },
  ];

  return (
    <header className="fixed z-10 w-full h-[67px] border-b bg-white border-gray-300 p-4 shadow-md flex items-center justify-between">
      <p
        className="text-[30px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer"
        onClick={handleHomeClick}
      >
        키즈링크
      </p>
      <AlaramBell notificationCount={notificationCount} notifications={notifications} />
    </header>
  );
};

export default HomeHeader;
