import { useState, useRef, useEffect } from 'react';
import BusChild from "../../components/teacher/bus/BusChild";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { startWebSocket, stopWebSocket } from '../../api/webSocket';
import { getAllBusStops, postBusStart } from '../../api/bus';
import { getTeacherInfo } from '../../api/Info';
import { useBusStore } from '../../stores/useBusStore';
import { useTeacherInfoStore } from '../../stores/useTeacherInfoStore'; 
import useModal from "../../hooks/teacher/useModal.tsx";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

export default function TeacherBus() {
  const { openModal, closeModal, Modal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('등원');
  const [currentStopId, setCurrentStopId] = useState<number | null>(null);
  const [busId, setBusId] = useState<number | null>(null);
  const [isWebSocketActive, setIsWebSocketActive] = useState(() => {
    return JSON.parse(localStorage.getItem('isWebSocketActive') || 'false');
  });
  const busStops = useBusStore((state) => state.busStops);
  const setBusStops = useBusStore((state) => state.setBusStops);
  const { teacherInfo, setTeacherInfo } = useTeacherInfoStore();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        let kindergartenId;
        
        if (teacherInfo) {
          kindergartenId = teacherInfo.kindergartenId;
        } else {
          const fetchedTeacherInfo = await getTeacherInfo();
          setTeacherInfo(fetchedTeacherInfo);
          kindergartenId = fetchedTeacherInfo.kindergartenId;
        }
        
        const stops = await getAllBusStops(kindergartenId);
        const stopsWithChecked = stops.map(stop => ({
          ...stop,
          children: stop.children.map(child => ({ ...child, checked: false })),
        }));
        setBusStops(stopsWithChecked);
        setBusId(stops[0].busId);

        if (stopsWithChecked.length > 0) {
          setCurrentStopId(stopsWithChecked[0].busStopId); 
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBusStops();

    const handleUnload = () => {
      localStorage.removeItem('isWebSocketActive');
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('unload', handleUnload);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('beforeunload', handleUnload);
      window.addEventListener('unload', handleUnload);
    };
  }, [teacherInfo, setTeacherInfo]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const handlePrevStop = () => {
    if (currentStopId === null) return;
    const currentIndex = busStops.findIndex(stop => stop.busStopId === currentStopId);
    if (currentIndex > 0) {
      setCurrentStopId(busStops[currentIndex - 1].busStopId);
    }
  };

  const handleNextStop = () => {
    if (currentStopId === null) return;
    const currentIndex = busStops.findIndex(stop => stop.busStopId === currentStopId);
    if (currentIndex < busStops.length - 1) {
      setCurrentStopId(busStops[currentIndex + 1].busStopId);
    }
  };

  const startWebSocketConnection = () => {
    startWebSocket(WEBSOCKET_URL);
    setIsWebSocketActive(true);
    localStorage.setItem('isWebSocketActive', 'true');
  };

  const stopWebSocketConnection = () => {
    stopWebSocket();
    setIsWebSocketActive(false);
    localStorage.setItem('isWebSocketActive', 'false');
  };

  if (busStops.length === 0 || currentStopId === null) {
    return <div>Loading...</div>;
  }

  const currentStop = busStops.find(stop => stop.busStopId === currentStopId);

  if (!currentStop) {
    return <div>Invalid bus stop selected.</div>;
  }

  const renderModalContent = () => (
    <div className="w-full max-w-md py-3 px-3 bg-white">
      <h2 className="text-2xl font-semibold mb-4">알림</h2>
      <p className="text-gray-700 mb-6">학부모에게 버스 출발 알림을 전송하시겠습니까?</p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            postBusStart(busId)
            startWebSocketConnection();
            closeModal();
          }}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          확인
        </button>
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out"
        >
          취소
        </button>
      </div>
    </div>
  );

  const openCreateModal = () => {
    openModal(renderModalContent());
  };

  const handleButtonClick = () => {
    if (isWebSocketActive) {
      stopWebSocketConnection();
    } else {
      openCreateModal();
    }
  };

  return (
    <>
      <TeacherHeader />
      <div className="mt-[120px] px-[150px]">
        <NavigateBack backPage="홈" backLink='/' />
        <Title title="등하원관리" />
        <button onClick={handleButtonClick} className="absolute top-[125px] right-[150px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA] flex flex-row items-center">
          {isWebSocketActive ? '버스 도착' : '버스 출발'}
        </button>

        <div className="absolute top-[180px] left-[150px] rounded-[10px] border-[1px] border-[#7C7C7C] w-[86px]">
          <button className="text-[18px] flex flex-row items-center justify-center p-2" onClick={toggleDropdown}>
            <IoMdArrowDropdown className="text-[18px] mr-2" />{selectedOption}
          </button>
          {isOpen && (
            <div className="absolute left-0 mt-1 w-[86px] rounded-[10px] border-[1px] border-[#7C7C7C] bg-white" ref={dropdownRef}>
              <div className="py-1" role="none">
                <a href="#" className="text-[18px] block px-4 py-2 text-sm text-center text-gray-700" role="menuitem" onClick={() => handleOptionClick('등원')}>등원</a>
                <a href="#" className="text-[18px] block px-4 py-2 text-sm text-center text-gray-700" role="menuitem" onClick={() => handleOptionClick('하원')}>하원</a>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className={`w-[210px] h-[330px] ${currentStopId !== busStops[0].busStopId ? 'bg-[#F4F8ED]' : 'bg-transparent'} rounded-[20px] flex items-center justify-center font-bold text-[24px]`}>
            {currentStopId !== busStops[0].busStopId ? busStops[busStops.findIndex(stop => stop.busStopId === currentStopId) - 1].busStopName : ''}
          </div>
          <MdNavigateBefore className={`${currentStopId === busStops[0].busStopId && 'invisible'} text-[50px] text-[#8CAD1E] cursor-pointer`} onClick={handlePrevStop} />
          <div className="bg-[#D5E4B4] rounded-[20px] w-[420px] h-[510px] p-[20px] m-4">
            <p className="font-bold text-[24px] text-center mb-3">{currentStop.busStopName}</p>
            <div className="bg-[#fff] rounded-[10px] w-[380px] h-[420px] m-1 p-3">
              <div className="flex flex-row my-1">
                <div className="flex items-center justify-center font-bold w-[280px]">탑승자</div>
                <div className="flex items-center justify-center font-bold w-[60px]">탑승여부</div>
              </div>
              <div className="relative w-[360px] h-[370px] overflow-auto custom-scrollbar">
                {currentStop.children.length > 0 ? (
                  currentStop.children.map(({ childName, parentTel, status, checked }, idx) => (
                    <BusChild key={idx} busStopId={currentStop.busStopId} childName={childName} parentTel={parentTel} status={status} checked={checked} />
                  ))
                ) : (
                  <div className="absolute top-[30%] left-0 right-0 text-center">
                    <p className="text-[20px] text-gray-500">탑승 인원이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <MdNavigateNext className={`${currentStopId === busStops[busStops.length - 1].busStopId && 'invisible'} text-[50px] text-[#8CAD1E] cursor-pointer`} onClick={handleNextStop} />
          <div className={`w-[210px] h-[330px] ${currentStopId !== busStops[busStops.length - 1].busStopId ? 'bg-[#F4F8ED]' : 'bg-transparent'} rounded-[20px] flex items-center justify-center font-bold text-[24px]`}>
            {currentStopId !== busStops[busStops.length - 1].busStopId ? busStops[busStops.findIndex(stop => stop.busStopId === currentStopId) + 1].busStopName : ''}
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
}
