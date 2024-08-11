import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiBell } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import useModal from "../../../hooks/teacher/useModal";
import { FaRegTrashAlt } from "react-icons/fa";

interface Alarm {
  id: number;
  contents: string;
  date: string;
  code: string;
}

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
}) => {
  const { openModal, isModalOpen } = useModal();
  const navigate = useNavigate();

  const renderModalContent = React.useCallback(
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
                      navigate("/meeting/confirm");
                    } else if (alert.code === "DOCUMENT") {
                      navigate("/document");
                    }
                  }}
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
    [alertList, navigate, deleteItem, deleteAllItems]
  );

  const openAlarmModal = async () => {
    await fetchAlarmList();
    openModal(renderModalContent());
    await fetchAlarmCount();
  };

  React.useEffect(() => {
    if (isModalOpen) {
      openModal(renderModalContent());
    }
    return () => {
      fetchAlarmCount();
    };
  }, [alertList, isModalOpen]);

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

  return (
    <div className="flex justify-between items-center mb-1">
      <h1 className="text-[20px] font-semibold text-[#363636]">
        {getMenuTitle()}
      </h1>
      <div className="fixed top-4 right-8 flex items-center space-x-4">
        <div className="relative mt-4 mr-1" onClick={() => openAlarmModal()}>
          <BiBell className="w-[32px] h-[32px] cursor-pointer text-gray-700" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {alertNum}
          </span>
        </div>
        <Link to="/mypage">
          <CgProfile className="mt-4 mr-4 w-[30px] h-[30px] cursor-pointer text-gray-700" />
        </Link>
      </div>
    </div>
  );
};
