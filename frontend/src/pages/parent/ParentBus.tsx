import { useEffect, useRef, useState } from 'react';
import InfoSection from "../../components/parent/common/InfoSection";
import daramgi from "../../assets/parent/bus-daramgi.png";
import busIcon from '../../assets/parent/busIcon.png';
import { receiveBusLocation } from '../../api/webSocket';
import { postKidBoardingStatus, getKidBoardingStatus } from '../../api/bus';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function ParentBus() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [location, setLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  const [isBoarding, setIsBoarding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMoving,setIsMoving] = useState(false);

  useEffect(() => {
    console.log(`isMoving changed: ${isMoving}`);
  }, [isMoving]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapContainer.current;
        if (container) {
          const options = {
            center: new window.kakao.maps.LatLng(location.lat, location.lng),
            level: 3,
          };
          const map = new window.kakao.maps.Map(container, options);

          const imageSrc = busIcon;
          const imageSize = new window.kakao.maps.Size(64, 69);
          const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

          const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
          const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
          });
          marker.setMap(map);

          // WebSocket 연결 설정
          const cleanup = receiveBusLocation(wsRef, setLocation, map, marker,setIsMoving);

          // 컴포넌트 언마운트 시 WebSocket 연결 해제
          return cleanup;
        }
      });
    };

    // 초기 탑승 상태 조회
    const fetchBoardingStatus = async () => {
      setLoading(true);
      try {
        const response = await getKidBoardingStatus(); // childId를 1로 예시
        if (response && response.data && response.data.status !== undefined) {
          setIsBoarding(response.data.status === 'T');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardingStatus();

    return () => {
      document.head.removeChild(script);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleBoardingStatus = async () => {
    setLoading(true);
    try {
      const newStatus = !isBoarding;
      const response = await postKidBoardingStatus(1); // childId를 1로 예시, newStatus 전송
      if (response && response.isBoarding !== undefined) {
        setIsBoarding(response.isBoarding);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFEC8A]">
      <InfoSection
        description1="버스가"
        main1={isMoving ? "이동중 입" : "아직 출발하지 않았습"}
        main2="니다!"
        imageSrc={daramgi}
        altText="다람쥐"
      />

      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-center">
        <button
          onClick={handleBoardingStatus}
          className={`px-4 py-2 rounded-lg ${isBoarding ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-400 hover:bg-orange-700'} text-white font-bold transition duration-200`}
          disabled={loading}
        >
          {loading ? 'Loading...' : isBoarding ? '오늘 버스에 탑승함' : '오늘 버스에 탑승하지 않음'}
        </button>
      </div>

      <div className="flex flex-col flex-grow overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top animate-slideUp -mt-10">
        <div 
          ref={mapContainer} 
          className="w-full h-full relative z-0"
        ></div>
      </div>
    </div>
  )
}