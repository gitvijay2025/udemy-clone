'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getAdminCourseDetail,
  approveCourse,
  rejectCourse,
  getVideoStreamUrl,
} from '@/lib/client-api';

type Lecture = {
  id: number;
  title: string;
  position: number;
  isPublished: boolean;
  isFreePreview: boolean;
  durationSec: number | null;
  content: string | null;
  videoUrl: string | null;
  hasVideo: boolean;
};

type Section = {
  id: number;
  title: string;
  position: number;
  isPublished: boolean;
  lectures: Lecture[];
};

type CourseDetail = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string | number;
  level: string;
  language: string;
  status: string;
  thumbnailUrl: string | null;
  previewVideoUrl: string | null;
  requirements: string | null;
  targetAudience: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  instructor: { id: number; name: string; email: string };
  category: { id: number; name: string; slug: string } | null;
  averageRating: number;
  _count: { enrollments: number; reviews: number; sections: number; lectures: number };
  sections: Section[];
};

export default function AdminCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Video preview
  const [previewLectureId, setPreviewLectureId] = useState<number | null>(null);
  const [previewStreamUrl, setPreviewStreamUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function loadCourse() {
    setLoading(true);
    try {
      const data = await getAdminCourseDetail(courseId);
      setCourse(data);
      // Expand all sections by default
      setExpandedSections(new Set(data.sections.map((s: Section) => s.id)));
    } catch {
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    try {
      await approveCourse(courseId);
      setActionMsg('✅ Course approved and published!');
      await loadCourse();
    } catch {
      setActionMsg('Failed to approve');
    }
  }

  async function handleReject() {
    const reason = prompt('Reason for rejection (optional):');
    try {
      await rejectCourse(courseId, reason ?? undefined);
      setActionMsg('❌ Course rejected.');
      await loadCourse();
    } catch {
      setActionMsg('Failed to reject');
    }
  }

  async function handlePreviewVideo(lectureId: number) {
    if (previewLectureId === lectureId) {
      setPreviewLectureId(null);
      setPreviewStreamUrl('');
      return;
    }
    setPreviewLoading(true);
    setPreviewLectureId(lectureId);
    try {
      const { streamUrl } = await getVideoStreamUrl(String(lectureId));
      setPreviewStreamUrl(streamUrl);
    } catch {
      setPreviewStreamUrl('');
    } finally {
      setPreviewLoading(false);
    }
  }

  function toggleSection(sectionId: number) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }

  function parseJsonList(str: string | null): string[] {
    if (!str) return [];
    try { return JSON.parse(str); } catch { return []; }
  }

  function formatDuration(sec: number | null): string {
    if (!sec) return '—';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-700',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-700',
    PUBLISHED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error || 'Course not found'}</p>
        <Link href="/admin/courses" className="mt-4 inline-block text-sm text-violet-700">
          ← Back to courses
        </Link>
      </div>
    );
  }

  const requirements = parseJsonList(course.requirements);
  const targetAudience = parseJsonList(course.targetAudience);

  return (
    <div className="p-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/admin/courses" className="hover:text-violet-700">Courses</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{course.title}</span>
      </div>

      {/* Header */}
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[course.status] ?? 'bg-slate-100 text-slate-700'}`}>
              {course.status}
            </span>
            <span>{course.level}</span>
            {course.language && <span>· {course.language}</span>}
            <span>· ${Number(course.price).toFixed(2)}</span>
            {course.category && <span>· {course.category.name}</span>}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            By <strong className="text-slate-700">{course.instructor.name}</strong> ({course.instructor.email})
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          {course.status !== 'APPROVED' && (
            <button
              onClick={handleApprove}
              className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-500"
            >
              ✓ Approve & Publish
            </button>
          )}
          {course.status !== 'REJECTED' && (
            <button
              onClick={handleReject}
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              ✕ Reject
            </button>
          )}
        </div>
      </div>

      {actionMsg && (
        <p className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">{actionMsg}</p>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Sections', value: course._count.sections },
          { label: 'Lectures', value: course._count.lectures },
          { label: 'Enrollments', value: course._count.enrollments },
          { label: 'Avg Rating', value: course.averageRating > 0 ? `★ ${course.averageRating.toFixed(1)} (${course._count.reviews})` : 'No reviews' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Thumbnail */}
      {course.thumbnailUrl && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-700">Thumbnail</h3>
          <img
            src={course.thumbnailUrl}
            alt="Course thumbnail"
            className="mt-2 h-40 rounded-lg object-cover border border-slate-200"
          />
        </div>
      )}

      {/* Description */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Description</h2>
        <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{course.description}</p>
      </div>

      {/* Requirements & Target Audience */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {requirements.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Requirements</h3>
            <ul className="mt-2 space-y-1">
              {requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-slate-400">•</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {targetAudience.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Target Audience</h3>
            <ul className="mt-2 space-y-1">
              {targetAudience.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-green-500">✓</span>{t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Course Content — Sections & Lectures */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Course Content
          <span className="ml-2 text-sm font-normal text-slate-500">
            {course._count.sections} sections · {course._count.lectures} lectures
          </span>
        </h2>

        <div className="mt-4 space-y-3">
          {course.sections.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
              No sections added yet.
            </p>
          )}

          {course.sections.map((section) => (
            <div key={section.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {expandedSections.has(section.id) ? '▼' : '▶'}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Section {section.position}: {section.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {section.lectures.length} lecture(s)
                      {!section.isPublished && (
                        <span className="ml-2 rounded bg-yellow-100 px-1.5 py-0.5 text-yellow-700">Unpublished</span>
                      )}
                    </p>
                  </div>
                </div>
              </button>

              {/* Lectures */}
              {expandedSections.has(section.id) && (
                <div className="border-t border-slate-100">
                  {section.lectures.length === 0 && (
                    <p className="px-5 py-3 text-sm text-slate-400">No lectures in this section.</p>
                  )}
                  {section.lectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className="border-b border-slate-50 px-5 py-3 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                            {lecture.position}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{lecture.title}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              {lecture.durationSec ? (
                                <span>⏱ {formatDuration(lecture.durationSec)}</span>
                              ) : null}
                              {lecture.hasVideo && (
                                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700">🎬 Video</span>
                              )}
                              {lecture.content && (
                                <span className="rounded bg-purple-100 px-1.5 py-0.5 text-purple-700">📝 Text</span>
                              )}
                              {lecture.isFreePreview && (
                                <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-700">Free Preview</span>
                              )}
                              {!lecture.isPublished && (
                                <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-yellow-700">Unpublished</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Preview video button */}
                        {lecture.hasVideo && (
                          <button
                            onClick={() => handlePreviewVideo(lecture.id)}
                            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                              previewLectureId === lecture.id
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                            }`}
                          >
                            {previewLectureId === lecture.id ? '✕ Close' : '▶ Preview'}
                          </button>
                        )}
                      </div>

                      {/* Video player */}
                      {previewLectureId === lecture.id && (
                        <div className="mt-3 rounded-lg bg-slate-900 overflow-hidden">
                          {previewLoading ? (
                            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                              Loading video...
                            </div>
                          ) : previewStreamUrl ? (
                            <video
                              src={previewStreamUrl}
                              controls
                              controlsList="nodownload"
                              disablePictureInPicture
                              onContextMenu={(e) => e.preventDefault()}
                              className="w-full max-h-80"
                            />
                          ) : (
                            <div className="flex h-48 items-center justify-center text-sm text-red-400">
                              Unable to load video
                            </div>
                          )}
                        </div>
                      )}

                      {/* Text content */}
                      {lecture.content && (
                        <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-line max-h-40 overflow-auto">
                          {lecture.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="mt-6 text-xs text-slate-400">
        Created {new Date(course.createdAt).toLocaleString()} · Updated {new Date(course.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
