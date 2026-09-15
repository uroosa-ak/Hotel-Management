import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from '../../components/common/icons';
import feedbackService from '../../services/feedbackService';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GuestFeedbackHistory = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackService.getMine().then(setFeedbacks).catch((err) => console.error('Failed to load feedback history', err)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Loading your reviews..." />;

  return (
    <div className="app-shell bg-background min-h-screen py-10">
      <div className="page-container max-w-3xl">
        <PageHeader title="My Feedback History" subtitle="Reviews you've submitted and the hotel's responses." />

        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-16 text-center text-slate-400 text-sm">
            <MessageSquare size={28} className="mx-auto mb-2 text-slate-300" />
            You haven't submitted any reviews yet.
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((f) => (
              <div key={f._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < (f.overallRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                  ))}
                  <span className="ml-2 text-xs font-semibold text-slate-700">{f.overallRating}/5</span>
                  <span className="ml-auto text-[11px] text-slate-400">{new Date(f.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-700 mt-2">{f.comment}</p>
                {f.managerResponse?.message && (
                  <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                    <p className="font-semibold text-slate-700 mb-1">Management Response</p>
                    <p className="text-slate-600">{f.managerResponse.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestFeedbackHistory;
