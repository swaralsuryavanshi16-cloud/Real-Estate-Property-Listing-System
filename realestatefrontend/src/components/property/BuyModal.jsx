import { useState } from 'react';
import { X, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { createPurchase } from '../../api/purchases';

export default function BuyModal({ property, onClose, onSuccess }) {
  const [offerPrice, setOfferPrice] = useState(property.price || '');
  const [message, setMessage] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offerPrice || Number(offerPrice) <= 0) return toast.error('Enter a valid offer price.');
    setSubmitting(true);
    try {
      await createPurchase(property._id, {
        offerPrice: Number(offerPrice),
        message: message.trim(),
        contactPhone: contactPhone.trim(),
      });
      toast.success('Offer sent to the agent!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit offer');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Make an Offer</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900 truncate">{property.title}</p>
            <p className="text-xs text-gray-500">Listed price: ₹{property.price?.toLocaleString('en-IN')}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Your offer price *</label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                min="1"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="input-field pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Contact phone (optional)</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="For the agent to reach you"
              className="input-field"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Message to agent (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="I'm interested in this property because..."
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 text-sm">
              {submitting ? 'Sending...' : 'Send Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
