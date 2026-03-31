'use client';

import { useState } from 'react';
import { enrollInCourse } from '@/lib/client-api';
import { useRouter } from 'next/navigation';

type Props = {
  courseId: string;
};

export function EnrollButton({ courseId }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          setLoading(true);
          setMessage(null);
          try {
            await enrollInCourse(courseId);
            setMessage('Enrolled successfully.');
            router.push('/my-learning');
          } catch {
            setMessage('Please login as a student first.');
          } finally {
            setLoading(false);
          }
        }}
        className="w-full rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Enrolling...' : 'Enroll now'}
      </button>
      {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
    </div>
  );
}
