import { Routes, Route} from "react-router-dom"
import useAppStore, { UserState } from "./stores/store";

import Join from "./pages/common/Join"
import SocialJoin from "./pages/common/SocialJoin"
import Login from "./pages/common/Login"

import ParentLayout from './layouts/ParentLayout'
import ParentHome from "./pages/parent/ParentHome"
import ParentDocument from "./pages/parent/ParentDocument"
import ParentDocumentDetail from "./pages/parent/ParentDocumentDetail"
import ParentDocumentSubmit from "./pages/parent/ParentDocumentSubmit"
import ParentNotice from "./pages/parent/ParentNotice"
import ParentNoticeDetail from "./pages/parent/ParentNoticeDetail"
import ParentAlbum from "./pages/parent/ParentAlbum"
import ParentAlbumDetail from "./pages/parent/ParentAlbumDetail"
import ParentAlbumDecorate from "./pages/parent/ParentAlbumDecorate"
import ParentDiary from "./pages/parent/ParentDiary"
import ParentDiaryDetail from "./pages/parent/ParentDiaryDetail"
import ParentBus from "./pages/parent/ParentBus"
import ParentMeeting from "./pages/parent/ParentMeetingList"
import ParentMeetingSubmit from "./pages/parent/ParentMeetingSubmit"
import ParentMeetingRoom from "./pages/parent/ParentVideo"
import ParentSchedule from "./pages/parent/ParentSchedule"
import ParentMyPage from "./pages/parent/ParentMyPage"

import TeacherDocument from "./pages/teacher/TeacherDocument"
import TeacherNotice from "./pages/teacher/TeacherNotice"
import TeacherAlbum from "./pages/teacher/TeacherAlbum"
import TeacherGrowth from "./pages/teacher/TeacherGrowth"
import TeacherMeeting from "./pages/teacher/TeacherMeeting"
import TeacherBus from "./pages/teacher/TeacherBus"
import TeacherHome from "./pages/teacher/TeacherHome"
import TeacherReservation from "./pages/teacher/TeacherMeetingReservation"
import TeacherOurClass from "./pages/teacher/TeacherOurClass"
import TeacherSchedule from "./pages/teacher/TeacherSchedule"
import JoinDetails from "./pages/common/JoinDetails"
import TeacherAlbumFinish from "./pages/teacher/TeacherAlbumFinish"
import TeacherMyPage from "./pages/teacher/TeacherMyPage"
import TeacherBroadcast from "./pages/teacher/TeacherVideo"
import TeacherVideo from "./pages/teacher/TeacherVideo";
import ParentVideo from "./pages/parent/ParentVideo";

export default function App() {
  const userType = useAppStore((state: UserState) => state.userType) 

  return (
    <Routes>
      {userType === "ROLE_PARENT" ? (
        <>
          {/* 부모 사용자의 라우트 */}
          <Route element={<ParentLayout />}>
            <Route path="/" element={<ParentHome />} />
            <Route path="/document" element={<ParentDocument />} />
            <Route path="/document/:docType/:docId" element={<ParentDocumentDetail />} />
            <Route path="/document/submit" element={<ParentDocumentSubmit />} />
            <Route path="/notice" element={<ParentNotice />} />
            <Route path="/notice/:noticeId" element={<ParentNoticeDetail />} />
            <Route path="/album" element={<ParentAlbum />} />
            <Route path="/album/:albumId" element={<ParentAlbumDetail />} />
            <Route path="/album/:albumId/image/:imageId" element={<ParentAlbumDecorate />} />
            <Route path="/diary" element={<ParentDiary />} />
            <Route path="/diary/:diaryId" element={<ParentDiaryDetail />} />
            <Route path="/bus" element={<ParentBus />} />
            <Route path="/meeting" element={<ParentMeeting />} />
            <Route path="/meeting/submit" element={<ParentMeetingSubmit />} />
            <Route path="/meeting/:meetingId" element={<ParentVideo />} />
            <Route path="/schedule" element={<ParentSchedule />} />
            <Route path="/mypage" element={<ParentMyPage />} />
          </Route>
        </>
      ) : userType === "ROLE_TEACHER" ? (
        <>
          {/* 교사 사용자의 라우트 */}
          <Route path="/" element={<TeacherHome />} />
          <Route path="/document" element={<TeacherDocument />} />
          <Route path="/notice" element={<TeacherNotice />} />
          <Route path="/album" element={<TeacherAlbum />} />
          <Route path="/album/finish" element={<TeacherAlbumFinish />} />
          <Route path="/growth" element={<TeacherGrowth />} />
          <Route path="/meeting" element={<TeacherMeeting />} />
          <Route path="/meeting/reservation" element={<TeacherReservation />} />
          <Route path="/bus" element={<TeacherBus />} />
          <Route path="/ourclass" element={<TeacherOurClass />} />
          <Route path="/schedule" element={<TeacherSchedule />} />
          <Route path="/mypage" element={<TeacherMyPage />} />
          <Route path="/meeting/:meetingId" element={<TeacherVideo />} />
        </>
      ) : (
        <>
          {/* 기본 사용자의 라우트 */}
          <Route path="/" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/social-join" element={<SocialJoin />} />
          <Route path="/join/:role" element={<JoinDetails />} />
        </>
      )}
    </Routes>
  )
}