import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AlaramBell from './AlaramBell';

interface CommonHeaderProps {
  title: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 뒤로가기
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
    <div className="z-50 fixed w-full h-[67px] border-b bg-white border-gray-300 p-4 shadow-md flex items-center justify-between">
      <button onClick={handleBack} className="flex items-center justify-center w-10 h-10">
        <FaArrowLeft className="w-6 h-6  text-gray-700" />
      </button>
      <p className="text-[22px] font-bold text-[#212121]">
        {title}
      </p>
      <AlaramBell notificationCount={notificationCount} notifications={notifications} />
    </div>
  );
};

export default CommonHeader;
