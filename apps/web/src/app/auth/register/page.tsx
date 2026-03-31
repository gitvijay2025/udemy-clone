'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { register, saveSession, UserRole } from '@/lib/client-api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const name = String(form.get('name') ?? '');
    const password = String(form.get('password') ?? '');
    const role = String(form.get('role') ?? 'STUDENT') as UserRole;

    try {
      const session = await register({ email, name, password, role });
      saveSession(session);

      if (role === 'INSTRUCTOR' || role === 'ADMIN') {
        router.push('/instructor/courses/new');
      } else {
        router.push('/courses');
      }
    } catch {
      setError('Could not register. API may be unavailable or email already exists.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
      <p className="mt-2 text-slate-600">Join as learner or instructor.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input name="name" type="text" required className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input name="password" type="password" minLength={6} required className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Role</label>
          <select name="role" className="w-full rounded-md border border-slate-300 px-3 py-2">
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={loading} className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white disabled:opacity-50">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-semibold text-violet-700">
          Login
        </Link>
      </p>
    </main>
  );
}
