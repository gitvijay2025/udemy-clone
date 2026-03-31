'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getAdminCourses,
  approveCourse,
  rejectCourse,
  type CourseListItem,
} from '@/lib/client-api';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadCourses();
  }, [statusFilter, page]);

  async function loadCourses() {
    try {
      const data = await getAdminCourses({
        status: statusFilter || undefined,
        page,
        limit: 20,
      });
      setCourses(data.courses);
      setTotal(data.total);
    } catch {
      // ignore
    }
  }

  async function handleApprove(courseId: string) {
    try {
      await approveCourse(courseId);
      await loadCourses();
    } catch {
      // ignore
    }
  }

  async function handleReject(courseId: string) {
    const reason = prompt('Reason for rejection (optional):');
    try {
      await rejectCourse(courseId, reason ?? undefined);
      await loadCourses();
    } catch {
      // ignore
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Manage Courses</h1>

      <div className="mt-6 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-slate-500">{total} course(s)</p>

      <div className="mt-4 space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-4">
              {course.thumbnailUrl && (
                <img
                  src={course.thumbnailUrl}
                  alt=""
                  className="h-16 w-24 rounded-lg object-cover border border-slate-200"
                />
              )}
              <div>
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="font-semibold text-slate-900 hover:text-violet-700"
                >
                  {course.title}
                </Link>
                <p className="text-sm text-slate-500">
                  By {course.instructor.name} · {course.level} · ${Number(course.price).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/courses/${course.id}`}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                View
              </Link>
              <button
                onClick={() => handleApprove(course.id)}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(course.id)}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
