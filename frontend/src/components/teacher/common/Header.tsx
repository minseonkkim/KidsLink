import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiBell } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";
import useModal from "../../../hooks/teacher/useModal";
import { CSSTransition } from "react-transition-group";
import { FiLogOut } from "react-icons/fi";
import useAppStore from "../../../stores/store";
import { logout } from "../../../api/member";
import { useTeacherInfoStore } from "../../../stores/useTeacherInfoStore";

interface Alarm {
  id: number;
  contents: string;
  date: string;
  code: string;
}

interface AlertModalProps {
  alertList: Alarm[];
  isModalOpen: boolean;
  handleAlertClick: (alert: Alarm, isDelete?: boolean) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  deleteAllItems: () => Promise<void>;
  closeModal: () => void;
  fetchAlarmCount: () => Promise<void>;
}

const AlertModal: React.FC<AlertModalProps> = ({
  alertList,
  isModalOpen,
  handleAlertClick,
  deleteItem,
  deleteAllItems,
  closeModal,
  fetchAlarmCount,
}) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      in={isModalOpen}
      timeout={300}
      classNames="fade"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div ref={nodeRef} className="lg:w-[430px] w-[320px] max-h-[450px] p-2">
        <div className="flex flex-row justify-between">
          <div className="text-[23px] font-bold mb-4">알림 목록</div>
          {alertList.length > 0 && (
            <button
              className="mb-4 px-3.5 py-2 rounded-lg flex flex-row items-center bg-[#DF6767] text-white"
              onClick={async () => {
                await deleteAllItems();
                closeModal();
                await fetchAlarmCount();
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
                  onClick={() => handleAlertClick(alert)}
                >
                  <div>
                    <p className="text-[17px] mb-[1px]">{alert.contents}</p>
                    <span className="text-[#B8B8B8] text-[13px]">
                      {alert.date}
                    </span>
                  </div>
                  <FaRegTrashAlt
                    className="text-[18px] cursor-pointer"
                    onClick={async (e) => {
                      e.stopPropagation(); // 이벤트 전파 방지
                      await deleteItem(alert.id);
                      await fetchAlarmCount();
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
    </CSSTransition>
  );
};

interface AlertModalContentProps {
  alertList: Alarm[];
  handleAlertClick: (alert: Alarm, isDelete?: boolean) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  deleteAllItems: () => Promise<void>;
  closeModal: () => void;
  fetchAlarmCount: () => Promise<void>;
}

const AlertModalContent: React.FC<AlertModalContentProps> = ({
  alertList,
  handleAlertClick,
  deleteItem,
  deleteAllItems,
  closeModal,
  fetchAlarmCount,
}) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      in={true} // 모달이 열릴 때 항상 true로 설정
      timeout={300}
      classNames="fade"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div ref={nodeRef} className="lg:w-[430px] w-[320px] max-h-[450px] p-2">
        <div className="flex flex-row justify-between">
          <div className="text-[23px] font-bold mb-4">알림 목록</div>
          {alertList.length > 0 && (
            <button
              className="mb-4 px-3.5 py-2 rounded-lg flex flex-row items-center bg-[#DF6767] text-white"
              onClick={async () => {
                await deleteAllItems();
                closeModal();
                await fetchAlarmCount();
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
                  onClick={() => handleAlertClick(alert)}
                >
                  <div>
                    <p className="text-[17px] mb-[1px]">{alert.contents}</p>
                    <span className="text-[#B8B8B8] text-[13px]">
                      {alert.date}
                    </span>
                  </div>
                  <FaRegTrashAlt
                    className="text-[18px] cursor-pointer"
                    onClick={async (e) => {
                      e.stopPropagation(); // 이벤트 전파 방지
                      await deleteItem(alert.id);
                      await fetchAlarmCount();
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
    </CSSTransition>
  );
};

export default AlertModalContent;

interface HeaderProps {
  alertNum: number;
  alertList: Alarm[];
  fetchAlarmList: () => Promise<void>;
  fetchAlarmCount: () => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  deleteAllItems: () => Promise<void>;
  titleComponent: React.ReactNode;
  imageSrc: string;
  activeMenu: string;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  alertNum,
  alertList,
  fetchAlarmList,
  fetchAlarmCount,
  deleteItem,
  deleteAllItems,
  titleComponent,
  imageSrc,
  activeMenu,
  userName
}) => {
  const { openModal, Modal, isModalOpen, closeModal } = useModal();
  const navigate = useNavigate();

  const handleAlertClick = async (alert: Alarm, isDelete: boolean = false) => {
    closeModal();

    // 삭제 작업이 아닌 경우에만 페이지 이동
    if (!isDelete) {
      if (alert.code === "MEETING") {
        navigate("/meeting/confirm");
      } else if (alert.code === "DOCUMENT") {
        navigate("/document");
      }
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

  const getMenuTitle = () => {
    if (activeMenu) {
      return (
        <div className="flex items-center space-x-2">
          {imageSrc && (
            <img
              src={imageSrc}
              alt="다람쥐"
              className="ml-4 w-12 h-16 lg:w-16 lg:h-24 mr-2 object-contain"
            />
          )}
          {titleComponent}
        </div>
      );
    }
  };

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
    <div className="flex justify-between items-center mb-1">
      <h1 className="text-[20px] font-semibold text-[#363636]">
        {getMenuTitle()}
      </h1>
      <div className="fixed top-4 right-8 flex flex-row items-center space-x-4">
        <div className="relative mt-4 mr-1" onClick={openAlarmModal}>
          <BiBell className="w-[32px] h-[32px] cursor-pointer text-gray-700" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {alertNum}
          </span>
        </div>
        <FiLogOut onClick={handleLogout} className="w-[29px] h-[29px] mt-4 mr-10 cursor-pointer text-gray-700"/>

      </div>
      <Modal />
    </div>
  );
};
