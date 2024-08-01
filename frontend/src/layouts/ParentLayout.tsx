import { Outlet, useLocation, useParams } from 'react-router-dom'
import MainHeader from '../components/parent/common/MainHeader'
import SubHeader from '../components/parent/common/SubHeader'
import BottomNavbar from '../components/parent/common/BottomNavbar'

export default function ParentLayout() {
  const location = useLocation()
  const params = useParams()

  // 메인 헤더를 사용할 경로들
  const noHeaderPaths = ['/bus', `/meeting/${params.meetingId}`]
  const mainHeaderPaths = ['/', '/schedule', '/mypage']
  const useMainHeader = mainHeaderPaths.includes(location.pathname)

  // 각 경로에 대한 타이틀 설정(서브 헤더 params)
  const getTitle = () => {
    if (location.pathname.startsWith('/document/submit')) {
      return '문서 제출'
    } else if (location.pathname.startsWith('/document') && params.docId && params.docType) {
      return '문서 내용'
    } else if (location.pathname.startsWith('/document')) {
      return '공유된 문서'
    } else if (location.pathname.startsWith('/notice') && params.noticeId) {
      return '알림장'
    } else if (location.pathname.startsWith('/notice')) {
      return '알림장'
    } else if (location.pathname.startsWith('/album') && params.albumId && params.imageId) {
      return '사진 꾸미기'
    } else if (location.pathname.startsWith('/album') && params.albumId) {
      return '앨범'
    } else if (location.pathname.startsWith('/album')) {
      return '앨범'
    } else if (location.pathname.startsWith('/diary') && params.diaryId) {
      return '성장일지'
    } else if (location.pathname.startsWith('/diary')) {
      return '성장일지'
    }  else if (location.pathname.startsWith('/meeting/submit')) {
      return '상담 예약'
    } else if (location.pathname.startsWith('/meeting')) {
      return '상담'
    } else {
      return '존재하지 않는 페이지'
    }
  }

  // 현재 경로가 noHeaderPaths에 포함되어 있는지 확인
  const useNoHeader = noHeaderPaths.some((path) => location.pathname.startsWith(path));

  return (
    <>
      {!useNoHeader && (
        useMainHeader ? (
          <MainHeader />
        ) : (
          <SubHeader title={getTitle()} />
        )
      )}
      <main>
        <Outlet />
      </main>
      <BottomNavbar />
    </>
  )
}