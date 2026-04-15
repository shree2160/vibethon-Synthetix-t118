import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Playground from './pages/Playground';
import Simulations from './pages/Simulations';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import Games from './pages/Games';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ModuleDetail from './pages/ModuleDetail';
import LessonViewer from './pages/LessonViewer';

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900 text-white flex">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/modules" element={<ProtectedLayout><Modules /></ProtectedLayout>} />
          <Route path="/modules/:id" element={<ProtectedLayout><ModuleDetail /></ProtectedLayout>} />
          <Route path="/modules/:moduleId/lessons/:lessonId" element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} />
          <Route path="/playground" element={<ProtectedLayout><Playground /></ProtectedLayout>} />
          <Route path="/simulations" element={<ProtectedLayout><Simulations /></ProtectedLayout>} />
          <Route path="/games" element={<ProtectedLayout><Games /></ProtectedLayout>} />
          <Route path="/leaderboard" element={<ProtectedLayout><div className="pl-64 p-8 text-2xl">Leaderboard Coming Soon...</div></ProtectedLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
