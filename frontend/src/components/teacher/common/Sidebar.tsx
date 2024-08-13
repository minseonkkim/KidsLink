import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { BiBell } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import ourClassIcon from "../../../assets/teacher/ourclass_btn_img.png";
import scheduleIcon from "../../../assets/teacher/calendar_btn_img.png";
import albumIcon from "../../../assets/teacher/album_btn_img.png";
import busIcon from "../../../assets/teacher/bus_btn_img.png";
import consultingIcon from "../../../assets/teacher/consulting_btn_img.png";
import noticeIcon from "../../../assets/teacher/notice_btn_img.png";
import growthdiaryIcon from "../../../assets/teacher/growthdiary_btn_img.png";
import documentIcon from "../../../assets/teacher/document_btn_img.png";
import useModal from "../../../hooks/teacher/useModal";
import AlertModalContent from "./Header";
import { FiLogOut } from "react-icons/fi";
import { logout } from "../../../api/member";
import useAppStore from "../../../stores/store";
import { TeacherInfoCard } from "./TeacherInfoCard";  // Import the new component

interface Alarm {
  id: number;
  contents: string;
  date: string;
  code: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  handleLinkClick: () => void;
  toggleSidebar: () => void;
  alertNum: number;
  alertList: Alarm[];
  fetchAlarmList: () => Promise<void>;
  fetchAlarmCount: () => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  deleteAllItems: () => Promise<void>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  activeMenu,
  setActiveMenu,
  handleLinkClick,
  toggleSidebar,
  alertNum,
  alertList,
  fetchAlarmList,
  fetchAlarmCount,
  deleteItem,
  deleteAllItems,
}) => {
  const { openModal, Modal, isModalOpen, closeModal } = useModal();
  const navigate = useNavigate();

  const handleAlertClick = async (alert: Alarm) => {
    closeModal();

    if (alert.code === "MEETING") {
      navigate("/meeting/confirm");
    } else if (alert.code === "DOCUMENT") {
      console.log("문서 페이지 이동(알람)")
      navigate("/document");
    }

    await fetchAlarmCount();
  };

  const renderModalContent = () => (
    <AlertModalContent
      alertList={alertList}
      handleAlertClick={handleAlertClick}
      deleteItem={deleteItem}
      deleteAllItems={deleteAllItems}
      closeModal={closeModal}
      fetchAlarmCount={fetchAlarmCount}
    />
  );

  const openAlarmModal = async () => {
    if (!isModalOpen) {
      await fetchAlarmList();
      openModal(renderModalContent());
      await fetchAlarmCount();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      openModal(renderModalContent());
    }
    return () => {
      fetchAlarmCount();
    };
  }, [alertList, isModalOpen, fetchAlarmCount]);

  const setUserType = useAppStore((state) => state.setUserType);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUserType("");
      navigate("/");
    }
  };

  return (
    <>
      <aside
        className={`fixed lg:hidden transition-transform duration-300 bg-white w-full ${
          isSidebarOpen ? "h-full" : "h-[80px]"
        } py-4 top-0 z-50`}
      >
        <div className="flex flex-row justify-between items-center">
          <Link to="/" className="flex items-center pl-8">
            <p className="text-[36px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer whitespace-nowrap">
              키즈링크
            </p>
          </Link>
          <div className="flex flex-row items-center pr-8 space-x-4">
            <div className="relative" onClick={openAlarmModal}>
              <BiBell className="w-[32px] h-[32px] cursor-pointer text-gray-700" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {alertNum}
              </span>
            </div>
            <FiLogOut
              onClick={handleLogout}
              className="w-[29px] h-[29px] mr-10 cursor-pointer text-gray-700"
            />
            {/* <Link to="/mypage">
              <CgProfile className="w-[30px] h-[30px] cursor-pointer text-gray-700" />
            </Link> */}
          </div>
        </div>
        <div
          className={`flex flex-col space-y-2 mt-4 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          {/* 메뉴 아이템들 */}
          <SidebarLink
            to="/"
            icon={ourClassIcon}
            label="우리반보기"
            activeMenu={activeMenu}
            menuKey="ourclass"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/album"
            icon={albumIcon}
            label="사진분류"
            activeMenu={activeMenu}
            menuKey="album"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/bus"
            icon={busIcon}
            label="등하원관리"
            activeMenu={activeMenu}
            menuKey="bus"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/meeting"
            icon={consultingIcon}
            label="화상상담"
            activeMenu={activeMenu}
            menuKey="meeting"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/notice"
            icon={noticeIcon}
            label="알림장"
            activeMenu={activeMenu}
            menuKey="notice"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/growth"
            icon={growthdiaryIcon}
            label="성장일지"
            activeMenu={activeMenu}
            menuKey="growth"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/document"
            icon={documentIcon}
            label="문서관리"
            activeMenu={activeMenu}
            menuKey="document"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/schedule"
            icon={scheduleIcon}
            label="일정관리"
            activeMenu={activeMenu}
            menuKey="schedule"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
        </div>
      </aside>

      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-700 bg-white border border-gray-300 shadow-lg rounded-full transition-shadow duration-300 hover:shadow-xl hover:border-gray-500"
        >
          {isSidebarOpen ? (
            <AiOutlineMenuFold size={24} />
          ) : (
            <AiOutlineMenuUnfold size={24} />
          )}
        </button>
      </div>

      <aside
        className={`hidden lg:block fixed h-full shadow-lg bg-white py-6 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0 w-60" : "translate-x-0 w-0"
        }`}
      >
        <div className="flex flex-col mb-6 transition-opacity duration-300">
          {isSidebarOpen && (
            <>
              <p
                className="text-[36px] mx-6 font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer"
                onClick={() => navigate("/")}
              >
                키즈링크
              </p>
              {/* <div className="mt-4 mx-3">
                <TeacherInfoCard /> 
              </div> */}
            </>
          )}
        </div>

        <div
          className={`flex flex-col space-y-2 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          {/* 메뉴 아이템들 */}
          <SidebarLink
            to="/"
            icon={ourClassIcon}
            label="우리반보기"
            activeMenu={activeMenu}
            menuKey="ourclass"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/album"
            icon={albumIcon}
            label="사진분류"
            activeMenu={activeMenu}
            menuKey="album"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/meeting"
            icon={consultingIcon}
            label="화상상담"
            activeMenu={activeMenu}
            menuKey="meeting"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/bus"
            icon={busIcon}
            label="등하원관리"
            activeMenu={activeMenu}
            menuKey="bus"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/notice"
            icon={noticeIcon}
            label="알림장"
            activeMenu={activeMenu}
            menuKey="notice"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/growth"
            icon={growthdiaryIcon}
            label="성장일지"
            activeMenu={activeMenu}
            menuKey="growth"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/document"
            icon={documentIcon}
            label="문서관리"
            activeMenu={activeMenu}
            menuKey="document"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
          <SidebarLink
            to="/schedule"
            icon={scheduleIcon}
            label="일정관리"
            activeMenu={activeMenu}
            menuKey="schedule"
            setActiveMenu={setActiveMenu}
            handleLinkClick={handleLinkClick}
          />
        </div>
      </aside>

      <Modal />
    </>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
  activeMenu: string;
  menuKey: string;
  setActiveMenu: (menu: string) => void;
  handleLinkClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  activeMenu,
  menuKey,
  setActiveMenu,
  handleLinkClick,
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center py-4 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${
        activeMenu === menuKey
          ? "bg-[#FFF9D7] border-r-8 border-[#FFEC8A]"
          : "hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]"
      }`}
      onClick={() => {
        setActiveMenu(menuKey);
        handleLinkClick();
      }}
    >
      <img src={icon} alt={label} className="w-7 h-7 mr-5" />
      <span
        className={`text-[17px] ${
          activeMenu === menuKey
            ? "font-bold text-gray-800"
            : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};
