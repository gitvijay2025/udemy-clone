'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { login, saveSession } from '@/lib/client-api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    try {
      const session = await login({ email, password });
      saveSession(session);

      if (session.user.role === 'INSTRUCTOR' || session.user.role === 'ADMIN') {
        router.push('/instructor/courses');
      } else {
        router.push('/my-learning');
      }
    } catch {
      setError('Invalid credentials or API unavailable.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-900">Login</h1>
      <p className="mt-2 text-slate-600">Access your learning dashboard.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input name="password" type="password" required className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={loading} className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-slate-600">
          <Link href="/auth/forgot-password" className="font-semibold text-violet-700">
            Forgot password?
          </Link>
        </p>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        No account?{' '}
        <Link href="/auth/register" className="font-semibold text-violet-700">
          Register
        </Link>
      </p>
    </main>
  );
}
