import React from 'react';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { IoChatbubbleEllipsesOutline, IoChatbubbleEllipsesSharp, IoCalendarClearOutline, IoCalendarClear } from 'react-icons/io5';
import { FaRegUser, FaUser } from 'react-icons/fa6';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScheduleClick = () => {
    navigate('/schedule');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  const isCurrentPage = (path: string) => location.pathname === path;

  const iconColor = '#FFC107'; 
  return (
    <div className="z-40 footer fixed bottom-0 w-full bg-white text-gray-700 h-[60px] flex justify-around items-center shadow-md">
      <div className="footer-item flex flex-col items-center" onClick={handleHomeClick}>
        {isCurrentPage('/') ? (
          <GoHomeFill className="w-[32px] h-[32px]" style={{ color: iconColor }} />
        ) : (
          <GoHome className="w-[32px] h-[32px] text-gray-300" />
        )}
      </div>
      <div className="footer-item flex flex-col items-center">
        {isCurrentPage('/messages') ? (
          <IoChatbubbleEllipsesSharp className="w-[32px] h-[32px]" style={{ color: iconColor }} />
        ) : (
          <IoChatbubbleEllipsesOutline className="w-[32px] h-[32px] text-gray-300" />
        )}
      </div>
      <div className="footer-item flex flex-col items-center" onClick={handleScheduleClick}>
        {isCurrentPage('/schedule') ? (
          <IoCalendarClear className="w-[32px] h-[32px]" style={{ color: iconColor }} />
        ) : (
          <IoCalendarClearOutline className="w-[32px] h-[32px] text-gray-300" />
        )}
      </div>
      <div className="footer-item flex flex-col items-center" onClick={handleMyPageClick}>
        {isCurrentPage('/mypage') ? (
          <FaUser className="w-[30px] h-[30px]" style={{ color: iconColor }} />
        ) : (
          <FaRegUser className="w-[30px] h-[30px] text-gray-300" />
        )}
      </div>
    </div>
  );
};