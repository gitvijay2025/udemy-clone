'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { forgotPassword } from '@/lib/client-api';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResetUrl(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');

    try {
      const res = await forgotPassword({ email });
      setSuccess(true);
      // In dev mode the API returns the reset URL
      if (res.resetUrl) {
        setResetUrl(res.resetUrl);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-900">Forgot password</h1>
      <p className="mt-2 text-slate-600">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {success ? (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
          <p className="font-medium text-green-800">
            If an account with that email exists, a reset link has been generated.
          </p>
          {resetUrl && (
            <div className="mt-4">
              <p className="text-sm text-slate-600">
                <strong>Dev mode:</strong> Use this link to reset your password:
              </p>
              <Link
                href={resetUrl.replace('http://localhost:3000', '')}
                className="mt-1 block break-all text-sm font-medium text-violet-700 underline"
              >
                {resetUrl}
              </Link>
            </div>
          )}
          <Link
            href="/auth/login"
            className="mt-4 inline-block text-sm font-semibold text-violet-700"
          >
            ← Back to login
          </Link>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}

      {!success && (
        <p className="mt-4 text-sm text-slate-600">
          Remember your password?{' '}
          <Link href="/auth/login" className="font-semibold text-violet-700">
            Login
          </Link>
        </p>
      )}
    </main>
  );
}
