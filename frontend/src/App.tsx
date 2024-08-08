import { Routes, Route, Navigate } from "react-router-dom";
import useAppStore, { AppState } from "./stores/store";

import Join from "./pages/common/Join";
import Login from "./pages/common/Login";
import SocialJoinRedirect from "./components/join/SocialJoinRedirect";
import SocialLoginRedirect from "./components/login/SocialLoginRedirect";

import ParentLayout from "./layouts/ParentLayout";
import ParentHome from "./pages/parent/ParentHome";
import ParentDocument from "./pages/parent/ParentDocument";
import ParentDocumentDetail from "./pages/parent/ParentDocumentDetail";
import ParentDocumentSubmit from "./pages/parent/ParentDocumentSubmit";
import ParentNotice from "./pages/parent/ParentNotice";
import ParentNoticeDetail from "./pages/parent/ParentNoticeDetail";
import ParentAlbum from "./pages/parent/ParentAlbum";
import ParentAlbumDetail from "./pages/parent/ParentAlbumDetail";
import AlbumDetailCard from "./pages/parent/AlbumDetailCard";
import ParentDiary from "./pages/parent/ParentDiary";
import ParentDiaryDetail from "./pages/parent/ParentDiaryDetail";
import ParentBus from "./pages/parent/ParentBus";
import ParentMeeting from "./pages/parent/ParentMeeting";
import ParentMeetingSubmit from "./pages/parent/ParentMeetingSubmit";
import ParentSchedule from "./pages/parent/ParentSchedule";
import ParentMyPage from "./pages/parent/ParentMyPage";
import ParentVideo from "./pages/parent/ParentVideo";

import TeacherDocument from "./pages/teacher/TeacherDocument";
import TeacherNotice from "./pages/teacher/TeacherNotice";
import TeacherAlbum from "./pages/teacher/TeacherAlbum";
import TeacherGrowth from "./pages/teacher/TeacherGrowth";
import TeacherMeeting from "./pages/teacher/TeacherMeeting";
import TeacherBus from "./pages/teacher/TeacherBus";
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherReservation from "./pages/teacher/TeacherMeetingReservation";
import TeacherOurClass from "./pages/teacher/TeacherOurClass";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import JoinDetails from "./pages/common/JoinDetails";
import TeacherAlbumFinish from "./pages/teacher/TeacherAlbumFinish";
import TeacherMyPage from "./pages/teacher/TeacherMyPage";
import TeacherAlbumSendFinish from "./pages/teacher/TeacherAlbumSendFinish";
import TeacherVideo from "./pages/teacher/TeacherVideo";
import TeacherMeetingMain from "./pages/teacher/TeacherMeetingMain";
import TeacherMeetingConfirm from "./pages/teacher/TeacherMeetingConfirm";
import TeacherMeetingRecordingList from "./pages/teacher/TeacherMeetingRecordingList";

export default function App() {
  const userType = useAppStore((state: AppState) => state.userType);

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
            <Route path="/album/:albumId/image/:imageId" element={<AlbumDetailCard />} />
            <Route path="/diary" element={<ParentDiary />} />
            <Route path="/diary/:diaryId" element={<ParentDiaryDetail />} />
            <Route path="/bus" element={<ParentBus />} />
            <Route path="/meeting" element={<ParentMeeting />} />
            <Route path="/meeting/submit" element={<ParentMeetingSubmit />} />
            <Route path="/meeting/:meetingId" element={<ParentVideo />} />
            <Route path="/schedule" element={<ParentSchedule />} />
            <Route path="/mypage" element={<ParentMyPage />} />
            {/* 부모 사용자에 대한 잘못된 경로 */}
            <Route
              path="*"
              element={window.location.pathname.startsWith("/api") ? null : <Navigate to="/" />}
            />
          </Route>
        </>
      ) : userType === "ROLE_TEACHER" ? (
        <>
          {/* 교사 사용자의 라우트 */}
          <Route path="/" element={<TeacherHome />} />
          <Route path="/document" element={<TeacherDocument />} />
          <Route path="/notice" element={<TeacherNotice />} />
          <Route path="/album" element={<TeacherAlbum />} />
          <Route path="/album/classify_finish" element={<TeacherAlbumFinish />} />
          <Route path="/growth" element={<TeacherGrowth />} />
          <Route path="/meeting/scheduled" element={<TeacherMeeting />} />
          <Route path="/meeting/reservation" element={<TeacherReservation />} />
          <Route path="/bus" element={<TeacherBus />} />
          <Route path="/ourclass" element={<TeacherOurClass />} />
          <Route path="/schedule" element={<TeacherSchedule />} />
          <Route path="/mypage" element={<TeacherMyPage />} />
          <Route path="/album/send_finish" element={<TeacherAlbumSendFinish />} />
          <Route path="/meeting/:meetingId" element={<TeacherVideo />} />
          <Route path="/meeting" element={<TeacherMeetingMain />} />
          <Route path="/meeting/confirm" element={<TeacherMeetingConfirm />} />
          <Route path="/meeting/recordings" element={<TeacherMeetingRecordingList />} />
          {/* 교사 사용자에 대한 잘못된 경로 */}
          <Route
            path="*"
            element={window.location.pathname.startsWith("/api") ? null : <Navigate to="/" />}
          />
        </>
      ) : (
        <>
          {/* 기본 사용자의 라우트 */}
          <Route path="/" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/social/join" element={<SocialJoinRedirect />} />
          <Route path="/social/login" element={<SocialLoginRedirect />} />
          <Route path="/join/:role" element={<JoinDetails />} />
          {/* 기본 사용자에 대한 잘못된 경로 */}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}
