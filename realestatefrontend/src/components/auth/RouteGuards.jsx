import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function AdminRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function AgentRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!['admin', 'agent'].includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
