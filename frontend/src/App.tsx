import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import ParentHome from "./pages/parent/ParentHome";
import ParentDocument from "./pages/parent/ParentDocument";
import ParentNotice from "./pages/parent/ParentNotice";
import ParentNoticeDetail from "./pages/parent/ParentNoticeDetail";
import ParentAlbum from "./pages/parent/ParentAlbum";
import ParentAlbumDetail from "./pages/parent/ParentAlbumDetail";
import ParentGrowth from "./pages/parent/ParentGrowth";
import Footer from "./components/parent/common/Footer";

import TeacherDocument from './pages/teacher/TeacherDocument';
import TeacherNotice from './pages/teacher/TeacherNotice';
import TeacherAlbum from './pages/teacher/TeacherAlbum';
import TeacherGrowth from './pages/teacher/TeacherGrowth';
import TeacherMeeting from './pages/teacher/TeacherMeeting';
import TeacherBus from "./pages/teacher/TeacherBus";
import TeacherHome from "./pages/teacher/TeacherHome";
import ParentMeeting from "./pages/parent/ParentMeeting";

const LoginPage: React.FC = () => {
  return <h1>Login Page</h1>;
};

const App: React.FC = () => {
  const userType: string = "teacher"; // 'teacher' or 'parent', 실제로는 사용자 인증 상태에서 가져와야 합니다.
  const navigate = useNavigate();

  useEffect(() => {
    if (userType !== "parent" && userType !== "teacher") {
      navigate("/login");
    }
  }, [userType, navigate]);

  return (
    <Routes>
      {userType === "parent" ? (
        <>
          <Route path="/" element={<ParentHome />} />
          <Route path="/document" element={<ParentDocument />} />
          <Route path="/notice" element={<ParentNotice />} />
          <Route path="/notice/:id" element={<ParentNoticeDetail />} />
          <Route path="/album" element={<ParentAlbum />} />
          <Route path="/album/:date" element={<ParentAlbumDetail />} />
          <Route path="/growth" element={<ParentGrowth />} />
          <Route path="/meeting" element={<ParentMeeting />} />
        </>
      ) : userType === "teacher" ? (
        <>
          <Route path="/" element={<TeacherHome />} />
          <Route path="/document" element={<TeacherDocument />} />
          <Route path="/notice" element={<TeacherNotice />} />
          <Route path="/album" element={<TeacherAlbum />} />
          <Route path="/growth" element={<TeacherGrowth />} />
          <Route path="/meeting" element={<TeacherMeeting />} />
          <Route path="/bus" element={<TeacherBus/>} />
        </>
      ) : (
        <Route path="/login" element={<LoginPage />} />
      )}
    </Routes>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
