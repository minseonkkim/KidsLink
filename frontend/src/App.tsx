import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppStore, UserState } from "./stores/store";
import ParentHome from "./pages/parent/ParentHome";
import ParentDocument from "./pages/parent/ParentDocument";
import ParentDocumentDetail from "./pages/parent/ParentDocumentDetail";
import ParentDocumentSubmit from "./pages/parent/ParentDocumentSubmit";
import ParentNotice from "./pages/parent/ParentNotice";
import ParentNoticeDetail from "./pages/parent/ParentNoticeDetail";
import ParentAlbum from "./pages/parent/ParentAlbum";
import ParentAlbumDetail from "./pages/parent/ParentAlbumDetail";
import ParentGrowth from "./pages/parent/ParentGrowth";
import ParentGrowthDetail from "./pages/parent/ParentGrowthDetail";
import ParentBus from "./pages/parent/ParentBus";
import ParentMeeting from "./pages/parent/ParentMeeting";
import ParentMeetingSubmit from "./pages/parent/ParentMeetingSubmit";
import ParentMeetingRoom from "./pages/parent/ParentMeetingRoom";
import ParentSchedule from "./pages/parent/ParentSchedule";
import ParentMyPage from "./pages/parent/ParentMyPage";
import Footer from "./components/parent/common/Footer";
import TeacherDocument from "./pages/teacher/TeacherDocument";
import TeacherNotice from "./pages/teacher/TeacherNotice";
import TeacherAlbum from "./pages/teacher/TeacherAlbum";
import TeacherGrowth from "./pages/teacher/TeacherGrowth";
import TeacherMeeting from "./pages/teacher/TeacherMeeting";
import TeacherBus from "./pages/teacher/TeacherBus";
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherReservation from "./pages/teacher/TeacherReservation";
import Login from "./pages/common/Login";
import Join from "./pages/common/Join";
import TeacherOurClass from "./pages/teacher/TeacherOurClass";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import JoinDetails from "./pages/common/JoinDetails";
import TeacherAlbumFinish from "./pages/teacher/TeacherAlbumFinish";
import TeacherMyPage from "./pages/teacher/TeacherMyPage";
import Splash from "./pages/parent/Splash";

const App: React.FC = () => {
  const userType = useAppStore((state: UserState) => state.userType);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (userType === "ROLE_PARENT") {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [userType]);

  return (
    <>
      {showSplash ? (
        <Splash /> // 스플래시 화면 렌더링
      ) : (
        <>
          <Routes>
            {userType === "ROLE_PARENT" ? (
              <>
                <Route path="/" element={<ParentHome />} />
                <Route path="/document" element={<ParentDocument />} />
                <Route path="/document/:type/:id" element={<ParentDocumentDetail />} />
                <Route path="/document/submit" element={<ParentDocumentSubmit />} />
                <Route path="/notice" element={<ParentNotice />} />
                <Route path="/notice/:id" element={<ParentNoticeDetail />} />
                <Route path="/album" element={<ParentAlbum />} />
                <Route path="/album/:date" element={<ParentAlbumDetail />} />
                <Route path="/growth" element={<ParentGrowth />} />
                <Route path="/growth/:id" element={<ParentGrowthDetail />} />
                <Route path="/bus" element={<ParentBus />} />
                <Route path="/meeting" element={<ParentMeeting />} />
                <Route path="/meeting/submit" element={<ParentMeetingSubmit />} />
                <Route path="/meeting/:id" element={<ParentMeetingRoom />} />
                <Route path="/ParentSchedule" element={<ParentSchedule />} />
                <Route path="/mypage" element={<ParentMyPage />} />
              </>
            ) : userType === "ROLE_TEACHER" ? (
              <>
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
              </>
            ) : (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/join/:role" element={<JoinDetails />} />
              </>
            )}
          </Routes>
          {userType === "ROLE_PARENT" && <Footer />}
        </>
      )}
    </>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
