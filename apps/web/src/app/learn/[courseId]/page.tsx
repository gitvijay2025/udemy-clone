'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getCourseProgress,
  updateLectureProgress,
  getVideoStreamUrl,
  type CourseProgress,
} from '@/lib/client-api';

type LectureInfo = {
  id: string;
  title: string;
  sectionTitle: string;
  hasVideo: boolean;
  progress: { completed: boolean; watchedSec: number } | null;
};

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [lectures, setLectures] = useState<LectureInfo[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(false);

  useEffect(() => {
    loadProgress();
  }, [courseId]);

  // Fetch signed stream URL whenever the current lecture changes
  useEffect(() => {
    const lecture = lectures[currentIdx];
    if (!lecture || !lecture.hasVideo) {
      setStreamUrl(null);
      return;
    }
    let cancelled = false;
    setStreamLoading(true);
    setStreamUrl(null);
    getVideoStreamUrl(lecture.id)
      .then((data) => {
        if (!cancelled) setStreamUrl(data.streamUrl);
      })
      .catch(() => {
        if (!cancelled) setStreamUrl(null);
      })
      .finally(() => {
        if (!cancelled) setStreamLoading(false);
      });
    return () => { cancelled = true; };
  }, [currentIdx, lectures]);

  async function loadProgress() {
    try {
      const data = await getCourseProgress(courseId);
      setProgress(data);
      // Flatten lectures
      const flat: LectureInfo[] = [];
      data.sections.forEach((s) => {
        s.lectures.forEach((l) => {
          flat.push({
            id: l.id,
            title: l.title,
            sectionTitle: s.title,
            hasVideo: !!(l.hasVideo || l.videoUrl),
            progress: l.progress,
          });
        });
      });
      setLectures(flat);
      // Find first incomplete lecture
      const firstIncomplete = flat.findIndex((l) => !l.progress?.completed);
      if (firstIncomplete >= 0) setCurrentIdx(firstIncomplete);
    } catch {
      // might not be enrolled
    } finally {
      setLoading(false);
    }
  }

  async function markComplete(lectureId: string) {
    try {
      await updateLectureProgress(courseId, lectureId, { completed: true });
      await loadProgress();
    } catch {
      // ignore
    }
  }

  const current = lectures[currentIdx];

  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-slate-500">Loading course...</p>
      </main>
    );
  }

  if (!progress || lectures.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Course not available</h1>
        <p className="mt-2 text-slate-600">
          You may not be enrolled in this course or it has no lectures yet.
        </p>
        <Link
          href="/my-learning"
          className="mt-4 inline-block text-violet-700 font-semibold"
        >
          ← Back to My Learning
        </Link>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-3 text-white">
        <button
          onClick={() => router.push('/my-learning')}
          className="text-sm text-slate-300 hover:text-white"
        >
          ← Back to My Learning
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold">{progress.overallProgress}% Complete</p>
          <div className="mx-auto mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-violet-500"
              style={{ width: `${progress.overallProgress}%` }}
            />
          </div>
        </div>
        <span className="text-sm text-slate-400">
          {currentIdx + 1} / {lectures.length}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 bg-black flex items-center justify-center">
            {current?.hasVideo && streamLoading ? (
              <div className="text-center text-white">
                <p className="text-sm text-slate-400">Loading video...</p>
              </div>
            ) : current?.hasVideo && streamUrl ? (
              <video
                key={`${current.id}-${streamUrl}`}
                src={streamUrl}
                controls
                autoPlay
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                className="h-full w-full object-contain"
                style={{ pointerEvents: 'auto' }}
              />
            ) : (
              <div className="text-center text-white">
                <p className="text-lg font-semibold">{current?.title}</p>
                <p className="mt-2 text-slate-400">No video for this lecture</p>
              </div>
            )}
          </div>
          {/* Controls */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
            <button
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-30"
            >
              ← Previous
            </button>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900">{current?.title}</p>
              <p className="text-xs text-slate-500">{current?.sectionTitle}</p>
            </div>
            <div className="flex gap-2">
              {!current?.progress?.completed && (
                <button
                  onClick={() => markComplete(current.id)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
                >
                  ✓ Mark Complete
                </button>
              )}
              <button
                onClick={() =>
                  setCurrentIdx(Math.min(lectures.length - 1, currentIdx + 1))
                }
                disabled={currentIdx === lectures.length - 1}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: lecture list */}
        <div className="w-80 overflow-y-auto border-l border-slate-200 bg-white">
          <div className="p-3 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900">Course Content</p>
          </div>
          {progress.sections.map((section) => (
            <div key={section.id} className="border-b border-slate-100">
              <p className="bg-slate-50 px-3 py-2 text-xs font-semibold uppercase text-slate-500">
                {section.title}
              </p>
              {section.lectures.map((lecture) => {
                const flatIdx = lectures.findIndex((l) => l.id === lecture.id);
                const isActive = flatIdx === currentIdx;
                const isCompleted = lecture.progress?.completed;
                return (
                  <button
                    key={lecture.id}
                    onClick={() => setCurrentIdx(flatIdx)}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                      isActive ? 'bg-violet-50 text-violet-700' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`flex-shrink-0 ${isCompleted ? 'text-green-500' : 'text-slate-300'}`}>
                      {isCompleted ? '✓' : '○'}
                    </span>
                    <span className={isCompleted ? 'text-slate-500' : ''}>
                      {lecture.title}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
