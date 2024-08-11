import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import useAppStore, { AppState } from "./stores/store";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./index.css"; // CSS for animations

// Lazy loading of components and pages
const Join = lazy(() => import("./pages/common/Join"));
const Login = lazy(() => import("./pages/common/Login"));
const SocialJoinRedirect = lazy(() => import("./components/join/SocialJoinRedirect"));
const SocialLoginRedirect = lazy(() => import("./components/login/SocialLoginRedirect"));

const ParentLayout = lazy(() => import("./layouts/ParentLayout"));
const ParentHome = lazy(() => import("./pages/parent/ParentHome"));
const ParentDocument = lazy(() => import("./pages/parent/ParentDocument"));
const ParentDocumentDetail = lazy(() => import("./pages/parent/ParentDocumentDetail"));
const ParentDocumentSubmit = lazy(() => import("./pages/parent/ParentDocumentSubmit"));
const ParentNotice = lazy(() => import("./pages/parent/ParentNotice"));
const ParentNoticeDetail = lazy(() => import("./pages/parent/ParentNoticeDetail"));
const ParentAlbum = lazy(() => import("./pages/parent/ParentAlbum"));
const ParentAlbumDetail = lazy(() => import("./pages/parent/ParentAlbumDetail"));
const AlbumDetailCard = lazy(() => import("./pages/parent/AlbumDetailCard"));
const ParentDiary = lazy(() => import("./pages/parent/ParentDiary"));
const ParentDiaryDetail = lazy(() => import("./pages/parent/ParentDiaryDetail"));
const ParentBus = lazy(() => import("./pages/parent/ParentBus"));
const ParentMeeting = lazy(() => import("./pages/parent/ParentMeeting"));
const ParentMeetingSubmit = lazy(() => import("./pages/parent/ParentMeetingSubmit"));
const ParentSchedule = lazy(() => import("./pages/parent/ParentSchedule"));
const ParentMyPage = lazy(() => import("./pages/parent/ParentMyPage"));
const ParentVideo = lazy(() => import("./pages/parent/ParentVideo"));
const ParentErrorPage = lazy(() => import("./pages/parent/ParentErrorPage"));

const TeacherDocument = lazy(() => import("./pages/teacher/TeacherDocument"));
const TeacherNotice = lazy(() => import("./pages/teacher/TeacherNotice"));
const TeacherAlbum = lazy(() => import("./pages/teacher/TeacherAlbum"));
const TeacherGrowth = lazy(() => import("./pages/teacher/TeacherGrowth"));
const TeacherMeeting = lazy(() => import("./pages/teacher/TeacherMeeting"));
const TeacherBus = lazy(() => import("./pages/teacher/TeacherBus"));
const TeacherReservation = lazy(() => import("./pages/teacher/TeacherMeetingReservation"));
const TeacherOurClass = lazy(() => import("./pages/teacher/TeacherOurClass"));
const TeacherSchedule = lazy(() => import("./pages/teacher/TeacherSchedule"));
const TeacherMyPage = lazy(() => import("./pages/teacher/TeacherMyPage"));
const TeacherAlbumFinish = lazy(() => import("./pages/teacher/TeacherAlbumFinish"));
const TeacherAlbumSendFinish = lazy(() => import("./pages/teacher/TeacherAlbumSendFinish"));
const TeacherVideo = lazy(() => import("./pages/teacher/TeacherVideo"));
const TeacherMeetingMain = lazy(() => import("./pages/teacher/TeacherMeetingMain"));
const TeacherMeetingConfirm = lazy(() => import("./pages/teacher/TeacherMeetingConfirm"));
const TeacherMeetingRecordingList = lazy(() => import("./pages/teacher/TeacherMeetingRecordingList"));
const TeacherAlbumHistory = lazy(() => import("./pages/teacher/TeacherAlbumHistory"));
const TeacherErrorPage = lazy(() => import("./pages/teacher/TeacherErrorPage"));

const CommonUserError = lazy(() => import("./pages/common/CommonUserError"));
const JoinDetails = lazy(() => import("./pages/common/JoinDetails"));

export default function App() {
  const location = useLocation();
  const userType = useAppStore((state: AppState) => state.userType);

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="page" timeout={300}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes location={location}>
            {userType === "ROLE_PARENT" ? (
              <>
                {/* Parent User Routes */}
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
                  {/* Parent User Error Page */}
                  <Route path="/error" element={<ParentErrorPage />} />
                  <Route
                    path="*"
                    element={window.location.pathname.startsWith("/api") ? null : <Navigate to="/error" />}
                  />
                </Route>
              </>
            ) : userType === "ROLE_TEACHER" ? (
              <>
                {/* Teacher User Routes */}
                <Route path="/" element={<TeacherOurClass />} />
                <Route path="/document" element={<TeacherDocument />} />
                <Route path="/notice" element={<TeacherNotice />} />
                <Route path="/album" element={<TeacherAlbum />} />
                <Route path="/album/classify_finish" element={<TeacherAlbumFinish />} />
                <Route path="/album/history" element={<TeacherAlbumHistory />} />
                <Route path="/growth" element={<TeacherGrowth />} />
                <Route path="/meeting/scheduled" element={<TeacherMeeting />} />
                <Route path="/meeting/reservation" element={<TeacherReservation />} />
                <Route path="/bus" element={<TeacherBus />} />
                <Route path="/schedule" element={<TeacherSchedule />} />
                <Route path="/mypage" element={<TeacherMyPage />} />
                <Route path="/album/send_finish" element={<TeacherAlbumSendFinish />} />
                <Route path="/meeting/:meetingId" element={<TeacherVideo />} />
                <Route path="/meeting" element={<TeacherMeetingMain />} />
                <Route path="/meeting/confirm" element={<TeacherMeetingConfirm />} />
                <Route path="/meeting/recordings" element={<TeacherMeetingRecordingList />} />
                {/* Teacher User Error Page */}
                <Route path="/error" element={<TeacherErrorPage />} />
                <Route
                  path="*"
                  element={window.location.pathname.startsWith("/api") ? null : <Navigate to="/error" />}
                />
              </>
            ) : (
              <>
                {/* Default User Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/social/join" element={<SocialJoinRedirect />} />
                <Route path="/social/login" element={<SocialLoginRedirect />} />
                <Route path="/join/:role" element={<JoinDetails />} />
                {/* Default User Error Page */}
                <Route path="*" element={<CommonUserError />} />
              </>
            )}
          </Routes>
        </Suspense>
      </CSSTransition>
    </TransitionGroup>
  );
}
