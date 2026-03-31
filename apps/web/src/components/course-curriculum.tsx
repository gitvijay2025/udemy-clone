'use client';

import { useState } from 'react';
import { getVideoStreamUrl } from '@/lib/client-api';

type LectureResource = {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
};

type Lecture = {
  id: string;
  title: string;
  position: number;
  isPublished: boolean;
  isFreePreview?: boolean;
  durationSec?: number | null;
  videoUrl: string | null;
  resources?: LectureResource[];
};

type Section = {
  id: string;
  title: string;
  position: number;
  isPublished: boolean;
  lectures?: Lecture[];
};

type Props = {
  sections: Section[];
  totalLectures: number;
  totalDuration: number;
};

export function CourseCurriculum({ sections, totalLectures, totalDuration }: Props) {
  const [playingLectureId, setPlayingLectureId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  async function playLecture(lectureId: string) {
    if (playingLectureId === lectureId) {
      setPlayingLectureId(null);
      setStreamUrl(null);
      setStreamError(null);
      return;
    }
    setPlayingLectureId(lectureId);
    setStreamUrl(null);
    setStreamError(null);
    setStreamLoading(true);
    try {
      const data = await getVideoStreamUrl(lectureId);
      setStreamUrl(data.streamUrl);
    } catch {
      setStreamUrl(null);
      setStreamError('Please login to preview this lecture');
    } finally {
      setStreamLoading(false);
    }
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Course curriculum</h2>
        <span className="text-sm text-slate-500">
          {sections.length} sections · {totalLectures} lectures
          {totalDuration > 0 && ` · ${Math.round(totalDuration / 60)}m`}
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {sections.map((section) => (
          <li key={section.id} className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Section {section.position}
            </p>
            <p className="mt-1 font-medium text-slate-900">{section.title}</p>
            <ul className="mt-3 space-y-2">
              {(section.lectures ?? []).map((lecture) => {
                const canPreview = lecture.isFreePreview && lecture.videoUrl;
                const isPlaying = playingLectureId === String(lecture.id);

                return (
                  <li key={lecture.id}>
                    <div
                      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                        isPlaying
                          ? 'bg-violet-50 border border-violet-200'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {canPreview ? (
                          <button
                            type="button"
                            onClick={() => playLecture(String(lecture.id))}
                            className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-500 transition"
                            title="Preview this lecture"
                          >
                            {isPlaying ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            )}
                          </button>
                        ) : lecture.videoUrl ? (
                          <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-400" title="Enroll to watch">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </span>
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
                        {lecture.isFreePreview ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Preview
                          </span>
                        ) : lecture.videoUrl ? (
                          <span className="text-xs text-slate-400">
                            🔒
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Video player inline — only for free preview */}
                    {isPlaying && (
                      <div className="mt-2 rounded-lg border border-slate-200 bg-black overflow-hidden">
                        {streamLoading ? (
                          <div className="flex items-center justify-center py-16">
                            <div className="text-center text-white">
                              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-white" />
                              <p className="mt-3 text-sm text-slate-400">Loading preview...</p>
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
                          <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                              <p className="text-sm text-red-400">{streamError || 'Unable to load video'}</p>
                              <a href="/login" className="mt-2 inline-block text-sm text-violet-400 hover:text-violet-300">
                                Login to preview →
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Resources — visible to everyone */}
                    {(lecture.resources ?? []).length > 0 && (
                      <div className="mt-1 ml-11 flex flex-wrap gap-2">
                        {(lecture.resources ?? []).map((res) => (
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
                );
              })}
            </ul>
          </li>
        ))}
        {sections.length === 0 && (
          <li className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
            No sections yet.
          </li>
        )}
      </ul>
    </article>
  );
}

/* ─── Helpers ─── */

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
