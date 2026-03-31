'use client';

import { useEffect, useState } from 'react';
import { getMyCertificates, type Certificate } from '@/lib/client-api';
import Link from 'next/link';

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCertificates()
      .then(setCerts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">My Certificates</h1>
      <p className="mt-2 text-slate-600">Certificates earned by completing courses.</p>

      {loading ? (
        <p className="mt-8 text-slate-500">Loading...</p>
      ) : certs.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-lg font-medium text-slate-600">No certificates yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Complete a course to earn your certificate.
          </p>
          <Link
            href="/my-learning"
            className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Go to My Learning
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">
                  🎓
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{cert.course.title}</p>
                  <p className="text-xs text-slate-500">
                    Issued {new Date(cert.issuedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-500"
                >
                  View Certificate
                </a>
                <Link
                  href={`/courses/${cert.course.slug}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
