import { GoHome, GoHomeFill } from 'react-icons/go'
import { IoCalendarClearOutline, IoCalendarClear } from 'react-icons/io5'
import { BsCameraVideo, BsCameraVideoFill } from "react-icons/bs";
import { FaRegUser, FaUser } from 'react-icons/fa6'
import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNavbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleScheduleClick = () => {
    navigate('/schedule')
  }

  const handleHomeClick = () => {
    navigate('/')
  }

  const handleMyPageClick = () => {
    navigate('/mypage')
  }

  const handleMeetingClick = () => {
    navigate('/meeting')
  }

  const isCurrentPage = (path: string) => location.pathname === path

  const daramgi = if (1===1) {
    return 1
  }

  const iconColor = '#FFC107'
  return (
    <div className="footer fixed bottom-0 w-full bg-white text-gray-700 h-[60px] flex justify-around items-center shadow-md">
      <div className="footer-item flex flex-col items-center" onClick={handleHomeClick}>
        {isCurrentPage('/') ? (
          <GoHomeFill className="w-7 h-7" style={{ color: iconColor }} />
        ) : (
          <GoHome className="w-7 h-7 text-gray-300" />
        )}
      </div>
      <div className="footer-item flex flex-col items-center" onClick={handleMeetingClick}>
        {isCurrentPage('/meeting') ? (
          <BsCameraVideoFill className="w-7 h-7" style={{ color: iconColor }} />
        ) : (
          <BsCameraVideo className="w-7 h-7 text-gray-300" />
        )}
      </div>
      <div className="footer-item flex flex-col items-center" onClick={handleScheduleClick}>
        {isCurrentPage('/schedule') ? (
          <IoCalendarClear className="w-7 h-7" style={{ color: iconColor }} />
        ) : (
          <IoCalendarClearOutline className="w-7 h-7 text-gray-300" />
        )}
      </div>
      <div className="footer-item flex flex-col items-center" onClick={handleMyPageClick}>
        {isCurrentPage('/mypage') ? (
          <FaUser className="w-6 h-6" style={{ color: iconColor }} />
        ) : (
          <FaRegUser className="w-6 h-6 text-gray-300" />
        )}
      </div>
    </div>
  )
}