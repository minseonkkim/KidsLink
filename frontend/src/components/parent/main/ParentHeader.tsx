import React from 'react';
import { FaRegBell } from 'react-icons/fa6';

const ParentHeader: React.FC = () => {
  const notificationCount = 5; // 예시로 알림 개수를 5로 설정

  return (
    <header className="header flex items-center justify-between p-4 bg-white shadow-md">
      <p className="text-[30px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">
        키즈링크
      </p>
      <div className="relative">
        <FaRegBell className="w-8 h-8 text-gray-700" />
        <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full text-xs">
          {notificationCount}
        </div>
      </div>
    </header>
  );
};

export default ParentHeader;
