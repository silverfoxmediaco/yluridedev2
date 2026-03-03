// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import theme from './styles/theme';

// Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import VanDetail from './pages/VanDetail';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailSent from './pages/VerifyEmailSent';
import Dashboard from './pages/Dashboard';
import MyListings from './pages/owner/MyListings';
import VanListingForm from './pages/owner/VanListingForm';
import OwnerDocuments from './pages/owner/OwnerDocuments';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingListings from './pages/admin/PendingListings';
import ListingReview from './pages/admin/ListingReview';
import ManageUsers from './pages/admin/ManageUsers';
import OwnersList from './pages/admin/OwnersList';
import OwnerDetail from './pages/admin/OwnerDetail';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';

// Import components
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <div className="app-container">
        {isAdminRoute ? <AdminHeader /> : <Header />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/van/:id" element={<VanDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/success" element={<BookingSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            {/* Owner routes */}
            <Route path="/owner/listings" element={
              <ProtectedRoute roles={['owner', 'admin']}>
                <MyListings />
              </ProtectedRoute>
            } />
            <Route path="/owner/listings/new" element={
              <ProtectedRoute roles={['owner', 'admin']}>
                <VanListingForm />
              </ProtectedRoute>
            } />
            <Route path="/owner/listings/:id/edit" element={
              <ProtectedRoute roles={['owner', 'admin']}>
                <VanListingForm />
              </ProtectedRoute>
            } />
            <Route path="/owner/documents" element={
              <ProtectedRoute roles={['owner', 'admin']}>
                <OwnerDocuments />
              </ProtectedRoute>
            } />
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/listings" element={
              <ProtectedRoute roles={['admin']}>
                <PendingListings />
              </ProtectedRoute>
            } />
            <Route path="/admin/listings/:id" element={
              <ProtectedRoute roles={['admin']}>
                <ListingReview />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute roles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/owners" element={
              <ProtectedRoute roles={['admin']}>
                <OwnersList />
              </ProtectedRoute>
            } />
            <Route path="/admin/owners/:id" element={
              <ProtectedRoute roles={['admin']}>
                <OwnerDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
              <ProtectedRoute roles={['admin']}>
                <AdminBookings />
              </ProtectedRoute>
            } />
            <Route path="/admin/payments" element={
              <ProtectedRoute roles={['admin']}>
                <AdminPayments />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
      <ToastContainer
        position="top-right"
        theme="light"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
