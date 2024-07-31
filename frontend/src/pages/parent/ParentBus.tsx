  import React, { useEffect, useRef, useState } from 'react';
  import CommonHeader from "../../components/parent/common/CommonHeader";
  import InfoSection from "../../components/parent/common/InfoSection";
  import daramgi from "../../assets/parent/bus-daramgi.png";
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
  
            const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
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
    }, []);
    return (
      <div className="min-h-[100dvh] flex flex-col items-center bg-yellow-200">
        <CommonHeader title="버스" />

        <div className="w-full flex flex-col items-center mt-16 flex-grow">
          <InfoSection
            description1="버스가"
            main1="이동 중"
            main2=" 입니다!"
            imageSrc={daramgi}
            altText="다람쥐"
          />

          <div
            className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] px-10 shadow-top flex-grow overflow-hidden animate-slideUp"
            style={{ marginTop: '-40px' }}
          >
            <div 
              ref={mapContainer} 
              className="w-full h-96 relative z-0"
              style={{ backgroundColor: 'white', height: '400px' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
