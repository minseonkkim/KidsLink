import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ParentHome from './pages/parent/ParentHome';
import ParentGrowth from './pages/parent/ParentGrowth';
import ParentAlbum from './pages/parent/ParentAlbum';
import ParentBus from './pages/parent/ParentBus';
import ParentMeeting from './pages/parent/ParentMeeting';
import ParentDocument from './pages/parent/ParentDocument';

import TeacherHome from './pages/teacher/TeacherHome';
import TeacherGrowth from './pages/teacher/TeacherGrowth';
import TeacherAlbum from './pages/teacher/TeacherAlbum';
import TeacherBus from './pages/teacher/TeacherBus';
import TeacherMeeting from './pages/teacher/TeacherMeeting';
import TeacherDocument from './pages/teacher/TeacherDocument';

type UserType = 'parent' | 'teacher';

const userRoutes = (userType: UserType, path: string) => {
  switch (path) {
    case 'home':
      return userType === 'parent' ? <ParentHome /> : <TeacherHome />;
    case 'growth':
      return userType === 'parent' ? <ParentGrowth /> : <TeacherGrowth />;
    case 'album':
      return userType === 'parent' ? <ParentAlbum /> : <TeacherAlbum />;
    case 'bus':
      return userType === 'parent' ? <ParentBus /> : <TeacherBus />;
    case 'meeting':
      return userType === 'parent' ? <ParentMeeting /> : <TeacherMeeting />;
    case 'document':
      return userType === 'parent' ? <ParentDocument /> : <TeacherDocument />;
    default:
      return <div>Page not found</div>; // 예외 처리 (잘못된 경로 처리)
  }
};

function App() {
  const userType: UserType = 'parent';
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={userRoutes(userType, 'home')} />
        <Route path="/growth" element={userRoutes(userType, 'growth')} />
        <Route path="/album" element={userRoutes(userType, 'album')} />
        <Route path="/bus" element={userRoutes(userType, 'bus')} />
        <Route path="/meeting" element={userRoutes(userType, 'meeting')} />
        <Route path="/document" element={userRoutes(userType, 'document')} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
