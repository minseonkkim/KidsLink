import React, { useState, useRef, useEffect } from 'react';
import BusChild from "../../components/teacher/bus/BusChild";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { startWebSocket, stopWebSocket } from '../../api/webSocket';
import { getAllBusStops } from '../../api/bus'; // 함수가 정의된 파일에서 import
import { useBusStore } from '../../stores/useBusStore'
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

export default function TeacherBus() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('등원');
  const [currentStopId, setCurrentStopId] = useState<number | null>(null);
  const [isWebSocketActive, setIsWebSocketActive] = useState(() => {
    return JSON.parse(localStorage.getItem('isWebSocketActive') || 'false');
  });
  const busStops = useBusStore((state) => state.busStops);
  const setBusStops = useBusStore((state) => state.setBusStops);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        const stops = await getAllBusStops(1); // kindergartenId를 실제 유치원 ID로 교체
        // checked 필드를 추가하여 초기화
        const stopsWithChecked = stops.map(stop => ({
          ...stop,
          children: stop.children.map(child => ({ ...child, checked: false })),
        }));
        setBusStops(stopsWithChecked);
        if (stopsWithChecked.length > 0) {
          setCurrentStopId(stopsWithChecked[0].busStopId); // 첫 번째 정류장을 초기값으로 설정
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
  }, []);

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

  return (
    <>
      <TeacherHeader />
      <div className="mt-[120px] px-[150px]">
        <NavigateBack backPage="홈" backLink='/' />
        <Title title="등하원관리" />
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
              <div className="w-[360px] h-[370px] overflow-auto custom-scrollbar">
                {currentStop.children.map(({ childName, parentTel, status, checked }, idx) => (
                  <BusChild key={idx} busStopId={currentStop.busStopId} childName={childName} parentTel={parentTel} status={status} checked={checked} />
                ))}
              </div>
            </div>
          </div>
          <MdNavigateNext className={`${currentStopId === busStops[busStops.length - 1].busStopId && 'invisible'} text-[50px] text-[#8CAD1E] cursor-pointer`} onClick={handleNextStop} />
          <div className={`w-[210px] h-[330px] ${currentStopId !== busStops[busStops.length - 1].busStopId ? 'bg-[#F4F8ED]' : 'bg-transparent'} rounded-[20px] flex items-center justify-center font-bold text-[24px]`}>
            {currentStopId !== busStops[busStops.length - 1].busStopId ? busStops[busStops.findIndex(stop => stop.busStopId === currentStopId) + 1].busStopName : ''}
          </div>
        </div>
        <button onClick={isWebSocketActive ? stopWebSocketConnection : startWebSocketConnection} className="mt-4 bg-blue-500 text-white p-2 rounded">
          {isWebSocketActive ? 'Stop WebSocket' : 'Start WebSocket'}
        </button>
      </div>
    </>
  );
}
