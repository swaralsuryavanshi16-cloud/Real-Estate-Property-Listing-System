import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../api/admin';
import { getProperties } from '../api/properties';
import { Building2, Users, Clock, CheckCircle, TrendingUp, Plus, Eye } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0e8de9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

function StatCard({ icon: Icon, label, value, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ property }) {
  const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const img = property.images?.[0] ? `${BASE}${property.images[0].path}` : null;
  return (
    <Link to={`/properties/${property._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
        {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-gray-400 m-3" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{property.title}</p>
        <p className="text-xs text-gray-500">{property.location?.city} · ₹{property.price?.toLocaleString()}</p>
      </div>
      <span className={property.isApproved ? 'badge-approved' : 'badge-pending'}>
        {property.isApproved ? 'Approved' : 'Pending'}
      </span>
    </Link>
  );
}

export default function Dashboard() {
  const { user, isAdmin, isAgent, isBuyer } = useAuth();
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (isAdmin) {
          const { data } = await getDashboard();
          setStats(data.data);
        } else {
          const params = isAgent ? { limit: 5 } : { limit: 5 };
          const { data } = await getProperties(params);
          setProperties(data.data || []);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [isAdmin, isAgent]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening today.</p>
      </div>

      {/* Admin Dashboard */}
      {isAdmin && stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={stats.stats.totalUsers} color="primary" />
            <StatCard icon={Building2} label="Total Properties" value={stats.stats.totalProperties} color="blue" />
            <StatCard icon={Clock} label="Pending Approvals" value={stats.stats.pendingApprovals} color="yellow" />
            <StatCard icon={CheckCircle} label="Agents" value={stats.stats.totalAgents} color="green" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Properties by Type</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.propertiesByType.map(d => ({ name: d._id, count: d.count }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0e8de9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Properties by Status</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={stats.propertiesByStatus.map(d => ({ name: d._id, value: d.count }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {stats.propertiesByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Properties</h3>
                <Link to="/properties" className="text-xs text-primary-600 hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-gray-100">
                {stats.recentProperties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Users</h3>
                <Link to="/admin/users" className="text-xs text-primary-600 hover:underline">View all</Link>
              </div>
              <div className="space-y-2">
                {stats.recentUsers.map(u => (
                  <div key={u._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      u.role === 'admin' ? 'bg-red-100 text-red-700' :
                      u.role === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Agent Dashboard */}
      {isAgent && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
              <Building2 className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-primary-100 text-sm">My Listings</p>
              <p className="text-3xl font-bold">{properties.length}</p>
            </div>
            <Link to="/agent/my-listings/new" className="card p-6 flex flex-col items-center justify-center gap-2 hover:border-primary-300 hover:bg-primary-50 transition-colors border-2 border-dashed">
              <Plus className="w-8 h-8 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">Add New Listing</span>
            </Link>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Listings</h3>
              <Link to="/agent/my-listings" className="text-xs text-primary-600 hover:underline">View all</Link>
            </div>
            {properties.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No listings yet. Create your first!</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {properties.slice(0, 5).map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Buyer Dashboard */}
      {isBuyer && (
        <div className="space-y-4">
          <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <h3 className="text-lg font-semibold mb-2">Find Your Dream Property</h3>
            <p className="text-primary-200 text-sm mb-4">Browse approved listings from verified agents.</p>
            <Link to="/properties" className="inline-flex items-center gap-2 bg-white text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50">
              <Eye className="w-4 h-4" /> Browse Properties
            </Link>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Latest Listings</h3>
            {properties.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No approved properties available yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
