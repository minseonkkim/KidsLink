import React from 'react';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { IoChatbubbleEllipsesOutline, IoChatbubbleEllipsesSharp, IoCalendarClearOutline, IoCalendarClear } from 'react-icons/io5';
import { FaRegUser, FaUser } from 'react-icons/fa6';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScheduleClick = () => {
    navigate('/ParentSchedule');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  const isCurrentPage = (path: string) => location.pathname === path;

  const iconColor = '#FFC107'; // 오렌지 색상

  return (
    <div className="z-40 footer fixed bottom-0 w-full bg-white text-gray-700 h-[66px] flex justify-around items-center shadow-md">
      <div className="footer-item flex flex-col items-center" onClick={handleHomeClick}>
        {isCurrentPage('/') ? (
          <GoHomeFill className="w-8 h-8" style={{ color: iconColor }} />
        ) : (
          <GoHome className="w-8 h-8 text-gray-300" />
        )}
      </div>
      <div className="footer-item flex flex-col items-center">
        {isCurrentPage('/messages') ? (
          <IoChatbubbleEllipsesSharp className="w-8 h-8" style={{ color: iconColor }} />
        ) : (
          <IoChatbubbleEllipsesOutline className="w-8 h-8 text-gray-300" />
        )}
      </div>
      <div className="footer-item flex flex-col items-center" onClick={handleScheduleClick}>
        {isCurrentPage('/ParentSchedule') ? (
          <IoCalendarClear className="w-8 h-8" style={{ color: iconColor }} />
        ) : (
          <IoCalendarClearOutline className="w-8 h-8 text-gray-300" />
        )}
      </div>
      <div className="footer-item flex flex-col items-center" onClick={handleMyPageClick}>
        {isCurrentPage('/mypage') ? (
          <FaUser className="w-7 h-7" style={{ color: iconColor }} />
        ) : (
          <FaRegUser className="w-7 h-7 text-gray-300" />
        )}
      </div>
    </div>
  );
};

export default Footer;
