import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import AlaramBell from './AlaramBell'

interface CommonHeaderProps {
  title: string;
}

// 나중에 data 타입 다 한곳에 모아서 export 시키기
interface Notification {
  time: string;
  title: string;
  contents: string;
  code: 'NOTICE' | 'DIARY' | 'ALBUM' | 'BUS' |'MEETING' | 'DOCUMENT'
}

export default function SubHeader({ title }: CommonHeaderProps) {
  const navigate = useNavigate()

  // 뒤로 가기 버튼 클릭
  const handleBack = () => {
    const path = location.pathname
    if (path === '/meeting') {
      navigate('/') 
    } else {
      navigate(-1)
    }
  }

  const notificationCount = 5;
  const notifications: Notification[] = [
    {
      time: '오후 2:21',
      title: '새 대화 알림',
      contents: '박경림님: 안녕하세요',
      code: 'BUS'
    },
    {
      time: '오후 2:20',
      title: '새 서비스 알림',
      contents: '김다우 사장 [알림] 운영자 확인이 필요한 근태 정보가 있습니다. 근태관리에서 확인하세요.',
      code: 'BUS'
    },
    {
      time: '오후 2:20',
      title: '김다우',
      contents: '[출근완료] 다우오피스에 출근체크 되었습니다.',
      code: 'BUS'
    },
    {
      time: '오후 2:19',
      title: '프로모션 알림',
      contents: '새로운 프로모션이 시작되었습니다. 지금 확인해보세요!',
      code: 'BUS'
    },
    {
      time: '오후 2:18',
      title: '시스템 업데이트',
      contents: '시스템 업데이트가 완료되었습니다. 재로그인 해주세요.',
      code: 'BUS'
    }
  ]

  return (
    <div className="z-50 fixed w-full h-[67px] border-b bg-white border-gray-300 p-4 shadow-md flex items-center justify-between">
      <button onClick={handleBack} className="flex items-center justify-center w-10 h-10">
        <FaArrowLeft className="w-6 h-6  text-gray-700" />
      </button>
      <p className="text-[22px] font-bold text-[#212121]">
        {title}
      </p>
      <AlaramBell notificationCount={notificationCount} notifications={notifications} />
    </div>
  )
}