import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home, Building2, Users, CheckSquare, User, Settings,
  LogOut, Menu, X, ChevronDown, Bell, Search, ShoppingBag, ShieldCheck, Briefcase, HeartHandshake
} from 'lucide-react';
import ChatbotWidget from '../chat/ChatbotWidget';
import { WhatsAppFloatingButton } from '../chat/WhatsAppButton';

const navConfig = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'All Properties', path: '/properties', icon: Building2 },
    { label: 'Pending Approval', path: '/admin/pending', icon: CheckSquare },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Purchase Requests', path: '/purchases', icon: ShoppingBag },
  ],
  agent: [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Browse Listings', path: '/properties', icon: Search },
    { label: 'My Listings', path: '/agent/my-listings', icon: Building2 },
    { label: 'Purchase Requests', path: '/purchases', icon: ShoppingBag },
  ],
  buyer: [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Browse Properties', path: '/properties', icon: Building2 },
    { label: 'My Purchases', path: '/purchases', icon: ShoppingBag },
  ],
};

// Each portal gets its own accent theme + badge icon so admin / agent / buyer
// panels are visually distinct at a glance (see .theme-* classes in index.css).
const portalMeta = {
  admin: { theme: 'theme-admin', label: 'Admin Control Room', Icon: ShieldCheck },
  agent: { theme: 'theme-agent', label: 'Agent Workspace', Icon: Briefcase },
  buyer: { theme: 'theme-buyer', label: 'Buyer Portal', Icon: HeartHandshake },
};

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const nav = navConfig[user?.role] || navConfig.buyer;
  const meta = portalMeta[user?.role] || portalMeta.buyer;
  const PortalIcon = meta.Icon;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const RoleTag = () => (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      user?.role === 'admin' ? 'bg-red-100 text-red-700' :
      user?.role === 'agent' ? 'bg-blue-100 text-blue-700' :
      'bg-green-100 text-green-700'
    }`}>
      {user?.role}
    </span>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-gray-900 text-lg">PropEstate</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary-700 bg-primary-50 rounded-lg px-2.5 py-1.5">
          <PortalIcon className="w-3.5 h-3.5" />
          {meta.label}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to="/profile"
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
            location.pathname === '/profile'
              ? 'bg-primary-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4" />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
        <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{user?.name}</p>
              <RoleTag />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${meta.theme} flex h-screen bg-gray-50 overflow-hidden`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar - mobile */}
      <aside className={`fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-200 z-40 transform transition-transform lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-4 right-4">
          <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 lg:flex-none" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <RoleTag />
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 border-t border-gray-200 bg-white px-4 lg:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} PropEstate. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-primary-600">About</Link>
            <Link to="/contact" className="hover:text-primary-600">Contact</Link>
            <Link to="/terms" className="hover:text-primary-600">Terms</Link>
            <Link to="/privacy" className="hover:text-primary-600">Privacy</Link>
          </div>
        </footer>
      </div>

      {/* Global AI chatbot + WhatsApp support */}
      <ChatbotWidget />
      <WhatsAppFloatingButton />
    </div>
  );
}
