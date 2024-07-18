import React from 'react';
import { AiOutlineHome, AiOutlineMessage, AiOutlineUser } from 'react-icons/ai';

const Footer: React.FC = () => {
  return (
    <div className="footer fixed bottom-0 w-full bg-white text-black h-[66px] flex justify-around items-center shadow-md">
      <div className="footer-item flex flex-col items-center">
        <AiOutlineHome className="w-8 h-8 text-gray-700" />
      </div>
      <div className="footer-item flex flex-col items-center">
        <AiOutlineMessage className="w-8 h-8 text-gray-700" />
      </div>
      <div className="footer-item flex flex-col items-center">
        <AiOutlineUser className="w-8 h-8 text-gray-700" />
      </div>
    </div>
  );
};

export default Footer;
