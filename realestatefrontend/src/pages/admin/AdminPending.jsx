import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPendingProperties } from '../../api/admin';
import { approveProperty, deleteProperty } from '../../api/properties';
import { Building2, CheckCircle, Trash2, Eye, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function AdminPending() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await getPendingProperties();
      setProperties(data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveProperty(id);
      toast.success('Property approved!');
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this property?')) return;
    try {
      await deleteProperty(id);
      toast.success('Property deleted');
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Clock className="w-6 h-6 text-yellow-500" />
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{properties.length}</span>
      </div>

      {properties.length === 0 ? (
        <div className="card p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">All caught up!</p>
          <p className="text-gray-400 text-sm">No properties waiting for approval</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {properties.map(p => {
            const img = p.images?.[0] ? `${BASE}${p.images[0].path}` : null;
            return (
              <div key={p._id} className="card p-4 flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 h-32 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                  {img
                    ? <img src={img} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Building2 className="w-10 h-10 text-gray-300" /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{p.title}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin className="w-3 h-3" />{p.location?.city}, {p.location?.state}
                      </div>
                    </div>
                    <span className="text-lg font-bold text-primary-600">₹{p.price?.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                        {p.agent?.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-600">{p.agent?.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 capitalize">{p.type}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 justify-start">
                  <Link to={`/properties/${p._id}`} className="btn-secondary text-xs py-1.5 flex items-center gap-1.5">
                    <Eye className="w-3 h-3" /> View
                  </Link>
                  <button onClick={() => handleApprove(p._id)} className="btn-primary text-xs py-1.5 flex items-center gap-1.5 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="btn-danger text-xs py-1.5 flex items-center gap-1.5">
                    <Trash2 className="w-3 h-3" /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
