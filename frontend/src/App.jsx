import { Routes, Route } from 'react-router-dom';
import SignupPage from './pages/signup';
import LoginPage from './pages/login';
import Home from './pages/home';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Home Route */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
