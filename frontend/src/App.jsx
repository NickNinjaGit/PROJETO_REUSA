
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Layout from './components/Layout';
import Prizes from './pages/Prizes';
import Comunity from './pages/Comunity';
import Publish from "./pages/Publish";
import { AuthProvider } from './Contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import ProtectedRoute from './Contexts/ProtectedRoute';
import CoursePlayer from './pages/CoursePlayer';
import EditProfile from './pages/ProfileEditPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<EditProfile />} />
              <Route path="/Courses" element={<Courses />} />
              <Route path="/Prizes" element={<Prizes />} />
              <Route path="/Comunity" element={<Comunity />} />
              <Route path="/Publish" element={<Publish />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/curso/:courseId" element={<CoursePlayer />} /> 
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

