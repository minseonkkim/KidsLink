import { useState, useRef, useEffect } from 'react';
import BusChild from "../../components/teacher/bus/BusChild";
import Title from "../../components/teacher/common/Title";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { startWebSocket, stopWebSocket } from '../../api/webSocket';
import { getAllBusStops, postBusStart } from '../../api/bus';
import { getTeacherInfo } from '../../api/Info';
import { useBusStore } from '../../stores/useBusStore';
import { useTeacherInfoStore } from '../../stores/useTeacherInfoStore';
import useModal from "../../hooks/teacher/useModal";
import TeacherLayout from "../../layouts/TeacherLayout";
import daramgi from "../../assets/teacher/bus-daramgi.png"
import LoadingSpinner from '../../components/common/LoadingSpinner';
import shuttlebus from "../../assets/teacher/shuttle.gif";
import '../../index.css'

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

export default function TeacherBus() {
  const { openModal, closeModal, Modal } = useModal();
  const [selectedOption, setSelectedOption] = useState('등원');
  const [currentStopId, setCurrentStopId] = useState<number | null>(null);
  const [busId, setBusId] = useState<number | null>(null);
  const [isWebSocketActive, setIsWebSocketActive] = useState(() => {
    return JSON.parse(localStorage.getItem('isWebSocketActive') || 'false');
  });
  const busStops = useBusStore((state) => state.busStops);
  const setBusStops = useBusStore((state) => state.setBusStops);
  const setAllChecked = useBusStore((state) => state.setAllChecked);
  const { teacherInfo, setTeacherInfo } = useTeacherInfoStore();
  
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [direction, setDirection] = useState('slide-left');

  const containerRef = useRef<HTMLDivElement & { touchStartX?: number }>(null);

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
  
        let stops = await getAllBusStops(kindergartenId);
  
        setBusStops(stops.map(stop => {
          const existingStop = busStops.find(prevStop => prevStop.busStopId === stop.busStopId);
          return {
            ...stop,
            children: stop.children.map(child => {
              const existingChild = existingStop?.children.find(prevChild => prevChild.child.childId === child.child.childId);
              return {
                ...child,
                checked: existingChild ? existingChild.checked : false, // 기존의 checked 값 유지
              };
            }),
          };
        }));
  
        setBusId(stops[0]?.busId || null);

        if (stops.length > 0) {
          setCurrentStopId(stops[0].busStopId);
        }
  
        // 상태를 업데이트하고 나서 useEffect에서 로그를 출력하게끔 설정
        setTimeout(() => {
          setIsPageVisible(true);
        }, 5);
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
  
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [teacherInfo, setTeacherInfo, setBusStops]);

  useEffect(() => {
    if (!isWebSocketActive) {
      setAllChecked(false);
    }
  }, [isWebSocketActive, setAllChecked]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    setAllChecked(false);
  };

  const handlePrevStop = () => {
    if (currentStopId === null) return;
    const currentIndex = busStops.findIndex(stop => stop.busStopId === currentStopId);
    if (currentIndex > 0) {
      setDirection('slide-right'); // 슬라이드 방향 설정
      setCurrentStopId(busStops[currentIndex - 1].busStopId);
    }
  };

  const handleNextStop = () => {
    if (currentStopId === null) return;
    const currentIndex = busStops.findIndex(stop => stop.busStopId === currentStopId);
    if (currentIndex < busStops.length - 1) {
      setDirection('slide-left'); // 슬라이드 방향 설정
      setCurrentStopId(busStops[currentIndex + 1].busStopId);
    }
  };

  const startWebSocketConnection = () => {
    startWebSocket(WEBSOCKET_URL, teacherInfo.kindergartenId, selectedOption);
    setIsWebSocketActive(true);
    localStorage.setItem('isWebSocketActive', 'true');
  };

  const stopWebSocketConnection = () => {
    stopWebSocket();
    setIsWebSocketActive(false);
    localStorage.setItem('isWebSocketActive', 'false');
  };

  if (busStops.length === 0 || currentStopId === null) {
    return <LoadingSpinner/>
  }

  const currentStop = busStops.find(stop => stop.busStopId === currentStopId);

  if (!currentStop) {
    return <div>Invalid bus stop selected.</div>;
  }

  const renderModalContent = (action: '출발' | '도착') => (
    <div className="w-full max-w-md py-3 px-3 bg-white">
      <h2 className="text-2xl font-semibold mb-4">
        {action === '출발' ? '알림' : ''}
      </h2>
      {action === '출발' ? (
        <p className="text-gray-700 mb-6">학부모에게 버스 {action} 알림을 전송하시겠습니까?</p>
      ) : (
        <p className="text-gray-700 mb-6">아이들의 등하원 체크가 모두 완료되었습니까?</p>
      )}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            if (action === '출발') {
              postBusStart(busId);
              startWebSocketConnection();
            } else {
              stopWebSocketConnection();
            }
            closeModal();
          }}
          className="px-4 py-2 border-[2px] border-[#7C7C7C] bg-[#E3EEFF] font-bold rounded-[10px] shadow-md hover:bg-[#D4DDEA] transition duration-300 ease-in-out"
        >
          {action === '출발' ? '전송' : '확인'}
        </button>
        
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-neutral-300 border-[2px] border-[#7C7C7C] text-black font-semibold rounded-lg shadow-md hover:bg-neutral-400 transition duration-300 ease-in-out"
        >
          취소
        </button>
      </div>
    </div>
  );
  
  const openCreateModal = (action: '출발' | '도착') => {
    openModal(renderModalContent(action));
  };

  const handleButtonClick = () => {
    if (isWebSocketActive) {
      openCreateModal('도착');
    } else {
      openCreateModal('출발');
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    containerRef.current!.touchStartX = touch.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current!.touchStartX) return;

    const touch = e.touches[0];
    const touchEndX = touch.clientX;

    const diff = containerRef.current!.touchStartX - touchEndX;

    if (diff > 50) {
      handleNextStop();
      containerRef.current!.touchStartX = undefined;
    } else if (diff < -50) {
      handlePrevStop();
      containerRef.current!.touchStartX = undefined;
    }
  };

  return (
      <TeacherLayout
        activeMenu="bus"
        setActiveMenu={() => {}}
        titleComponent={<Title title="등하원 관리" />}
        imageSrc={daramgi} 
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[360px] lg:w-[420px] h-[200px]">
            {isWebSocketActive ? (
              <img 
                src={shuttlebus} 
                alt="shuttlebus" 
                className="absolute top-[160px] left-1/2 transform -translate-x-1/2 w-[100px] h-auto z-10"
                style={{
                  animation: "moveShuttlebus 3s linear infinite", // 애니메이션을 3초 동안 실행하고 무한 반복
                }} 
              />
            ) : (
              <></>
            )}
            </div>
          </div>
        </div>
        <div className="relative w-full px-4 mt-10 lg:px-12">
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleButtonClick} 
              className="border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA] flex flex-row items-center"
            >
              {isWebSocketActive ? '버스 도착' : '버스 출발'}
            </button>
          </div>

          <div 
            className="flex flex-col lg:flex-row items-center justify-between lg:space-x-4 lg:mt-0 mt-[18px]" 
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div className={`hidden lg:flex w-[210px] h-[330px] ${currentStopId !== busStops[0].busStopId ? 'bg-[#F4F8ED]' : 'bg-transparent'} rounded-[20px] items-center justify-center font-bold text-[22px]`}>
              {currentStopId !== busStops[0].busStopId ? busStops[busStops.findIndex(stop => stop.busStopId === currentStopId) - 1].busStopName : ''}
            </div>
            <MdNavigateBefore className={`hidden lg:block ${currentStopId === busStops[0].busStopId && 'invisible'} text-[50px] text-[#8CAD1E] cursor-pointer`} onClick={handlePrevStop} />
              <div className="bg-[#D5E4B4] rounded-[20px] w-[360px] lg:w-[420px] h-[500px] p-[20px] m-4">
                <p className="font-bold text-[24px] text-center whitespace-nowrap mb-2">{currentStop.busStopName}</p>
                <div className="bg-[#fff] rounded-[10px] w-[320px] lg:w-[380px] h-[420px] m-1 p-1 lg:p-3">
                  <div className="flex flex-row my-1">
                    <div className="flex items-center justify-center font-bold lg:w-[280px] w-[240px]">탑승자</div>
                    <div className="flex items-center justify-center font-bold lg:w-[60px] w-[60px]">탑승여부</div>
                  </div>
                  <div className="relative w-[310px] lg:w-[360px] h-[370px] overflow-auto custom-scrollbar">
                    {currentStop.children.length > 0 ? (
                      currentStop.children.map(({ child, parentTel, status, checked }, idx) => (
                        <BusChild
                          key={idx}
                          busStopId={currentStop.busStopId}
                          childId={child.childId}
                          childName={child.name}
                          parentTel={parentTel}
                          status={status}
                          checked={checked}
                          profile={child.profile}
                        />
                      ))
                    ) : (
                      <div className="absolute top-[30%] left-0 right-0 text-center">
                        <p className="text-[20px] text-gray-500">탑승 인원이 없습니다</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            <MdNavigateNext className={`hidden lg:block ${currentStopId === busStops[busStops.length - 1].busStopId && 'invisible'} text-[50px] text-[#8CAD1E] cursor-pointer`} onClick={handleNextStop} />
            <div className={`hidden lg:flex w-[210px] h-[330px] ${currentStopId !== busStops[busStops.length - 1].busStopId ? 'bg-[#F4F8ED]' : 'bg-transparent'} rounded-[20px] items-center justify-center font-bold text-[22px]`}>
              {currentStopId !== busStops[busStops.length - 1].busStopId ? busStops[busStops.findIndex(stop => stop.busStopId === currentStopId) + 1].busStopName : ''}
            </div>
          </div>
        </div>
        <Modal />
      </TeacherLayout>
  );
}
