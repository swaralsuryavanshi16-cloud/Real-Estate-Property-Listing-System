import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProperties, deleteProperty } from '../../api/properties';
import { useAuth } from '../../context/AuthContext';
import { Building2, Plus, Edit, Trash2, Eye, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function MyListings() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await getProperties({ limit: 50 });
      // filter to agent's own
      const mine = (data.data || []).filter(p => {
        const agentId = typeof p.agent === 'object' ? p.agent?._id : p.agent;
        return agentId === user?.id;
      });
      setProperties(mine);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this property?')) return;
    try {
      await deleteProperty(id);
      toast.success('Deleted');
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;

 return (
  <div className="space-y-8">
    {/* Header */}
    <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">
            My Listings
          </h1>

          <p className="mt-2 text-blue-100">
            Manage all your properties from one place
          </p>

          <div className="flex gap-8 mt-6">
            <div>
              <h2 className="text-3xl font-bold">
                {properties.length}
              </h2>
              <p className="text-blue-100">Properties</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {properties.filter(p => p.isApproved).length}
              </h2>
              <p className="text-blue-100">Approved</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {properties.filter(p => !p.isApproved).length}
              </h2>
              <p className="text-blue-100">Pending</p>
            </div>
          </div>
        </div>

        <Link
          to="/agent/my-listings/new"
          className="mt-6 md:mt-0 bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>
    </div>

    {/* Empty */}
    {properties.length === 0 ? (
      <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
        <Building2 className="mx-auto w-20 h-20 text-gray-300" />

        <h2 className="mt-5 text-2xl font-bold">
          No Properties Yet
        </h2>

        <p className="text-gray-500 mt-2">
          Create your first listing and start getting customers.
        </p>

        <Link
          to="/agent/my-listings/new"
          className="inline-flex mt-8 items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl"
        >
          <Plus className="w-5 h-5" />
          Add Listing
        </Link>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {properties.map((p) => {
          const img = p.images?.[0]
            ? `${BASE}${p.images[0].path}`
            : null;

          return (
            <div
              key={p._id}
              className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
                {img ? (
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="h-full flex justify-center items-center bg-gray-100">
                    <Building2 className="w-16 h-16 text-gray-300" />
                  </div>
                )}

                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.status === "sale"
                        ? "bg-blue-600 text-white"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  {p.isApproved ? (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                      Approved
                    </span>
                  ) : (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="font-bold text-xl line-clamp-1">
                  {p.title}
                </h2>

                <div className="flex items-center text-gray-500 mt-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  {p.location?.city}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">
                      Price
                    </p>

                    <h3 className="text-2xl font-bold text-indigo-600">
                      ₹{p.price?.toLocaleString()}
                    </h3>
                  </div>

                  <span className="capitalize bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {p.type}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                  <Link
                    to={`/properties/${p._id}`}
                    className="flex-1 flex justify-center items-center py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>

                  <Link
                    to={`/agent/my-listings/${p._id}/edit`}
                    className="flex-1 flex justify-center items-center py-3 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="flex-1 flex justify-center items-center py-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
}