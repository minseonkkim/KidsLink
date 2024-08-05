import { useEffect, useRef, useState } from 'react'
import InfoSection from '../../components/parent/common/InfoSection'
import BusMap from '../../components/parent/bus/BusMap'
import busIcon from '../../assets/parent/busIcon.png'
import { receiveBusLocation } from '../../api/webSocket'
import { postKidBoardingStatus } from '../../api/bus'
import daramgi from '../../assets/parent/bus-daramgi.png'

declare global {
  interface Window {
    kakao: any;
  }
}

export default function ParentBus() {
  const wsRef = useRef<WebSocket | null>(null)
  const [location, setLocation] = useState({ lat: 37.5665, lng: 126.9780 })
  const [isBoarding, setIsBoarding] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cleanup = receiveBusLocation(wsRef, setLocation)

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const handleBoardingStatus = async () => {
    setLoading(true)
    try {
      const response = await postKidBoardingStatus(1); // childId를 1로 예시
      setIsBoarding(response.isBoarding) // 서버 응답에 맞게 수정 필요
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#FFEC8A]">
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-center">
        <button
          onClick={handleBoardingStatus}
          className={`px-4 py-2 rounded-lg ${isBoarding ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-400 hover:bg-orange-700'} text-white font-bold transition duration-200`}
          disabled={loading}
        >
          {loading ? 'Loading...' : isBoarding ? '탑승 중' : '탑승하지 않음'}
        </button>
      </div>

      <InfoSection
        description1="버스가"
        main1="이동 중"
        main2=" 입니다!"
        imageSrc={daramgi}
        altText="다람쥐"
      />
      
      <div className="flex-grow w-full bg-white rounded-tl-[20px] rounded-tr-[20px] shadow-top overflow-hidden animate-slideUp -mt-10">
        <BusMap location={location} busIcon={busIcon} />
      </div>
    </div>
  )
}
