import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ParentHome from './pages/parent/ParentHome';
import TeacherHome from './pages/teacher/TeacherHome';

const userRoutes = (userType: string, path: string) => {
  switch (path) {
    case 'home':
      return userType === 'parent' ? <ParentHome/> : <TeacherHome/>;
    default:
      return <Login/>;
  }
};


function App() {
  const userType:string = 'teacher';
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/" element={userRoutes(userType, 'home')} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
