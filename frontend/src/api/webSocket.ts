// src/websocket.ts
let ws: WebSocket | null = null;
let intervalId: number | null = null;

export const startWebSocket = (url: string) => {
  if (ws && ws.readyState !== WebSocket.CLOSED) {
    console.log('WebSocket already open');
    return;
  }

  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log('WebSocket connection opened');

    if (navigator.geolocation) {
      const sendLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const data = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            console.log('Sending location:', data);
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(data));
              console.log('Location sent successfully');
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      };

      sendLocation();
      intervalId = window.setInterval(sendLocation, 1000);
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
    ws.close();
  }
  if (intervalId) {
    clearInterval(intervalId);
  }
};
export function receiveBusLocation(wsRef, setLocation, map, marker) {
  const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
  if (wsRef.current) {
    wsRef.current.close();
  }
  const ws = new WebSocket(WEBSOCKET_URL);
  wsRef.current = ws;
  let count = 0;

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received location:', ++count, data);
    setLocation({ lat: data.latitude, lng: data.longitude });

    const newCenter = new window.kakao.maps.LatLng(data.latitude, data.longitude);
    map.setCenter(newCenter);
    marker.setPosition(newCenter);
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // 브라우저 창이나 탭이 닫힐 때 WebSocket을 닫음
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