import { Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import AuthFooter from './AuthFooter';

export default function PublicPageShell({ title, subtitle, children }) {
  const navigate = useNavigate();
  return (
    <div className="theme-guest min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 text-lg">PropEstate</span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
          <div className="mt-8 prose prose-sm max-w-none text-gray-600 space-y-4">
            {children}
          </div>
        </div>
        <AuthFooter />
      </main>
    </div>
  );
}
