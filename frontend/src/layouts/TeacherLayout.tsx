import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { BiBell } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import useModal from "../hooks/teacher/useModal";
import { deleteAlarm, deleteAllAlarms, getAlarmCount, getAllAlarms } from "../api/alarm";
import growthdiaryIcon from "../assets/teacher/growthdiary_btn_img.png";
import noticeIcon from "../assets/teacher/notice_btn_img.png";
import albumIcon from "../assets/teacher/album_btn_img.png";
import documentIcon from "../assets/teacher/document_btn_img.png";
import busIcon from "../assets/teacher/bus_btn_img.png";
import consultingIcon from "../assets/teacher/consulting_btn_img.png";
import ourClassIcon from "../assets/teacher/ourclass_btn_img.png";
import scheduleIcon from "../assets/teacher/calendar_btn_img.png";

interface Alarm {
  id: number;
  contents: string;
  date: string;
  code: string;
}

export default function TeacherLayout({ children, activeMenu, setActiveMenu, titleComponent, imageSrc }: any) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // LG 이하에서 기본적으로 숨김
  const { openModal, closeModal, Modal, isModalOpen } = useModal();
  const [alertList, setAlertList] = useState<Alarm[]>([]);
  const [alertNum, setAlertNum] = useState(0);

  const fetchAlarmList = async () => {
    const fetchedAlarmList = await getAllAlarms();
    const sortedAlarmList = fetchedAlarmList.sort((a, b) => b.id - a.id);
    setAlertList(sortedAlarmList);
  };

  const fetchAlarmCount = async () => {
    setAlertNum(await getAlarmCount());
  };

  useEffect(() => {
    fetchAlarmList();
    fetchAlarmCount();
  }, []);

  const deleteItem = async (id: number) => {
    await deleteAlarm(id);
    await fetchAlarmList();
    await fetchAlarmCount();
  };

  const deleteAllItems = async () => {
    await deleteAllAlarms();
    await fetchAlarmList();
    await fetchAlarmCount();
  };

  const navigate = useNavigate();

  const renderModalContent = useCallback(
    () => (
      <div className="lg:w-[430px] w-[320px] max-h-[450px] p-2">
        <div className="flex flex-row justify-between">
          <div className="text-[23px] font-bold mb-4">알림 목록</div>
          {alertList.length > 0 && (
            <button
              className="mb-4 px-3.5 py-2 rounded-lg flex flex-row items-center bg-[#DF6767] text-white"
              onClick={async () => {
                await deleteAllItems();
              }}
            >
              <FaRegTrashAlt className="mr-2 text-[16px] font-bold" />
              전체 삭제
            </button>
          )}
        </div>
        <div>
          {alertList.length > 0 ? (
            <div className="custom-scrollbar max-h-[380px] overflow-y-auto">
              {alertList.map((alert, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center my-5 cursor-pointer mr-3"
                  onClick={() => {
                    if (alert.code === "MEETING") {
                      navigate('/meeting/confirm');
                    } else if (alert.code === "DOCUMENT") {
                      navigate('/document');
                    }
                  }}
                >
                  <div>
                    <p className="text-[17px] mb-[1px]">{alert.contents}</p>
                    <span className="text-[#B8B8B8] text-[13px]">{alert.date}</span>
                  </div>
                  <FaRegTrashAlt
                    className="text-[18px] cursor-pointer"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await deleteItem(alert.id);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>알림이 없습니다.</p>
          )}
        </div>
      </div>
    ),
    [alertList, navigate]
  );

  const openAlarmModal = async () => {
    await fetchAlarmList();
    openModal(renderModalContent());
    await fetchAlarmCount();
  };

  useEffect(() => {
    if (isModalOpen) {
      openModal(renderModalContent());
    }
    return () => {
      fetchAlarmCount();
    };
  }, [alertList, isModalOpen]);

  const getMenuTitle = () => {
    if (activeMenu === 'ourclass') {
      return (
        <div className="flex items-center space-x-2">
          {imageSrc && <img src={imageSrc} alt="다람쥐" className="ml-4 w-12 h-16 lg:w-16 lg:h-24 mr-2 object-contain" />}
          {titleComponent}
        </div>
      );
    } else if (activeMenu === 'schedule') {
      return (
        <div className="flex items-center space-x-2">
          {imageSrc && <img src={imageSrc} alt="다람쥐" className="ml-4 w-12 h-16 lg:w-16 lg:h-24 mr-2 object-contain" />}
          {titleComponent}
        </div>
      );
    } else if (activeMenu === 'album') {
      return (
        <div className="flex items-center space-x-2">
          {imageSrc && <img src={imageSrc} alt="다람쥐" className="ml-4 w-12 h-16 lg:w-16 lg:h-24 mr-1 object-contain" />}
          {titleComponent}
        </div>
      );
    } else if (activeMenu === 'meeting') {
      return (
        <div className="flex items-center space-x-2">
          {imageSrc && <img src={imageSrc} alt="다람쥐" className="ml-4 w-12 h-16 lg:w-16 lg:h-24 mr-2 object-contain" />}
          {titleComponent}
        </div>
      );
    } else if (activeMenu === 'notice') {
      return (
        <div className="flex items-center space-x-2">
          {imageSrc && <img src={imageSrc} alt="다람쥐" className="ml-4 w-12 h-16 lg:w-16 lg:h-24 mr-2 object-contain" />}
          {titleComponent}
        </div>
      );
    } else if (activeMenu === 'growth') {
      return (
        <div className="flex items-center space-x-2">
          {imageSrc && <img src={imageSrc} alt="다람쥐" className="ml-4 w-12 h-16 lg:w-16 lg:h-24 mr-2 object-contain" />}
          {titleComponent}
        </div>
      );
    } else if (activeMenu === 'document') {
      return (
        <div className="flex items-center space-x-2">
          {imageSrc && <img src={imageSrc} alt="다람쥐" className="ml-4 w-12 h-16 lg:w-16 lg:h-24 mr-2 object-contain" />}
          {titleComponent}
        </div>
      );
    } else if (activeMenu === 'bus') {
      return (
        <div className="flex items-center space-x-2">
          {imageSrc && <img src={imageSrc} alt="다람쥐" className="ml-4 w-12 h-16 lg:w-16 lg:h-24 mr-2 object-contain" />}
          {titleComponent}
        </div>
      );
    } else if (activeMenu === 'mypage') {
      return (
        <div className="flex items-center space-x-2">
          {imageSrc && <img src={imageSrc} alt="다람쥐" className="ml-4 w-12 h-16 lg:w-16 lg:h-24 mr-2 object-contain" />}
          {titleComponent}
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex min-h-screen overflow-hidden">
        {/* LG 이하일 때 사이드바 */}
        <aside className={`fixed lg:hidden transition-transform duration-300 bg-white w-full py-6 ${isSidebarOpen ? "translate-y-0" : "-translate-y-full"} top-0 z-50`}>
          <Link to="/" className="flex items-center mb-8 pl-8">
            <p className="text-[36px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p>
          </Link>
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'ourclass' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('ourclass')}
            >
              <img src={ourClassIcon} alt="우리반보기" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'ourclass' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>우리반보기</span>
            </Link>

            <Link
              to="/schedule"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'schedule' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('schedule')}
            >
              <img src={scheduleIcon} alt="일정관리" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'schedule' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>일정관리</span>
            </Link>

            <Link
              to="/album"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'album' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('album')}
            >
              <img src={albumIcon} alt="사진분류" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'album' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>사진분류</span>
            </Link>

            <Link
              to="/bus"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'bus' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('bus')}
            >
              <img src={busIcon} alt="등하원관리" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'bus' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>등하원관리</span>
            </Link>

            <Link
              to="/meeting"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'meeting' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('meeting')}
            >
              <img src={consultingIcon} alt="화상상담" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'meeting' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>화상상담</span>
            </Link>

            <Link
              to="/notice"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'notice' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('notice')}
            >
              <img src={noticeIcon} alt="알림장" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'notice' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>알림장</span>
            </Link>

            <Link
              to="/growth"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'growth' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('growth')}
            >
              <img src={growthdiaryIcon} alt="성장일지" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'growth' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>성장일지</span>
            </Link>

            <Link
              to="/document"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'document' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('document')}
            >
              <img src={documentIcon} alt="문서관리" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'document' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>문서관리</span>
            </Link>
          </div>
        </aside>

        {/* lg 이하일 때 사이드바 토글 버튼 */}
        <div className="fixed lg:hidden top-4 left-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-700 bg-white border border-gray-300 shadow-lg rounded-full transition-shadow duration-300 hover:shadow-xl hover:border-gray-500"
          >
            {isSidebarOpen ? <AiOutlineMenuFold size={24} /> : <AiOutlineMenuUnfold size={24} />}
          </button>
        </div>

        {/* lg 이상일 때 사이드바 */}
        <aside className={`hidden lg:block fixed h-full shadow-lg w-60 bg-white py-6`}>
          <Link to="/" className="flex items-center mb-8 pl-8">
            <p className="text-[36px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p>
          </Link>
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'ourclass' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('ourclass')}
            >
              <img src={ourClassIcon} alt="우리반보기" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'ourclass' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>우리반보기</span>
            </Link>

            <Link
              to="/schedule"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'schedule' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('schedule')}
            >
              <img src={scheduleIcon} alt="일정관리" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'schedule' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>일정관리</span>
            </Link>

            <Link
              to="/album"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'album' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('album')}
            >
              <img src={albumIcon} alt="사진분류" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'album' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>사진분류</span>
            </Link>

            <Link
              to="/bus"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'bus' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('bus')}
            >
              <img src={busIcon} alt="등하원관리" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'bus' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>등하원관리</span>
            </Link>

            <Link
              to="/meeting"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'meeting' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('meeting')}
            >
              <img src={consultingIcon} alt="화상상담" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'meeting' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>화상상담</span>
            </Link>

            <Link
              to="/notice"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'notice' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('notice')}
            >
              <img src={noticeIcon} alt="알림장" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'notice' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>알림장</span>
            </Link>

            <Link
              to="/growth"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'growth' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('growth')}
            >
              <img src={growthdiaryIcon} alt="성장일지" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'growth' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>성장일지</span>
            </Link>

            <Link
              to="/document"
              className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'document' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`}
              onClick={() => setActiveMenu('document')}
            >
              <img src={documentIcon} alt="문서관리" className="w-8 h-8 mr-5" />
              <span className={`text-[17px] ${activeMenu === 'document' ? 'font-bold text-gray-800' : 'text-gray-700'}`}>문서관리</span>
            </Link>
          </div>
        </aside>

        {/* lg 이상일 때 사이드바 토글 버튼 */}
        <div className="fixed bottom-4 left-4 lg:block hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-700 bg-white border border-gray-300 shadow-lg rounded-full transition-shadow duration-300 hover:shadow-xl hover:border-gray-500"
          >
            {isSidebarOpen ? <AiOutlineMenuFold size={24} /> : <AiOutlineMenuUnfold size={24} />}
          </button>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <main className={`flex-1 p-8 min-h-screen max-h-screen bg-[#F5F5F5] overflow-hidden lg:ml-60`}>
          {/* 헤더와 페이지 타이틀 영역 */}
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-[20px] font-semibold text-[#363636]">{getMenuTitle()}</h1>
            <div className="fixed top-4 right-8 flex items-center space-x-4">
              <div className="relative mt-4 mr-1" onClick={() => openAlarmModal()}>
                <BiBell className="w-[32px] h-[32px] cursor-pointer text-gray-700" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {alertNum}
                </span>
              </div>
              <Link to='/mypage'>
                <CgProfile className="mt-4 mr-4 w-[30px] h-[30px] cursor-pointer text-gray-700" />
              </Link>
            </div>
          </div>

          {/* 흰색 박스에 들어갈 페이지 콘텐츠 */}
          <div className="bg-white shadow-lg rounded-lg p-6 h-full overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
      <Modal />
    </>
  );
}
