'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { verifyCertificate } from '@/lib/client-api';

type CertData = {
  id: number;
  studentName: string;
  courseName: string;
  courseSlug: string;
  instructorName: string;
  issuedAt: string;
};

export default function CertificateViewPage() {
  const params = useParams();
  const certId = params.id as string;

  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    verifyCertificate(certId)
      .then((data) => setCert(data as unknown as CertData))
      .catch(() => setError('Certificate not found'))
      .finally(() => setLoading(false));
  }, [certId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">Loading certificate...</p>
      </main>
    );
  }

  if (error || !cert) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">{error || 'Certificate not found'}</p>
          <a href="/certificates" className="mt-4 inline-block text-sm text-violet-700">
            ← Back to certificates
          </a>
        </div>
      </main>
    );
  }

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      {/* Print button */}
      <div className="mx-auto mb-4 flex max-w-4xl justify-end px-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* Certificate */}
      <div className="mx-auto max-w-4xl print:max-w-none">
        <div className="relative mx-4 overflow-hidden rounded-2xl border-4 border-amber-400 bg-white shadow-2xl print:mx-0 print:rounded-none print:border-4 print:shadow-none">
          {/* Decorative border */}
          <div className="absolute inset-3 rounded-xl border-2 border-amber-200 pointer-events-none" />

          <div className="relative px-12 py-16 text-center sm:px-20 sm:py-20">
            {/* Header ornament */}
            <div className="text-4xl text-amber-400">✦</div>

            {/* Title */}
            <h1 className="mt-4 text-lg font-semibold uppercase tracking-[0.3em] text-slate-400">
              Certificate of Completion
            </h1>

            <p className="mt-6 text-sm text-slate-500">This is to certify that</p>

            {/* Student name */}
            <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {cert.studentName}
            </h2>

            <p className="mt-6 text-sm text-slate-500">has successfully completed the course</p>

            {/* Course title */}
            <h3 className="mt-3 text-2xl font-bold text-violet-700 sm:text-3xl">
              {cert.courseName}
            </h3>

            {/* Instructor */}
            <p className="mt-8 text-sm text-slate-500">
              Instructed by
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-700"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {cert.instructorName}
            </p>

            {/* Divider */}
            <div className="mx-auto mt-8 h-px w-48 bg-amber-300" />

            {/* Date & ID */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Date Issued</p>
                <p className="mt-1 font-semibold text-slate-700">{issuedDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Certificate ID</p>
                <p className="mt-1 font-mono text-xs text-slate-600">CERT-{String(cert.id).padStart(6, '0')}</p>
              </div>
            </div>

            {/* Seal */}
            <div className="mt-10 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-50 text-3xl">
              🏆
            </div>

            {/* Footer */}
            <p className="mt-6 text-xs text-slate-400">
              Udemy Clone · Online Learning Platform
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
