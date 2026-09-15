import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Eye, EyeOff } from '../../components/common/icons';
import feedbackService from '../../services/feedbackService';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pending | responded
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setFeedbacks(await feedbackService.getAll());
    } catch (err) {
      console.error('Failed to load feedback', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const handleRespond = async (id) => {
    try {
      await feedbackService.update(id, { managerResponse: { message: replyText, respondedAt: new Date() } });
      setReplyingId(null);
      setReplyText('');
      await fetchFeedbacks();
    } catch (err) {
      console.error('Failed to respond', err);
    }
  };

  const toggleVisibility = async (f) => {
    try {
      await feedbackService.update(f._id, { isPubliclyDisplayed: !f.isPubliclyDisplayed });
      await fetchFeedbacks();
    } catch (err) {
      console.error('Failed to toggle visibility', err);
    }
  };

  const filtered = feedbacks.filter((f) => {
    if (filter === 'pending') return !f.managerResponse?.message;
    if (filter === 'responded') return !!f.managerResponse?.message;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guest Feedback & Ratings"
        subtitle="Review guest ratings, respond to feedback, and manage what's publicly displayed."
      />

      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {['all', 'pending', 'responded'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filter === f ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading feedback..." />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 py-16 text-center text-slate-400">
          <MessageSquare size={28} className="mx-auto mb-2 text-slate-300" />
          No feedback records found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((f) => (
            <div key={f._id} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < (f.overallRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                    ))}
                    <span className="ml-2 text-xs font-semibold text-slate-700">{f.overallRating}/5</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-2">{f.comment}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {f.guestId?.firstName || f.guestId?.username || 'Guest'} · {new Date(f.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => toggleVisibility(f)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer shrink-0"
                  title={f.isPubliclyDisplayed ? 'Hide from public site' : 'Show on public site'}
                >
                  {f.isPubliclyDisplayed ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>

              {f.managerResponse?.message ? (
                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                  <p className="font-semibold text-slate-700 mb-1">Management Response</p>
                  <p className="text-slate-600">{f.managerResponse.message}</p>
                </div>
              ) : replyingId === f._id ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={2}
                    className="input-field py-2 text-xs"
                    placeholder="Write a response to this guest..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(f._id)} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer">
                      Send Response
                    </button>
                    <button onClick={() => setReplyingId(null)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setReplyingId(f._id); setReplyText(''); }}
                  className="mt-3 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  Reply to Guest →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
