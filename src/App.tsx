import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Timeline from './pages/Timeline'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Discover from './pages/Discover'
import MurmurDetail from './pages/MurmurDetail'

// Protected Route Guard
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? children : <Navigate to="/auth" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Timeline />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="murmurs/:id" element={<MurmurDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
