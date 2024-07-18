import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // react-icons에서 아이콘 가져오기
import { FaRegBell } from 'react-icons/fa6';

interface CommonHeaderProps {
  title: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 뒤로가기
  };

  const notificationCount = 5; // 예시로 알림 개수를 5로 설정

  return (
    <div className="header relative flex items-center justify-between bg-[#ffec8a] p-4 shadow-md">
      <button onClick={handleBack} className="flex items-center justify-center w-10 h-10">
        <FaArrowLeft className="w-6 h-6  text-gray-700" />
      </button>
      <p className="text-[22px] font-bold text-[#212121]">
        {title}
      </p>
      <div className="relative">
        <FaRegBell className="w-8 h-8 text-gray-700" />
        <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full text-xs">
          {notificationCount}
        </div>
      </div>
    </div>
  );
};

export default CommonHeader;
