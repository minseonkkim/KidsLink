import { Outlet, useLocation, useParams } from 'react-router-dom'
import MainHeader from '../components/parent/common/MainHeader'
import SubHeader from '../components/parent/common/SubHeader'
import BottomNavbar from '../components/parent/common/BottomNavbar'

export default function ParentLayout() {
  const location = useLocation()
  const params = useParams()

  const noHeaderAndNavbarPaths = [`/meeting/${params.meetingId}`,'/error']
  const mainHeaderPaths = ['/', '/schedule', '/mypage']
  const useMainHeader = mainHeaderPaths.includes(location.pathname)

  // 각 경로에 대한 타이틀 설정(서브 헤더 params)
  const getTitle = () => {
    if (location.pathname.startsWith('/document/submit')) {
      return '문서 작성'
    } else if (location.pathname.startsWith('/document')) {
      return '문서'
    } else if (location.pathname.startsWith('/notice')) {
      return '알림장'
    } else if (location.pathname.startsWith('/album')) {
      return '앨범'
    } else if (location.pathname.startsWith('/diary')) {
      return '성장일지'
    } else if (location.pathname.startsWith('/bus')) {
      return '등하원 관리'
    } else if (location.pathname.startsWith('/meeting/submit')) {
      return '상담 예약'
    } else if (location.pathname.startsWith('/meeting')) {
      return '상담'
    } else {
      return '존재하지 않는 페이지'
    }
  }

  // 현재 경로가 noHeaderAndNavbarPaths에 포함되어 있는지 확인
  const useNoHeaderAndNavbar = noHeaderAndNavbarPaths.some((path) => location.pathname.startsWith(path));

  return (
    <div className='min-h-[100dvh] flex flex-col'>
      {!useNoHeaderAndNavbar && (
        useMainHeader ? (
          <MainHeader />
        ) : (
          <SubHeader title={getTitle()} />
        )
      )}
      {/* 헤더, 하단네비바 높이만큼 패딩 적용 */}
      <main className={`${!useNoHeaderAndNavbar ? 'flex-grow pt-[67px] pb-[60px]' : 'flex-grow'}`}>
        <Outlet />
      </main>
      {!useNoHeaderAndNavbar && <BottomNavbar />}
    </div>
  )
}
