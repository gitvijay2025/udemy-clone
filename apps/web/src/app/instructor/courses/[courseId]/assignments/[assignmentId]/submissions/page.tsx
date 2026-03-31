'use client';

import { useState, useEffect } from 'react';
import {
  getAssignmentSubmissions,
  gradeAssignment,
  type AssignmentSubmission,
} from '@/lib/client-api';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function AssignmentSubmissionsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const assignmentId = params.assignmentId as string;

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<Record<string, { grade: string; feedback: string }>>({});

  useEffect(() => {
    loadSubmissions();
  }, [assignmentId]);

  async function loadSubmissions() {
    try {
      const data = await getAssignmentSubmissions(assignmentId);
      setSubmissions(data);
    } catch {
      console.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }

  async function handleGrade(submissionId: string) {
    const g = grading[submissionId];
    if (!g || !g.grade) return;
    try {
      await gradeAssignment(submissionId, {
        score: Number(g.grade),
        feedback: g.feedback || undefined,
      });
      await loadSubmissions();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to grade');
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500">Loading...</div>;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link href={`/instructor/courses/${courseId}/edit`} className="text-sm text-violet-700">
        ← Back to course editor
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Assignment Submissions</h1>
      <p className="mt-1 text-sm text-slate-500">{submissions.length} submission(s)</p>

      {submissions.length === 0 && (
        <p className="mt-8 text-center text-slate-400">No submissions yet.</p>
      )}

      <div className="mt-6 space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                </p>
                {sub.gradedAt && (
                  <p className="text-xs text-green-500">
                    Graded {new Date(sub.gradedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              {sub.score !== undefined && sub.score !== null && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  Score: {sub.score}
                </span>
              )}
            </div>
            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
              {sub.content}
            </div>
            {sub.fileUrl && (
              <a
                href={sub.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-violet-600 underline"
              >
                View attached file
              </a>
            )}
            {sub.feedback && (
              <div className="mt-3 rounded-lg border-l-4 border-violet-400 bg-violet-50 p-3 text-sm text-violet-700">
                <strong>Feedback:</strong> {sub.feedback}
              </div>
            )}
            {(sub.score === undefined || sub.score === null) && (
              <div className="mt-4 flex items-end gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500">Grade</label>
                  <input
                    type="number"
                    value={grading[sub.id]?.grade ?? ''}
                    onChange={(e) =>
                      setGrading({ ...grading, [sub.id]: { ...grading[sub.id], grade: e.target.value, feedback: grading[sub.id]?.feedback ?? '' } })
                    }
                    className="mt-1 w-24 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500">Feedback</label>
                  <input
                    type="text"
                    value={grading[sub.id]?.feedback ?? ''}
                    onChange={(e) =>
                      setGrading({ ...grading, [sub.id]: { ...grading[sub.id], feedback: e.target.value, grade: grading[sub.id]?.grade ?? '' } })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    placeholder="Optional feedback..."
                  />
                </div>
                <button
                  onClick={() => handleGrade(sub.id)}
                  className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white"
                >
                  Grade
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
