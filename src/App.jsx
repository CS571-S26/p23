import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LandingPage from './features/landing/LandingPage.jsx'
import LoginPage from './features/auth/LoginPage.jsx'
import BrowsePage from './features/mentors/BrowsePage.jsx'
import MentorDashboard from './features/mentor/MentorDashboard.jsx'
import './App.css'

function GuestLandingRoute() {
  const { user } = useAuth()
  if (user?.role === 'student') return <Navigate to="/browse" replace />
  if (user?.role === 'mentor') return <Navigate to="/mentor-dash" replace />
  return <LandingPage />
}

function RequireStudent({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'student') return <Navigate to="/mentor-dash" replace />
  return children
}

function RequireMentor({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'mentor') return <Navigate to="/browse" replace />
  return children
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<GuestLandingRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/browse"
            element={
              <RequireStudent>
                <BrowsePage />
              </RequireStudent>
            }
          />
          <Route
            path="/mentor-dash"
            element={
              <RequireMentor>
                <MentorDashboard />
              </RequireMentor>
            }
          />
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}
