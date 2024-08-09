import { useEffect, useRef, useState } from 'react';
import InfoSection from "../../components/parent/common/InfoSection";
import daramgi from "../../assets/parent/bus-daramgi.png";
import busIcon from '../../assets/parent/driving-daramgi.png';
import currentLocationIcon from '../../assets/parent/marker.png';
import busStopIcon from '../../assets/parent/bus_stop_icon.jpg';
import { receiveBusLocation } from '../../api/webSocket';
import { postKidBoardingStatus, getKidBoardingStatus } from '../../api/bus';
import { getParentInfo } from '../../api/Info';
import { Toggle } from '../../components/parent/bus/Toggle';
import { FaBus } from 'react-icons/fa';
import { MdGpsFixed } from 'react-icons/md';
import { useParentInfoStore } from '../../stores/useParentInfoStore';

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
  const [childId, setChildId] = useState<number | null>(null);
  const mapRef = useRef<any>(null);
  const busMarkerRef = useRef<any>(null);
  const parentMarkerRef = useRef<any>(null);
  const [parentLocation, setParentLocation] = useState<{ latitude?: number, longitude?: number }>({});
  const { parentInfo, setParentInfo } = useParentInfoStore();
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isWebSocketInitialized = useRef<boolean>(false);
  let centerFlag = false;
  const busCenterFlag = useRef<boolean>(false);

  const createMarker = (map, position, imageUrl) => {
    const imageSize = new window.kakao.maps.Size(40, 40);
    const imageOption = { offset: new window.kakao.maps.Point(20, 20) };
    const markerImage = new window.kakao.maps.MarkerImage(imageUrl, imageSize, imageOption);
  
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
    });
  
    marker.setMap(map);
    return marker;
  };
  const initializeMap = () => {
  if (mapRef.current || !mapContainer.current) {
    return;
  }

  const container = mapContainer.current;
  const options = {
    center: new window.kakao.maps.LatLng(location.lat, location.lng),
    level: 3,
  };
  const newMap = new window.kakao.maps.Map(container, options);
  mapRef.current = newMap;

  const initialPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
  const busMarker = createMarker(newMap, initialPosition, busIcon);
  busMarkerRef.current = busMarker;

  const parentInitialPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
  
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
  const parentMarkerInstance = new window.kakao.maps.CustomOverlay({
    position: parentInitialPosition,
    content: overlayContent,
    yAnchor: 0,
    xAnchor: 0,
    zIndex: 1,
  });
  parentMarkerInstance.setMap(newMap);
  parentMarkerRef.current = parentMarkerInstance;
  updateParentLocation(parentMarkerRef);

  // 새로운 마커를 추가합니다
  const newMarkerPosition = new window.kakao.maps.LatLng(35.1911678, 126.8102566);
  createMarker(newMap, newMarkerPosition, busStopIcon);
};

  const initializeWebSocket = async () => {
    console.log('WebSocket init');
    if (isWebSocketInitialized.current) {
      console.log('WebSocket x');
      return;
    }
    isWebSocketInitialized.current = true;

    const kindergartenId = parentInfo.child.kindergartenClass.kindergarten.kindergartenId;
    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/${kindergartenId}`;
    console.log(kindergartenId)
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    receiveBusLocation(wsRef, setLocation, mapRef, busMarkerRef, setIsMoving, busCenterFlag);

    ws.onclose = () => {
      console.log('WebSocket closed');
      isWebSocketInitialized.current = false;
      centerFlag = false;
      busCenterFlag.current = false;
      setIsMoving(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsMoving(false);
    };
  };
  

  useEffect(() => {
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        initializeMap();
        initializeWebSocket();
      });
    };

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
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  const updateParentLocation = (markerRef: React.MutableRefObject<any>) => {
    centerFlag = false
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const parentPosition = new window.kakao.maps.LatLng(latitude, longitude);

        const parentMarker = markerRef.current;
        parentMarker.setPosition(parentPosition);

        setParentLocation({ latitude, longitude });

        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
        intervalIdRef.current = setInterval(() => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              const newParentPosition = new window.kakao.maps.LatLng(latitude, longitude);
              parentMarker.setPosition(newParentPosition);
              setParentLocation({ latitude, longitude });
              const map = mapRef.current;
              
              if (map&&!isMoving&&!centerFlag&&latitude !== undefined && longitude !== undefined) {  
                map.setCenter(newParentPosition);
                centerFlag = true;
              }
              console.log('Parent location updated:', { latitude, longitude });
            },
            (err) => {
              console.error("Error getting location", err);
            },
            {
              enableHighAccuracy: true,
              timeout: 20000, 
              maximumAge: 0 
            }
          );
        }, 500);
      },
      (error) => {
        console.error("Error getting location", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000, 
        maximumAge: 0 
      }
    );
  };

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

  const animateMapToMarker = (map: any, marker: any) => {
    if (marker) {
      const markerPosition = marker.getPosition();
      map.panTo(markerPosition);
    }
  };

  const description1 = "버스가";
  const main1 = isMoving ? "이동 중" : "운행중인 시간이";
  const main2 = isMoving ? " 입니다!" : " 아닙니다";

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
          onClick={() => animateMapToMarker(mapRef.current, parentMarkerRef.current)}
          className="relative bg-white text-red-500 p-2 rounded z-40 rounded-full drop-shadow-lg"
        >
        <MdGpsFixed />
          
        </button>

        <button
          onClick={() => animateMapToMarker(mapRef.current, busMarkerRef.current)}
          className="relative bg-white text-red-500 p-2 rounded z-40 rounded-full drop-shadow-lg"
        >
          <FaBus />
        </button>
      </div>
    </div>
  );
}
