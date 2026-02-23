import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Assessment from './pages/Assessment';
import AssessmentResults from './pages/AssessmentResults';
import Dashboard from './pages/Dashboard';
import LetterHunt from './pages/activities/LetterHunt';
import PhonicsMatch from './pages/activities/PhonicsMatch';
import LetterTracing from './pages/activities/LetterTracing';
import Settings from './pages/Settings';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/assessment" element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          } />
          <Route path="/assessment-results" element={
            <ProtectedRoute>
              <AssessmentResults />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/activity/letter-hunt" element={
            <ProtectedRoute>
              <LetterHunt />
            </ProtectedRoute>
          } />
          <Route path="/activity/phonics-match" element={
            <ProtectedRoute>
              <PhonicsMatch />
            </ProtectedRoute>
          } />
          <Route path="/activity/letter-tracing" element={
            <ProtectedRoute>
              <LetterTracing />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
