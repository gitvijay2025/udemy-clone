'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createCourse } from '@/lib/client-api';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') ?? '');
    const description = String(form.get('description') ?? '');
    const level = String(form.get('level') ?? 'BEGINNER') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    const price = Number(form.get('price') ?? 0);

    try {
      await createCourse({
        title,
        slug: slugify(title),
        description,
        level,
        price,
      });
      router.push('/instructor/courses');
    } catch {
      setError('Could not create course. Login as instructor first.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Create a new course</h1>
      <p className="mt-2 text-slate-600">Set basics first, then add sections and publish.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium">Course title</label>
          <input name="title" required minLength={4} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea name="description" required minLength={20} rows={5} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Level</label>
            <select name="level" className="w-full rounded-md border border-slate-300 px-3 py-2">
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Price (USD)</label>
            <input name="price" type="number" min={1} step="0.01" required className="w-full rounded-md border border-slate-300 px-3 py-2" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={loading} className="rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white disabled:opacity-50">
          {loading ? 'Creating...' : 'Create course'}
        </button>
      </form>
    </main>
  );
}
