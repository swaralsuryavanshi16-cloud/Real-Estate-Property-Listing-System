import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, AgentRoute, PublicOnlyRoute } from './components/auth/RouteGuards';
import Layout from './components/layout/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgetPassword';
import Dashboard from './pages/Dashboard';
import PropertyList from './pages/buyer/PropertyList';
import PropertyDetail from './pages/buyer/PropertyDetail';
import PropertyForm from './pages/agent/PropertyForm';
import MyListings from './pages/agent/MyListings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPending from './pages/admin/AdminPending';
import Profile from './pages/Profile';
import Purchases from './pages/Purchases';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';

function AppLayout({ children }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Public info pages — accessible whether logged in or not */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/properties" element={<AppLayout><PropertyList /></AppLayout>} />
            <Route path="/properties/:id" element={<AppLayout><PropertyDetail /></AppLayout>} />
            <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
            <Route path="/purchases" element={<AppLayout><Purchases /></AppLayout>} />

            <Route element={<AgentRoute />}>
              <Route path="/agent/my-listings" element={<AppLayout><MyListings /></AppLayout>} />
              <Route path="/agent/my-listings/new" element={<AppLayout><PropertyForm /></AppLayout>} />
              <Route path="/agent/my-listings/:id/edit" element={<AppLayout><PropertyForm /></AppLayout>} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<AppLayout><AdminUsers /></AppLayout>} />
              <Route path="/admin/pending" element={<AppLayout><AdminPending /></AppLayout>} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
