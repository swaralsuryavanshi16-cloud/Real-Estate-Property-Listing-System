import { useState } from 'react';
import { FileText, ShieldCheck, ShieldAlert, ShieldQuestion, Sparkles, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { verifyDocuments } from '../../api/properties';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const STATUS_CONFIG = {
  verified: { icon: ShieldCheck, color: 'text-green-600 bg-green-50', label: 'Verified' },
  flagged: { icon: ShieldAlert, color: 'text-red-600 bg-red-50', label: 'Needs review' },
  unverified: { icon: ShieldQuestion, color: 'text-gray-500 bg-gray-100', label: 'Not yet tested' },
};

export default function DocumentVerification({ property, canVerify, onUpdated }) {
  const [documents, setDocuments] = useState(property.documents || []);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(null);

  if (!documents || documents.length === 0) return null;

  const runVerification = async () => {
    setRunning(true);
    try {
      const { data } = await verifyDocuments(property._id);
      setDocuments(data.data);
      onUpdated?.(data.data);
      toast.success('AI document testing complete.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
    setRunning(false);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Documents
        </h3>
        {canVerify && (
          <button
            onClick={runVerification}
            disabled={running}
            className="text-xs btn-secondary py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {running ? 'Testing...' : 'Run AI Verification'}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {documents.map((doc) => {
          const cfg = STATUS_CONFIG[doc.verificationStatus] || STATUS_CONFIG.unverified;
          const Icon = cfg.icon;
          const isOpen = expanded === doc.filename;
          return (
            <div key={doc.filename} className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 p-2.5">
                <a
                  href={`${BASE}${doc.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0 text-sm text-primary-600 hover:underline truncate"
                >
                  📄 {doc.originalName}
                </a>
                <span className="text-[10px] text-gray-400 uppercase flex-shrink-0">{doc.docType?.replace('_', ' ')}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 flex-shrink-0 ${cfg.color}`}>
                  <Icon className="w-3 h-3" /> {cfg.label}
                  {doc.verificationScore !== null && doc.verificationScore !== undefined && ` · ${doc.verificationScore}%`}
                </span>
                {doc.verificationNotes?.length > 0 && (
                  <button
                    onClick={() => setExpanded(isOpen ? null : doc.filename)}
                    className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              {isOpen && doc.verificationNotes?.length > 0 && (
                <ul className="px-3 pb-3 space-y-1">
                  {doc.verificationNotes.map((n, i) => (
                    <li key={i} className="text-xs text-gray-500 flex gap-1.5">
                      <span className="text-gray-300">•</span>{n}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
