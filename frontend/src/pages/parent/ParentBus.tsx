import { useEffect, useRef, useState } from 'react';
import InfoSection from "../../components/parent/common/InfoSection";
import daramgi from "../../assets/parent/bus-daramgi.png";
import busIcon from '../../assets/parent/driving-daramgi.png';
import currentLocationIcon from '../../assets/parent/marker.png';
import { receiveBusLocation } from '../../api/webSocket';
import { postKidBoardingStatus, getKidBoardingStatus } from '../../api/bus';
import { getParentInfo } from '../../api/Info';
import { Toggle } from '../../components/parent/bus/Toggle';
import { FaBus } from 'react-icons/fa';
import { MdGpsFixed } from 'react-icons/md';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function ParentBus() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [location, setLocation] = useState<{ lat?: number, lng?: number }>({ lat: 37.5665, lng: 126.9780 });
  const [isBoarding, setIsBoarding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [parentInfo, setParentInfo] = useState(null);
  const [childId, setChildId] = useState<number | null>(null);
  const [parentLocation, setParentLocation] = useState<{ latitude?: number, longitude?: number }>({});

  const [map, setMap] = useState<any>(null);
  const [currentMarker, setCurrentMarker] = useState<any>(null);
  const [busMarker, setBusMarker] = useState<any>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

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
          const newMap = new window.kakao.maps.Map(container, options);
          setMap(newMap);

          const imageSrc = busIcon;
          const imageSize = new window.kakao.maps.Size(60, 95);
          const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

          const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
          const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);

          const busMarkerInstance = new window.kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
          });

          busMarkerInstance.setMap(newMap);
          setBusMarker(busMarkerInstance);

          // 현재 위치 마커 생성
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const parentPosition = new window.kakao.maps.LatLng(latitude, longitude);
              const parentMarkerImage = new window.kakao.maps.MarkerImage(
                currentLocationIcon,
                new window.kakao.maps.Size(30, 30),
                { offset: new window.kakao.maps.Point(15, 15) }
              );

              const parentMarker = new window.kakao.maps.Marker({
                position: parentPosition,
                image: parentMarkerImage,
                map: newMap,
              });

              // 애니메이션 요소 추가
              const overlayContent = document.createElement('div');
              overlayContent.style.position = 'relative';
              overlayContent.style.width = '50px';
              overlayContent.style.height = '50px';

              const pulseRing = document.createElement('div');
              pulseRing.className = 'pulse-ring';
              overlayContent.appendChild(pulseRing);

              const markerIcon = document.createElement('img');
              markerIcon.src = currentLocationIcon;
              markerIcon.style.position = 'absolute';
              markerIcon.style.top = '50%';
              markerIcon.style.left = '50%';
              markerIcon.style.width = '30px';
              markerIcon.style.height = '30px';
              markerIcon.style.transform = 'translate(-50%, -50%)';
              overlayContent.appendChild(markerIcon);

              const customOverlay = new window.kakao.maps.CustomOverlay({
                position: parentPosition,
                content: overlayContent,
                yAnchor: 0.5,
                xAnchor: 0.5,
                zIndex: 1,
              });

              customOverlay.setMap(newMap);

              setParentLocation({ latitude, longitude });
              setCurrentMarker(parentMarker);
              newMap.setCenter(parentPosition);
            },
            (error) => {
              console.error("Error getting location", error);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );

          // WebSocket 연결 설정
          const cleanup = receiveBusLocation(wsRef, setLocation, newMap, busMarkerInstance, setIsMoving);

          wsRef.current = new WebSocket('ws://your-websocket-url'); // 여기에 실제 웹소켓 URL을 사용하세요

          wsRef.current.onopen = () => {
            console.log('WebSocket connected');
            setWsConnected(true);
          };

          wsRef.current.onclose = () => {
            console.log('WebSocket disconnected');
            setWsConnected(false);
          };

          // 컴포넌트 언마운트 시 WebSocket 연결 해제
          return () => {
            if (wsRef.current) {
              wsRef.current.close();
            }
            cleanup();
          };
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

  // 좌표로 지도의 중심을 애니메이션 효과로 이동시키는 함수
  const animateMapToMarker = (map: any, marker: any) => {
    if (marker) {
      const markerPosition = marker.getPosition();
      map.panTo(markerPosition);
    }
  };

  const isLocationDefined = location.lat !== undefined && location.lng !== undefined;
  const description1 = "버스가";
  const main1 = isLocationDefined ? "이동 중" : "운행중인 시간이";
  const main2 = isLocationDefined ? " 입니다!" : " 아닙니다";

  return (
    <div className="flex flex-col h-screen bg-[#FFEC8A]">
      <InfoSection
        description1={description1}
        main1={main1}
        main2={main2}
        imageSrc={daramgi}
        altText="다람쥐"
      />
      <div className="flex flex-col flex-grow overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top animate-slideUp -mt-10">
        <div className="flex flex-row items-center space-x-4">
          <Toggle isOn={isBoarding} toggleHandler={handleToggleChange} />
        </div>
        <div
          ref={mapContainer}
          className="w-full h-full relative z-0 mt-4"
        ></div>
      </div>

      <div className='fixed flex justify-end items-center bottom-20 right-0 gap-4 mr-4'>
        <button
          onClick={() => animateMapToMarker(map, busMarker)}
          className="relative bg-white text-red-500 p-2 rounded z-40 rounded-full drop-shadow-lg"
        >
          <FaBus />
        </button>

        <button
          onClick={() => animateMapToMarker(map, currentMarker)}
          className="relative bg-white text-red-500 p-2 rounded z-40 rounded-full drop-shadow-lg"
        >
          <MdGpsFixed />
        </button>
      </div>
    </div>
  );
}
