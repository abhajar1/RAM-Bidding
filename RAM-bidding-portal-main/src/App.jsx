import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import HotelDashboard from './pages/HotelDashboard'
import OAuthCallback from './pages/OAuthCallback'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/portal" element={<Layout />}>
        <Route index element={<HotelDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
