import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    kakao: any;
  }
}

interface BusMapProps {
  location: {
    lat: number;
    lng: number;
  };
  busIcon: string;
}

export default function BusMap({ location, busIcon }: BusMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY

    const script = document.createElement('script')
    script.async = true
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`
    document.head.appendChild(script)

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapContainer.current
        if (container) {
          const options = {
            center: new window.kakao.maps.LatLng(location.lat, location.lng),
            level: 3,
          }
          const map = new window.kakao.maps.Map(container, options)

          const imageSize = new window.kakao.maps.Size(64, 69)
          const imageOption = { offset: new window.kakao.maps.Point(27, 69) }

          const markerImage = new window.kakao.maps.MarkerImage(busIcon, imageSize, imageOption)
          const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng)

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
          });
          marker.setMap(map)

          map.relayout()

          const updateMarker = () => {
            const newPosition = new window.kakao.maps.LatLng(location.lat, location.lng)
            marker.setPosition(newPosition)
            map.setCenter(newPosition)
          }

          updateMarker()
        }
      })
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [location, busIcon])

  return (
    <div
      ref={mapContainer}
      className="w-full h-full relative z-0"
      style={{ backgroundColor: 'white', height: 'calc(100vh - 150px)' }}
    ></div>
  )
}
