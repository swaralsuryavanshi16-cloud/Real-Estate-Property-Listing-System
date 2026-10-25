import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, updateUser, deleteUser, createUser, getUserDetail } from '../../api/admin';
import { UserPlus, Edit, Trash2, X, Check, Eye, Mail, Phone, Calendar, Building2, ShoppingBag, Star, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

function UserDetailModal({ userId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    getUserDetail(userId)
      .then(({ data }) => setDetail(data.data))
      .catch(() => toast.error('Failed to load user details'))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
          <h2 className="text-lg font-bold text-gray-900">Full Profile</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : !detail ? (
          <p className="p-6 text-sm text-gray-500">Could not load this user.</p>
        ) : (
          <div className="p-6 space-y-6">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl flex-shrink-0">
                {detail.user.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-lg truncate">{detail.user.name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${detail.user.role === 'admin' ? 'bg-red-100 text-red-700' : detail.user.role === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {detail.user.role}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${detail.user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {detail.user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400" />{detail.user.email}</div>
              {detail.user.phone && <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-gray-400" />{detail.user.phone}</div>}
              <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-gray-400" />Joined {new Date(detail.user.createdAt).toLocaleDateString()}</div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-gray-900">{detail.summary.totalListings}</p>
                <p className="text-xs text-gray-500">Listings ({detail.summary.approvedListings} approved)</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-gray-900">{detail.summary.totalPurchasesMade}</p>
                <p className="text-xs text-gray-500">Offers Made</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-gray-900">{detail.summary.totalReviews}</p>
                <p className="text-xs text-gray-500">Reviews Written</p>
              </div>
            </div>

            {/* Listed properties (agent/admin) */}
            {detail.listedProperties.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Listed Properties</h3>
                <div className="space-y-1.5">
                  {detail.listedProperties.map((p) => (
                    <Link key={p._id} to={`/properties/${p._id}`} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-100 text-sm">
                      <span className="truncate flex-1">{p.title}</span>
                      <span className={p.isApproved ? 'badge-approved' : 'badge-pending'}>{p.isApproved ? 'Approved' : 'Pending'}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Purchases made (buyer) */}
            {detail.purchasesMade.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" /> Purchase Offers Made</h3>
                <div className="space-y-1.5">
                  {detail.purchasesMade.map((p) => (
                    <div key={p._id} className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 text-sm">
                      <span className="truncate flex-1">{p.property?.title || 'Property removed'}</span>
                      <span className="text-xs text-gray-500 capitalize">{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offers received (agent) */}
            {detail.purchasesReceived.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" /> Offers Received on Their Listings</h3>
                <div className="space-y-1.5">
                  {detail.purchasesReceived.map((p) => (
                    <div key={p._id} className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 text-sm">
                      <span className="truncate flex-1">{p.property?.title || 'Property removed'} — {p.buyer?.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews written */}
            {detail.reviewsWritten.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1.5"><Star className="w-4 h-4" /> Reviews Written</h3>
                <div className="space-y-1.5">
                  {detail.reviewsWritten.map((r) => (
                    <div key={r._id} className="px-3 py-2 rounded-lg border border-gray-100 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{r.property?.title || 'Property removed'}</span>
                        <span className="text-xs text-gold-600 font-semibold">★ {r.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail.summary.totalListings === 0 && detail.summary.totalPurchasesMade === 0 && detail.summary.totalReviews === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No activity on the platform yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UserModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer', phone: '' });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(form);
      toast.success('User created');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Create User</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {[['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'text'], ['password', 'Password', 'password']].map(([field, label, type]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} className="input-field" value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required={field !== 'phone'} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select className="input-field" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              {['buyer', 'agent', 'admin'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Creating...' : 'Create User'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // { id, role, isActive }
  const [viewingId, setViewingId] = useState(null);

  const load = async (pg = 1, role = roleFilter) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 15 };
      if (role) params.role = role;
      const { data } = await getUsers(params);
      setUsers(data.data || []);
      setTotalPages(data.pages || 1);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(page, roleFilter); }, [page, roleFilter]);

  const handleUpdate = async (id, updates) => {
    try {
      await updateUser(id, updates);
      toast.success('User updated');
      setEditing(null);
      load(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deactivated');
      load(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-4">
      {showModal && <UserModal onClose={() => setShowModal(false)} onSuccess={() => load(page)} />}
      {viewingId && <UserDetailModal userId={viewingId} onClose={() => setViewingId(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex gap-2">
          <select className="input-field text-sm w-36" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            {['admin', 'agent', 'buyer'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      {editing?.id === u._id ? (
                        <select className="input-field text-xs py-1 w-24" value={editing.role} onChange={e => setEditing(ed => ({ ...ed, role: e.target.value }))}>
                          {['admin', 'agent', 'buyer'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      ) : (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {editing?.id === u._id ? (
                        <select className="input-field text-xs py-1 w-24" value={editing.isActive ? 'true' : 'false'} onChange={e => setEditing(ed => ({ ...ed, isActive: e.target.value === 'true' }))}>
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      ) : (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {editing?.id === u._id ? (
                          <>
                            <button onClick={() => handleUpdate(u._id, { role: editing.role, isActive: editing.isActive })} className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditing(null)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setViewingId(u._id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="View full profile">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditing({ id: u._id, role: u.role, isActive: u.isActive })} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded hover:bg-red-50 text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
            <button key={pg} onClick={() => setPage(pg)} className={`w-8 h-8 rounded-lg text-sm ${pg === page ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`}>{pg}</button>
          ))}
        </div>
      )}
    </div>
  );
}
