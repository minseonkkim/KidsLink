import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
function App() {
  const userType:number = 1; // 1: teacher, 2: parent
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
