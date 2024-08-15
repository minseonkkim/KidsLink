import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import useAppStore, { AppState } from "./stores/store";
import LoadingSpinner from "./components/common/LoadingSpinner";
import {
  ParentMeetingGuard,
  TeacherMeetingGuard,
} from "./components/meeting/MeetingGuard";
import LoginCenterPage from "./pages/common/LoginCenterPage";
import ErrorPage from "./pages/common/ErrorPage";

const Join = lazy(() => import("./pages/common/Join"));
const Login = lazy(() => import("./pages/common/Login"));
const SocialJoinRedirect = lazy(
  () => import("./components/join/SocialJoinRedirect")
);
const SocialLoginRedirect = lazy(
  () => import("./components/login/SocialLoginRedirect")
);

const ParentLayout = lazy(() => import("./layouts/ParentLayout"));
const ParentHome = lazy(() => import("./pages/parent/ParentHome"));
const ParentDocument = lazy(() => import("./pages/parent/ParentDocument"));
const ParentDocumentDetail = lazy(
  () => import("./pages/parent/ParentDocumentDetail")
);
const ParentDocumentSubmit = lazy(
  () => import("./pages/parent/ParentDocumentSubmit")
);
const ParentNotice = lazy(() => import("./pages/parent/ParentNotice"));
const ParentNoticeDetail = lazy(
  () => import("./pages/parent/ParentNoticeDetail")
);
const ParentAlbum = lazy(() => import("./pages/parent/ParentAlbum"));
const ParentAlbumDetail = lazy(
  () => import("./pages/parent/ParentAlbumDetail")
);
const ParentGrowth = lazy(() => import("./pages/parent/ParentGrowth"));
const ParentGrowthDetail = lazy(
  () => import("./pages/parent/ParentGrowthDetail")
);
const ParentBus = lazy(() => import("./pages/parent/ParentBus"));
const ParentMeeting = lazy(() => import("./pages/parent/ParentMeeting"));
const ParentMeetingSubmit = lazy(
  () => import("./pages/parent/ParentMeetingSubmit")
);
const ParentSchedule = lazy(() => import("./pages/parent/ParentSchedule"));
const ParentMyPage = lazy(() => import("./pages/parent/ParentMyPage"));
const ParentVideo = lazy(() => import("./pages/parent/ParentVideo"));

const TeacherDocument = lazy(() => import("./pages/teacher/TeacherDocument"));
const TeacherNotice = lazy(() => import("./pages/teacher/TeacherNotice"));
const TeacherAlbum = lazy(() => import("./pages/teacher/TeacherAlbum"));
const TeacherGrowth = lazy(() => import("./pages/teacher/TeacherGrowth"));
const TeacherMeeting = lazy(() => import("./pages/teacher/TeacherMeeting"));
const TeacherBus = lazy(() => import("./pages/teacher/TeacherBus"));
const TeacherReservation = lazy(
  () => import("./pages/teacher/TeacherMeetingReservation")
);
const TeacherOurClass = lazy(() => import("./pages/teacher/TeacherOurClass"));
const TeacherSchedule = lazy(() => import("./pages/teacher/TeacherSchedule"));
const TeacherMyPage = lazy(() => import("./pages/teacher/TeacherMyPage"));
const TeacherAlbumFinish = lazy(
  () => import("./pages/teacher/TeacherAlbumFinish")
);
const TeacherAlbumSendFinish = lazy(
  () => import("./pages/teacher/TeacherAlbumSendFinish")
);
const TeacherVideo = lazy(() => import("./pages/teacher/TeacherVideo"));
const TeacherMeetingMain = lazy(
  () => import("./pages/teacher/TeacherMeetingMain")
);
const TeacherMeetingConfirm = lazy(
  () => import("./pages/teacher/TeacherMeetingConfirm")
);
const TeacherMeetingRecordingList = lazy(
  () => import("./pages/teacher/TeacherMeetingRecordingList")
);
const TeacherAlbumHistory = lazy(
  () => import("./pages/teacher/TeacherAlbumHistory")
);
const TeacherSupport = lazy(() => import("./pages/teacher/TeacherSupport"));

const JoinDetails = lazy(() => import("./pages/common/JoinDetails"));

export default function App() {
  const location = useLocation();
  const userType = useAppStore((state: AppState) => state.userType);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes location={location}>
        {userType === "ROLE_PARENT" ? (
          <>
            {/* 학부모 사용자 페이지 */}
            <Route element={<ParentLayout />}>
              <Route path="/" element={<ParentHome />} />
              <Route path="/document" element={<ParentDocument />} />
              <Route
                path="/document/:docType/:docId"
                element={<ParentDocumentDetail />}
              />
              <Route
                path="/document/submit"
                element={<ParentDocumentSubmit />}
              />
              <Route path="/notice" element={<ParentNotice />} />
              <Route
                path="/notice/:noticeId"
                element={<ParentNoticeDetail />}
              />
              <Route path="/album" element={<ParentAlbum />} />
              <Route path="/album/:albumId" element={<ParentAlbumDetail />} />
              <Route path="/growth" element={<ParentGrowth />} />
              <Route path="/growth/:diaryId" element={<ParentGrowthDetail />} />
              <Route path="/bus" element={<ParentBus />} />
              <Route path="/meeting" element={<ParentMeeting />} />
              <Route path="/meeting/submit" element={<ParentMeetingSubmit />} />
              <Route
                path="/meeting/:meetingId"
                element={
                  <ParentMeetingGuard>
                    <ParentVideo />
                  </ParentMeetingGuard>
                }
              />
              <Route path="/schedule" element={<ParentSchedule />} />
              <Route path="/mypage" element={<ParentMyPage />} />
              {/* 존재하지 않는 페이지 */}
              <Route
                path="*"
                element={
                  window.location.pathname.startsWith("/api") ? null : (
                    <ErrorPage message={"존재하지 않는 페이지입니다."} />
                  )
                }
              />
            </Route>
          </>
        ) : userType === "ROLE_TEACHER" ? (
          <>
            {/* 선생님 사용자 페이지 */}
            <Route path="/" element={<TeacherOurClass />} />
            <Route path="/document" element={<TeacherDocument />} />
            <Route path="/notice" element={<TeacherNotice />} />
            <Route path="/album" element={<TeacherAlbum />} />
            <Route
              path="/album/classify_finish"
              element={<TeacherAlbumFinish />}
            />
            <Route path="/album/history" element={<TeacherAlbumHistory />} />
            <Route path="/growth" element={<TeacherGrowth />} />
            <Route path="/meeting/scheduled" element={<TeacherMeeting />} />
            <Route
              path="/meeting/reservation"
              element={<TeacherReservation />}
            />
            <Route path="/bus" element={<TeacherBus />} />
            <Route path="/schedule" element={<TeacherSchedule />} />
            <Route path="/mypage" element={<TeacherMyPage />} />
            <Route
              path="/album/send_finish"
              element={<TeacherAlbumSendFinish />}
            />
            <Route
              path="/meeting/:meetingId"
              element={
                <TeacherMeetingGuard>
                  <TeacherVideo />
                </TeacherMeetingGuard>
              }
            />
            <Route path="/meeting" element={<TeacherMeetingMain />} />
            <Route
              path="/meeting/confirm"
              element={<TeacherMeetingConfirm />}
            />
            <Route
              path="/meeting/recordings"
              element={<TeacherMeetingRecordingList />}
            />
            <Route path="/support" element={<TeacherSupport />} />
            {/* 존재하지 않는 페이지 */}
            <Route
              path="*"
              element={
                window.location.pathname.startsWith("/api") ? null : (
                  <ErrorPage message={"존재하지 않는 페이지입니다."} />
                )
              }
            />
          </>
        ) : (
          <>
            {/* Default User Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<LoginCenterPage />} />
            <Route path="/join" element={<Join />} />
            <Route path="/social/join" element={<SocialJoinRedirect />} />
            <Route path="/social/login" element={<SocialLoginRedirect />} />
            <Route path="/join/:role" element={<JoinDetails />} />
            {/* Default User Error Page */}
            <Route
              path="*"
              element={<ErrorPage message={"존재하지 않는 페이지입니다."} />}
            />
          </>
        )}
      </Routes>
    </Suspense>
  );
}
