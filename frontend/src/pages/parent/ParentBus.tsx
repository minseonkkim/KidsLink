import React, { useEffect, useRef, useState } from 'react';
import busIcon from '../../assets/parent/busIcon.png';
import { receiveBusLocation } from '../../api/webSocket';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function ParentBus() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [location, setLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  const [isBusMoving, setIsBusMoving] = useState(false);
  const [willTakeBus, setWillTakeBus] = useState(false);

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
            image: markerImage, // 이미지 변경
          });
          marker.setMap(map);

          // WebSocket 연결 설정
          const cleanup = receiveBusLocation(wsRef, setLocation, map, marker);

          // 컴포넌트 언마운트 시 WebSocket 연결 해제
          return cleanup;
        }
      });
    };

    return () => {
      document.head.removeChild(script);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [location.lat, location.lng]);

  // Function to handle the button click
  const handleButtonClick = () => {
    setWillTakeBus((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-[#FFEC8A] flex flex-col">
      <div ref={mapContainer} className="flex-grow w-full h-full z-0"></div>

      {/* 문구는 API받는 것 보고 생각하기 */}
      <div className="absolute bottom-16 left-0 w-full bg-white rounded-tl-[20px] rounded-tr-[20px] p-6 z-10 shadow-top">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleButtonClick}
            className={`flex-grow h-12 mr-2 rounded-2xl bg-[#FFEC8A] text-black font-bold`}
          >
            {willTakeBus ? '버스가 이동 중입니다!' : '버스가 정차 중입니다.'}
          </button>
        </div>
        <div className="flex flex-col items-center justify-between">
          <div className="text-lg font-base mb-2">
            {isBusMoving ? "오늘 자녀가 버스에 탑승하지 않습니다." : "오늘 자녀가 버스에 탑승합니다."}
          </div>
        </div>
      </div>
    </div>
  );
}
