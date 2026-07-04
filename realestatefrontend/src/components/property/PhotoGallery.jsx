import { useState } from 'react';
import { Building2, X, ChevronLeft, ChevronRight, Tag, Pencil, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateImageDetails } from '../../api/properties';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ROOM_LABELS = {
  exterior: 'Exterior',
  living_room: 'Living Room',
  bedroom: 'Bedroom',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  balcony: 'Balcony',
  other: 'Other',
};

export default function PhotoGallery({ propertyId, images, canEdit }) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ caption: '', room: 'other' });
  const [items, setItems] = useState(images || []);
  const [saving, setSaving] = useState(false);

  if (!items || items.length === 0) {
    return (
      <div className="card overflow-hidden">
        <div className="aspect-video flex items-center justify-center bg-gray-100">
          <Building2 className="w-20 h-20 text-gray-300" />
        </div>
      </div>
    );
  }

  const current = items[selected];

  const startEdit = () => {
    setDraft({ caption: current.caption || '', room: current.room || 'other' });
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await updateImageDetails(propertyId, current.filename, draft);
      setItems((prev) => prev.map((img, i) => (i === selected ? { ...img, ...draft } : img)));
      toast.success('Photo details updated');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update photo');
    }
    setSaving(false);
  };

  const next = () => setSelected((s) => (s + 1) % items.length);
  const prev = () => setSelected((s) => (s - 1 + items.length) % items.length);

  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-video bg-gray-200 overflow-hidden group">
        <img
          src={`${BASE}${current.path}`}
          alt={current.caption || ''}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        />
        {(current.caption || current.room) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex items-center justify-between">
            <div className="text-white text-sm min-w-0">
              {current.room && current.room !== 'other' && (
                <span className="inline-flex items-center gap-1 text-xs bg-white/20 backdrop-blur px-2 py-0.5 rounded-full mb-1">
                  <Tag className="w-3 h-3" /> {ROOM_LABELS[current.room]}
                </span>
              )}
              {current.caption && <p className="truncate">{current.caption}</p>}
            </div>
          </div>
        )}
        {canEdit && !editing && (
          <button
            onClick={startEdit}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="w-3 h-3" /> Edit details
          </button>
        )}
      </div>

      {editing && (
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2 items-center">
          <select
            value={draft.room}
            onChange={(e) => setDraft((d) => ({ ...d, room: e.target.value }))}
            className="input-field w-auto text-xs py-1.5"
          >
            {Object.entries(ROOM_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <input
            value={draft.caption}
            onChange={(e) => setDraft((d) => ({ ...d, caption: e.target.value }))}
            placeholder="Caption (e.g. 'North-facing balcony with garden view')"
            className="input-field flex-1 min-w-[160px] text-xs py-1.5"
          />
          <button onClick={saveEdit} disabled={saving} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Save
          </button>
          <button onClick={() => setEditing(false)} className="text-xs text-gray-500 px-2">Cancel</button>
        </div>
      )}

      {items.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {items.map((img, i) => (
            <button
              key={img.filename || i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${i === selected ? 'border-primary-600' : 'border-transparent'}`}
            >
              <img src={`${BASE}${img.path}`} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 sm:left-6 text-white p-2 rounded-full hover:bg-white/10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={`${BASE}${current.path}`} alt={current.caption || ''} className="max-w-full max-h-[75vh] object-contain rounded-lg" />
            {(current.caption || current.room) && (
              <div className="text-white text-center mt-3">
                {current.room && current.room !== 'other' && <p className="text-xs uppercase tracking-wide text-gray-300">{ROOM_LABELS[current.room]}</p>}
                {current.caption && <p className="text-sm mt-1">{current.caption}</p>}
              </div>
            )}
          </div>
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 sm:right-6 text-white p-2 rounded-full hover:bg-white/10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
