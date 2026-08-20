
import { lazy, Suspense } from 'react';
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

//Routes - Pages
const Dashboard = lazy(() => import('./pages/dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Venues = lazy(() => import('./pages/venues'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Bookvenue = lazy(() => import('./pages/Bookvenue'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const ManageVenue = lazy(() => import('./pages/ManageVenue'));
const ManageBookings = lazy(() => import('./pages/ManageBookings'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
      <p className="text-purple-600 font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
