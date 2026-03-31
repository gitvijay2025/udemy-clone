'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  getInstructorCourse,
  getVideoStreamUrl,
  InstructorCourse,
  Resource,
} from '@/lib/client-api';

export default function InstructorCoursePreviewPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId ?? '';

  const [course, setCourse] = useState<InstructorCourse | null>(null);
  const [loading, setLoading] = useState(true);

  // video player state
  const [playingLectureId, setPlayingLectureId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function loadCourse() {
    try {
      const data = await getInstructorCourse(courseId);
      setCourse(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function playLecture(lectureId: string) {
    if (playingLectureId === lectureId) {
      setPlayingLectureId(null);
      setStreamUrl(null);
      return;
    }
    setPlayingLectureId(lectureId);
    setStreamUrl(null);
    setStreamLoading(true);
    try {
      const data = await getVideoStreamUrl(lectureId);
      setStreamUrl(data.streamUrl);
    } catch {
      setStreamUrl(null);
    } finally {
      setStreamLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <p className="mt-3 text-sm text-slate-500">Loading preview...</p>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-2xl font-bold text-slate-900">Course not found</h1>
        <Link href="/instructor/courses" className="mt-4 inline-block text-violet-700">
          Back to dashboard
        </Link>
      </main>
    );
  }

  const requirements: string[] = course.requirements
    ? (() => { try { return JSON.parse(course.requirements); } catch { return []; } })()
    : [];

  const targetAudience: string[] = course.targetAudience
    ? (() => { try { return JSON.parse(course.targetAudience); } catch { return []; } })()
    : [];

  const totalLectures = (course.sections ?? []).reduce(
    (acc, s) => acc + (s.lectures?.length ?? 0),
    0,
  );
  const totalDuration = (course.sections ?? []).reduce(
    (acc, s) =>
      acc + (s.lectures?.reduce((a, l) => a + (l.durationSec ?? 0), 0) ?? 0),
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Preview banner */}
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span className="text-sm font-semibold text-amber-700">
            👁 INSTRUCTOR PREVIEW — This is how students will see your course
          </span>
          <div className="flex items-center gap-3">
            <Link
              href={`/instructor/courses/${courseId}/edit`}
              className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition"
            >
              ← Back to Editor
            </Link>
          </div>
        </div>
      </div>

      {/* Hero section — same as public page */}
      <section className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="max-w-3xl text-4xl font-bold">{course.title}</h1>
          <p className="mt-4 max-w-3xl text-slate-300">{course.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="font-semibold text-violet-300">{course.level}</span>
            {course.language && <span>Language: {course.language}</span>}
            {!course.isPublished && (
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">
                DRAFT
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_340px]">
        {/* Main content */}
        <div className="space-y-8">
          {/* Who this course is for */}
          {targetAudience.length > 0 && (
            <article className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Who this course is for</h2>
              <ul className="mt-4 space-y-2">
                {targetAudience.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          )}

          {/* Requirements */}
          {requirements.length > 0 && (
            <article className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Requirements</h2>
              <ul className="mt-4 space-y-2">
                {requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-slate-400 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          )}

          {/* Curriculum */}
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Course curriculum</h2>
              <span className="text-sm text-slate-500">
                {(course.sections ?? []).length} sections · {totalLectures} lectures
                {totalDuration > 0 && ` · ${Math.round(totalDuration / 60)}m`}
              </span>
            </div>
            <ul className="mt-5 space-y-3">
              {(course.sections ?? []).map((section) => (
                <li key={section.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Section {section.position}
                      </p>
                      <p className="mt-1 font-medium text-slate-900">{section.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!section.isPublished && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {(section.lectures ?? []).map((lecture) => (
                      <li key={lecture.id}>
                        <div
                          className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                            playingLectureId === String(lecture.id)
                              ? 'bg-violet-50 border border-violet-200'
                              : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {lecture.videoUrl ? (
                              <button
                                type="button"
                                onClick={() => playLecture(String(lecture.id))}
                                className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-500 transition"
                                title="Play video"
                              >
                                {playingLectureId === String(lecture.id) ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                )}
                              </button>
                            ) : (
                              <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900">
                                #{lecture.position} {lecture.title}
                              </p>
                              {lecture.durationSec ? (
                                <p className="text-xs text-slate-500">
                                  {Math.floor(lecture.durationSec / 60)}:{String(lecture.durationSec % 60).padStart(2, '0')}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {(lecture.resources ?? []).length > 0 && (
                              <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                📎 {(lecture.resources ?? []).length}
                              </span>
                            )}
                            {lecture.isFreePreview && (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                Preview
                              </span>
                            )}
                            {!lecture.isPublished && (
                              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Video player inline */}
                        {playingLectureId === String(lecture.id) && (
                          <div className="mt-2 rounded-lg border border-slate-200 bg-black overflow-hidden">
                            {streamLoading ? (
                              <div className="flex items-center justify-center py-16">
                                <div className="text-center text-white">
                                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-white" />
                                  <p className="mt-3 text-sm text-slate-400">Loading video...</p>
                                </div>
                              </div>
                            ) : streamUrl ? (
                              <video
                                key={streamUrl}
                                src={streamUrl}
                                controls
                                autoPlay
                                controlsList="nodownload noplaybackrate"
                                disablePictureInPicture
                                onContextMenu={(e) => e.preventDefault()}
                                className="w-full max-h-[480px] object-contain"
                              />
                            ) : (
                              <div className="flex items-center justify-center py-16">
                                <p className="text-sm text-red-400">Unable to load video</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Resources for this lecture */}
                        {(lecture.resources ?? []).length > 0 && (
                          <div className="mt-1 ml-11 flex flex-wrap gap-2">
                            {(lecture.resources ?? []).map((res: Resource) => (
                              <a
                                key={res.id}
                                href={res.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 transition"
                              >
                                <ResourceIcon fileType={res.fileType} />
                                {res.title}
                                <span className="text-slate-400">
                                  ({formatFileSize(res.fileSize)})
                                </span>
                              </a>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {(course.sections ?? []).length === 0 && (
                <li className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
                  No sections yet.
                </li>
              )}
            </ul>
          </article>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            {course.previewVideoUrl && (
              <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-slate-900">
                <video
                  src={course.previewVideoUrl}
                  controls
                  controlsList="nodownload"
                  disablePictureInPicture
                  onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                  className="h-full w-full object-cover"
                  poster={course.thumbnailUrl ?? undefined}
                />
              </div>
            )}
            <p className="text-3xl font-bold text-slate-900">
              {Number(course.price) === 0 ? 'Free' : `$${Number(course.price).toFixed(2)}`}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              One-time purchase · lifetime access
            </p>
            <div className="mt-5 space-y-3">
              <div className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white opacity-60 cursor-not-allowed">
                Add to Cart (Preview)
              </div>
              <div className="w-full rounded-lg border border-violet-200 bg-violet-50 px-4 py-2.5 text-center text-sm font-semibold text-violet-700 opacity-60 cursor-not-allowed">
                Enroll Now (Preview)
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm">
            <h3 className="font-semibold text-slate-900">This course includes:</h3>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li>📹 {totalLectures} lectures</li>
              {totalDuration > 0 && <li>⏱ {Math.round(totalDuration / 60)} minutes of content</li>}
              <li>📂 {(course.sections ?? []).length} sections</li>
              <li>🏆 Full lifetime access</li>
              <li>📜 Certificate of completion</li>
            </ul>
          </div>
          <Link
            href={`/instructor/courses/${courseId}/edit`}
            className="inline-block text-sm font-semibold text-violet-700 hover:underline"
          >
            ← Back to Editor
          </Link>
        </aside>
      </section>
    </main>
  );
}

/* ─── Helper components ─── */

function ResourceIcon({ fileType }: { fileType: string }) {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return <span className="text-red-500">📄</span>;
  if (type.includes('doc') || type.includes('word')) return <span className="text-blue-500">📝</span>;
  if (type.includes('ppt') || type.includes('presentation')) return <span className="text-orange-500">📊</span>;
  if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('gif')) return <span>🖼️</span>;
  return <span>📁</span>;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
