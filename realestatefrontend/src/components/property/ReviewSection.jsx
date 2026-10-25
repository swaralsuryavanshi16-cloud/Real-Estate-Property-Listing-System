import { useEffect, useState } from 'react';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPropertyReviews, createReview, deleteReview } from '../../api/reviews';
import { useAuth } from '../../context/AuthContext';

function StarRow({ value, onChange, size = 'w-5 h-5' }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          disabled={!onChange}
        >
          <Star
            className={`${size} ${(hover || value) >= n ? 'fill-gold-400 text-gold-500' : 'fill-gray-200 text-gray-200'}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ propertyId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getPropertyReviews(propertyId);
      setReviews(data.data || []);
      setAvgRating(data.avgRating || 0);
      setNumReviews(data.numReviews || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [propertyId]);

  const myReview = reviews.find((r) => r.user?._id === user?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a star rating.');
    if (!comment.trim()) return toast.error('Please write a short review.');
    setSubmitting(true);
    try {
      await createReview(propertyId, { rating, comment: comment.trim() });
      toast.success('Thanks for your review!');
      setRating(0);
      setComment('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      toast.success('Review deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Reviews & Ratings
        </h3>
        {numReviews > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRow value={Math.round(avgRating)} size="w-4 h-4" />
            <span className="text-sm font-semibold text-gray-900">{avgRating}</span>
            <span className="text-xs text-gray-500">({numReviews})</span>
          </div>
        )}
      </div>

      {/* Form */}
      {!myReview && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Your rating</label>
            <StarRow value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this property or agent..."
            rows={3}
            className="input-field resize-none"
          />
          <button type="submit" disabled={submitting} className="btn-primary text-sm">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* List */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-400">No reviews yet. Be the first to share your experience.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                    {r.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.user?.name || 'User'}</p>
                    <StarRow value={r.rating} size="w-3.5 h-3.5" />
                  </div>
                </div>
                {(r.user?._id === user?.id || user?.role === 'admin') && (
                  <button onClick={() => handleDelete(r._id)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
