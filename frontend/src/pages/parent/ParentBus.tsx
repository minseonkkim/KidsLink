import { useEffect, useRef, useState } from 'react';
import InfoSection from "../../components/parent/common/InfoSection";
import daramgi from "../../assets/parent/bus-daramgi.png";
import busIcon from '../../assets/parent/busIcon.png';
import { receiveBusLocation } from '../../api/webSocket';
import { postKidBoardingStatus, getKidBoardingStatus } from '../../api/bus';
import { getParentInfo } from '../../api/Info';
import { Toggle } from '../../components/parent/bus/Toggle';

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
  const [isMoving, setIsMoving] = useState(false);
  const [parentInfo, setParentInfo] = useState(null);
  const [childId, setChildId] = useState<number | null>(null);

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
          const cleanup = receiveBusLocation(wsRef, setLocation, map, marker, setIsMoving);

          // 컴포넌트 언마운트 시 WebSocket 연결 해제
          return cleanup;
        }
      });
    };

    // 초기 탑승 상태 조회
    const fetchBoardingStatus = async () => {
      setLoading(true);
      try {
        const fetchedParentInfo = await getParentInfo();
        setParentInfo(fetchedParentInfo);
        const currentChildId = fetchedParentInfo.child.childId;
        setChildId(currentChildId);

        const response = await getKidBoardingStatus(currentChildId);
        if (response) {
          setIsBoarding(response.status === 'T');
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
    try {
      await postKidBoardingStatus(childId);
      const response = await getKidBoardingStatus(childId);
      if (response) {
        setIsBoarding(response.status === 'T');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = async () => {
    if (loading) return;
    const newStatus = !isBoarding;
    setIsBoarding(newStatus);
    await handleBoardingStatus();
  };

  const getNowLocation = () => {
    
  }

  return (
    <div className="flex flex-col h-screen bg-[#FFEC8A]">
      <InfoSection
        description1="버스가"
        main1="이동 중"
        main2=" 입니다!"
        imageSrc={daramgi}
        altText="다람쥐"
      />
      <div className="flex flex-col flex-grow overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top animate-slideUp -mt-10">
        <Toggle isOn={isBoarding} toggleHandler={handleToggleChange} />
        <button>위치 갱신하기</button>
        <div
          ref={mapContainer}
          className="w-full h-full relative z-0 mt-4"
        ></div>
      </div>
    </div>
  );
}
