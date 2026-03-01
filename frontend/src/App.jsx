
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

//Routes - Pages
import Dashboard from './pages/dashboard'
import Login from "./pages/Login"
import Venues from "./pages/venues"
import MyBookings from "./pages/MyBookings"
import Bookvenue from "./pages/Bookvenue"
import Unauthorized from "./pages/Unauthorized"
import ManageVenue from "./pages/ManageVenue"
import ManageBookings from "./pages/ManageBookings"


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/unauthorized' element={<Unauthorized/>} />
          
          {/* Protected Routes - All authenticated users */}
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } />
          
          <Route path='/venues' element={
            <ProtectedRoute>
              <Venues/>
            </ProtectedRoute>
          } />

          {/* Staff and Admin only routes */}
          <Route path='/book-venue' element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <Bookvenue/>
            </ProtectedRoute>
          } />

          <Route path='/my-bookings' element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <MyBookings/>
            </ProtectedRoute>
          } />

          {/* Admin only routes */}
          <Route path='/manage-venues' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageVenue/>
            </ProtectedRoute>
          } />

          <Route path='/manage-bookings' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageBookings/>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
