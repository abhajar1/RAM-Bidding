import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar variant="solid" />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
    </div>
  )
}
