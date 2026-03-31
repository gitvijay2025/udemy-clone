'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LearningItem, listMyLearning, generateCertificate, getStoredUser } from '@/lib/client-api';

export default function MyLearningPage() {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      setError('Login to see your enrolled courses.');
      return;
    }

    (async () => {
      try {
        const result = await listMyLearning();
        setItems(result);
      } catch {
        setError('Failed to load your courses. Please try again.');
      }
    })();
  }, []);

  async function handleCertificate(courseId: string) {
    try {
      const cert = await generateCertificate(courseId);
      window.location.href = `/certificates/${cert.id}`;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cannot generate certificate';
      alert(msg);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">My learning</h1>
      <p className="mt-2 text-slate-600">Continue your enrolled courses.</p>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-4 flex gap-4">
        <Link
          href="/certificates"
          className="text-sm font-semibold text-violet-700 hover:text-violet-600"
        >
          View Certificates →
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            {item.course.thumbnailUrl && (
              <img
                src={item.course.thumbnailUrl}
                alt={item.course.title}
                className="mb-3 h-32 w-full rounded-lg object-cover"
              />
            )}
            <span className="inline-flex rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
              {item.course.level}
            </span>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{item.course.title}</h2>
            <p className="mt-1 text-sm text-slate-600">By {item.course.instructor.name}</p>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Progress</span>
                <span className="font-semibold text-slate-900">{item.progress}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.progress === 100 ? 'bg-green-500' : 'bg-violet-500'
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/learn/${item.course.id}`}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                {item.progress > 0 ? 'Continue' : 'Start'}
              </Link>
              <Link
                href={`/messages?to=${item.course.instructor.id}&name=${encodeURIComponent(item.course.instructor.name)}`}
                className="rounded-md border border-violet-300 bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700 hover:bg-violet-100"
              >
                💬 Message Instructor
              </Link>
              {item.progress === 100 && (
                <button
                  onClick={() => handleCertificate(item.course.id)}
                  className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-500"
                >
                  Get Certificate
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Enrolled {new Date(item.enrolledAt).toLocaleDateString()}
              {item.completedAt && ` · Completed ${new Date(item.completedAt).toLocaleDateString()}`}
            </p>
          </article>
        ))}

        {items.length === 0 && !error && (
          <div className="col-span-2 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            <p className="text-lg font-medium">No enrolled courses yet</p>
            <p className="mt-1 text-sm">Browse the catalog and enroll in a course to get started.</p>
            <Link
              href="/courses"
              className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Explore Courses
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
