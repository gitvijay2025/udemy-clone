'use client';

import { useEffect, useState } from 'react';
import { getPlatformAnalytics } from '@/lib/client-api';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatformAnalytics()
      .then((d) => setData(d as Record<string, unknown>))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-slate-500">Loading analytics...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Platform Analytics</h1>

      {data && (
        <div className="mt-8">
          <pre className="rounded-xl border border-slate-200 bg-white p-6 overflow-auto text-sm text-slate-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
