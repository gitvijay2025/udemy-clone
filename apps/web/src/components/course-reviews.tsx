'use client';

import { useState, useEffect } from 'react';
import {
  getCourseReviews,
  createReview,
  deleteReview,
  getStoredUser,
  type Review,
  type ReviewsResponse,
} from '@/lib/client-api';

export function CourseReviews({ courseId, instructorId }: { courseId: string; instructorId?: string }) {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = getStoredUser();

  useEffect(() => {
    loadReviews();
  }, [courseId]);

  async function loadReviews() {
    try {
      const res = await getCourseReviews(courseId);
      setData(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReview(courseId, { rating, comment: comment || undefined });
      setShowForm(false);
      setComment('');
      setRating(5);
      await loadReviews();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit review';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(reviewId: string) {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteReview(reviewId);
      await loadReviews();
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <p className="mt-4 text-sm text-slate-500">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Student Reviews</h2>
          {data && (
            <p className="mt-1 text-sm text-slate-500">
              {data.averageRating > 0 && (
                <span className="text-amber-600 font-semibold">★ {data.averageRating.toFixed(1)} </span>
              )}
              {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {user && !showForm && String(user.id) !== String(instructorId) && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 rounded-lg border border-slate-200 p-4">
          <label className="block text-sm font-medium text-slate-700">Rating</label>
          <div className="mt-1 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-amber-500' : 'text-slate-300'}`}
              >
                ★
              </button>
            ))}
          </div>
          <label className="mt-3 block text-sm font-medium text-slate-700">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Share your experience..."
          />
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Review list */}
      <div className="mt-6 space-y-4">
        {data?.reviews.map((review: Review) => (
          <div
            key={review.id}
            className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                  {review.user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{review.user.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 text-sm">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              {user?.id === review.user.id && (
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            {review.comment && (
              <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
            )}
          </div>
        ))}
        {(!data?.reviews || data.reviews.length === 0) && (
          <p className="text-sm text-slate-500">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}
