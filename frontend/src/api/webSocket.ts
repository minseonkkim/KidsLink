let ws: WebSocket | null = null;
// src/websocket.ts
let intervalId: number | null = null;

export const startWebSocket = (url: string, kindergartenId: number) => {
  const wsUrl = `${url}/${kindergartenId}`;
  ws = new WebSocket(wsUrl);


  ws.onopen = () => {
    console.log('WebSocket connection opened');

    // 서버로 인증 토큰과 kindergartenId를 전송
    ws.send(JSON.stringify({ type: 'authenticate', kindergartenId: kindergartenId }));

    if (navigator.geolocation) {
      const sendLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const data = {
              type: 'location',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              kindergartenId
            };
            console.log('Sending location:', data);
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(data));

            }
          },
          (error) => {
            console.error('Geolocation error:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 20000, 
            maximumAge: 0 
          }
        );
      };
      sendLocation();
      intervalId = window.setInterval(sendLocation, 500);
    }
  };


  ws.onclose = () => {
    console.log('WebSocket connection closed');
    if (intervalId) {
      clearInterval(intervalId);
    }
    ws = null;
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export const stopWebSocket = () => {
  if (ws) {
    ws.send(JSON.stringify({ type: 'disconnect' }));
    ws.close();
  }
  if (intervalId) {
    clearInterval(intervalId);
  }
};


export function receiveBusLocation(wsRef, setLocation, mapRef,busMarkerRef, setIsMoving,busCenterFlag ) {
  const ws = wsRef.current;
  if (!ws) {
    console.error('WebSocket is not initialized');
    return;
  }
  let count = 0;
  let lastCenter = null;
  busCenterFlag.current = false;
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'disconnect') {
      busCenterFlag.current = false
      console.log( busCenterFlag.current)
      if (busMarkerRef.current && lastCenter) {
        busMarkerRef.current.setPosition(lastCenter);
      }

      setIsMoving(false);
    } else {
      console.log('Received location:', ++count, data);
      setLocation({ lat: data.latitude, lng: data.longitude });
      setIsMoving(true);

      const newCenter = new window.kakao.maps.LatLng(data.latitude, data.longitude);
      lastCenter = newCenter;
      const map = mapRef.current;
      if (map&&!busCenterFlag.current&&data.latitude !== undefined && data.longitude !== undefined) {  
        map.setCenter(newCenter)
        busCenterFlag.current = true
      }
      if (busMarkerRef.current) {
        busMarkerRef.current.setPosition(newCenter);
      }
    }
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
    setIsMoving(false);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    setIsMoving(false);
  };

  window.addEventListener('beforeunload', () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  });

  return () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  };
}
