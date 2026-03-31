'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  addSection,
  deleteResource,
  deleteSection,
  getInstructorCourse,
  getVideoStreamUrl,
  InstructorCourse,
  Resource,
  updateCourse,
  updateLecture,
  updateSection,
  uploadLectureVideo,
  uploadResource,
} from '@/lib/client-api';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function InstructorCourseEditPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId ?? '';

  const [course, setCourse] = useState<InstructorCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    level: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    price: 1,
  });

  const [sectionForms, setSectionForms] = useState<
    Record<string, { title: string; position: number; isPublished: boolean }>
  >({});

  const [lectureForms, setLectureForms] = useState<
    Record<
      string,
      {
        title: string;
        position: number;
        durationSec: number;
        content: string;
        isPublished: boolean;
        isFreePreview: boolean;
        video: File | null;
      }
    >
  >({});

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [addingSectionLoading, setAddingSectionLoading] = useState(false);

  const [newLectureForms, setNewLectureForms] = useState<
    Record<string, { title: string; video: File | null; durationSec: number }>
  >({});
  const [addingLectureLoading, setAddingLectureLoading] = useState<string | null>(null);

  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);

  const [resourceFile, setResourceFile] = useState<Record<string, File | null>>({});
  const [resourceTitle, setResourceTitle] = useState<Record<string, string>>({});
  const [uploadingResource, setUploadingResource] = useState<string | null>(null);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);

  const [previewLectureId, setPreviewLectureId] = useState<string | null>(null);
  const [previewStreamUrl, setPreviewStreamUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  async function handlePreviewVideo(lectureId: string) {
    if (previewLectureId === lectureId) {
      setPreviewLectureId(null);
      setPreviewStreamUrl(null);
      return;
    }
    setPreviewLectureId(lectureId);
    setPreviewStreamUrl(null);
    setPreviewLoading(true);
    try {
      const data = await getVideoStreamUrl(String(lectureId));
      setPreviewStreamUrl(data.streamUrl);
    } catch {
      setPreviewStreamUrl(null);
    } finally {
      setPreviewLoading(false);
    }
  }

  async function loadCourse() {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getInstructorCourse(courseId);
      setCourse(data);
      setCourseForm({
        title: data.title,
        description: data.description,
        level: data.level,
        price: Number(data.price),
      });

      const nextSections: Record<string, { title: string; position: number; isPublished: boolean }> = {};
      const nextLectures: Record<string, { title: string; position: number; durationSec: number; content: string; isPublished: boolean; video: File | null }> = {};

      for (const section of data.sections ?? []) {
        nextSections[section.id] = {
          title: section.title,
          position: section.position,
          isPublished: section.isPublished,
        };

        for (const lecture of section.lectures ?? []) {
          nextLectures[lecture.id] = {
            title: lecture.title,
            position: lecture.position,
            durationSec: Number(lecture.durationSec ?? 0),
            content: lecture.content ?? '',
            isPublished: lecture.isPublished,
            isFreePreview: !!lecture.isFreePreview,
            video: null,
          };
        }
      }

      setSectionForms(nextSections);
      setLectureForms(nextLectures);
    } catch {
      setError('Unable to load course. Please login as instructor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCourse();
  }, [courseId]);

  const sectionCount = useMemo(() => (course?.sections ?? []).length, [course?.sections]);

  async function onSaveCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!course) return;

    setSaving(true);
    setError(null);
    try {
      await updateCourse(course.id, {
        title: courseForm.title,
        slug: slugify(courseForm.title),
        description: courseForm.description,
        level: courseForm.level,
        price: courseForm.price,
      });
      await loadCourse();
    } catch {
      setError('Could not update course.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="mx-auto max-w-6xl px-6 py-12">Loading course editor...</main>;
  }

  if (!course) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-slate-700">Course not found or unauthorized.</p>
        <Link href="/instructor/courses" className="mt-3 inline-block text-violet-700">
          Back to instructor dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit course</h1>
          <p className="mt-1 text-slate-600">Update course, topics, and lecture content.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/instructor/courses/${courseId}/preview`}
            className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview Course
          </Link>
          <Link href="/instructor/courses" className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold">
            Back
          </Link>
        </div>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={onSaveCourse} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Course details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              value={courseForm.title}
              onChange={(e) => setCourseForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Level</label>
            <select
              value={courseForm.level}
              onChange={(e) =>
                setCourseForm((p) => ({
                  ...p,
                  level: e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
                }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_220px]">
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              value={courseForm.description}
              onChange={(e) => setCourseForm((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Price (USD)</label>
            <input
              type="number"
              min={1}
              step="0.01"
              value={courseForm.price}
              onChange={(e) => setCourseForm((p) => ({ ...p, price: Number(e.target.value) }))}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
        </div>

        <button
          disabled={saving}
          className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save course'}
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">Topics & content ({sectionCount})</h2>

        {/* ── Add new topic (section) ── */}
        <div className="mt-4 flex items-end gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">New topic title</label>
            <input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="e.g. Getting Started"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          <button
            type="button"
            disabled={addingSectionLoading || newSectionTitle.trim().length < 3}
            onClick={async () => {
              setAddingSectionLoading(true);
              setError(null);
              try {
                await addSection(course.id, { title: newSectionTitle.trim() });
                setNewSectionTitle('');
                await loadCourse();
              } catch {
                setError('Could not create topic.');
              } finally {
                setAddingSectionLoading(false);
              }
            }}
            className="rounded-md bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {addingSectionLoading ? 'Adding…' : '+ Add topic'}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {(course.sections ?? []).map((section) => {
            const sectionForm = sectionForms[section.id] ?? {
              title: section.title,
              position: section.position,
              isPublished: section.isPublished,
            };

            return (
              <article key={section.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-3 md:grid-cols-[1fr_120px_auto_auto_auto]">
                  <input
                    value={sectionForm.title}
                    onChange={(e) =>
                      setSectionForms((prev) => ({
                        ...prev,
                        [section.id]: {
                          ...sectionForm,
                          title: e.target.value,
                        },
                      }))
                    }
                    className="rounded-md border border-slate-300 px-3 py-2"
                  />
                  <input
                    type="number"
                    min={1}
                    value={sectionForm.position}
                    onChange={(e) =>
                      setSectionForms((prev) => ({
                        ...prev,
                        [section.id]: {
                          ...sectionForm,
                          position: Number(e.target.value),
                        },
                      }))
                    }
                    className="rounded-md border border-slate-300 px-3 py-2"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={sectionForm.isPublished}
                      onChange={(e) =>
                        setSectionForms((prev) => ({
                          ...prev,
                          [section.id]: {
                            ...sectionForm,
                            isPublished: e.target.checked,
                          },
                        }))
                      }
                    />
                    Published
                  </label>
                  <button
                    type="button"
                    onClick={async () => {
                      await updateSection(course.id, section.id, sectionForms[section.id] ?? sectionForm);
                      await loadCourse();
                    }}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold"
                  >
                    Save topic
                  </button>
                  <button
                    type="button"
                    disabled={deletingSectionId === section.id}
                    onClick={async () => {
                      if (!confirm('Delete this topic and all its lectures? This cannot be undone.')) return;
                      setDeletingSectionId(section.id);
                      setError(null);
                      try {
                        await deleteSection(course.id, section.id);
                        await loadCourse();
                      } catch {
                        setError('Could not delete topic.');
                      } finally {
                        setDeletingSectionId(null);
                      }
                    }}
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    {deletingSectionId === section.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {(section.lectures ?? []).map((lecture) => {
                    const lectureForm = lectureForms[lecture.id] ?? {
                      title: lecture.title,
                      position: lecture.position,
                      durationSec: Number(lecture.durationSec ?? 0),
                      content: lecture.content ?? '',
                      isPublished: lecture.isPublished,
                      isFreePreview: !!lecture.isFreePreview,
                      video: null,
                    };

                    return (
                      <div key={lecture.id} className="rounded-lg border border-slate-200 p-4">
                        <div className="grid gap-2 md:grid-cols-2">
                          <input
                            value={lectureForm.title}
                            onChange={(e) =>
                              setLectureForms((prev) => ({
                                ...prev,
                                [lecture.id]: {
                                  ...lectureForm,
                                  title: e.target.value,
                                },
                              }))
                            }
                            placeholder="Lecture title"
                            className="rounded-md border border-slate-300 px-3 py-2"
                          />
                          <input
                            type="number"
                            min={1}
                            value={lectureForm.position}
                            onChange={(e) =>
                              setLectureForms((prev) => ({
                                ...prev,
                                [lecture.id]: {
                                  ...lectureForm,
                                  position: Number(e.target.value),
                                },
                              }))
                            }
                            placeholder="Position"
                            className="rounded-md border border-slate-300 px-3 py-2"
                          />
                        </div>

                        <div className="mt-2 grid gap-2 md:grid-cols-2">
                          <input
                            type="number"
                            min={1}
                            value={lectureForm.durationSec}
                            onChange={(e) =>
                              setLectureForms((prev) => ({
                                ...prev,
                                [lecture.id]: {
                                  ...lectureForm,
                                  durationSec: Number(e.target.value),
                                },
                              }))
                            }
                            placeholder="Duration (sec)"
                            className="rounded-md border border-slate-300 px-3 py-2"
                          />
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                              setLectureForms((prev) => ({
                                ...prev,
                                [lecture.id]: {
                                  ...lectureForm,
                                  video: e.target.files?.[0] ?? null,
                                },
                              }))
                            }
                            className="rounded-md border border-slate-300 px-3 py-2"
                          />
                        </div>

                        <textarea
                          value={lectureForm.content}
                          onChange={(e) =>
                            setLectureForms((prev) => ({
                              ...prev,
                              [lecture.id]: {
                                ...lectureForm,
                                content: e.target.value,
                              },
                            }))
                          }
                          rows={3}
                          placeholder="Lecture notes/content"
                          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
                        />

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={lectureForm.isPublished}
                                onChange={(e) =>
                                  setLectureForms((prev) => ({
                                    ...prev,
                                    [lecture.id]: {
                                      ...lectureForm,
                                      isPublished: e.target.checked,
                                    },
                                  }))
                                }
                              />
                              Published
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={lectureForm.isFreePreview}
                                onChange={(e) =>
                                  setLectureForms((prev) => ({
                                    ...prev,
                                    [lecture.id]: {
                                      ...lectureForm,
                                      isFreePreview: e.target.checked,
                                    },
                                  }))
                                }
                              />
                              <span className="text-green-700">Free Preview</span>
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            {lecture.videoUrl && (
                              <button
                                type="button"
                                onClick={() => handlePreviewVideo(String(lecture.id))}
                                className="text-sm font-semibold text-violet-700 hover:text-violet-900"
                              >
                                {previewLectureId === String(lecture.id) ? '✕ Close preview' : '▶ Preview video'}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={async () => {
                                const form = lectureForms[lecture.id] ?? lectureForm;
                                await updateLecture({
                                  courseId: course.id,
                                  sectionId: section.id,
                                  lectureId: lecture.id,
                                  title: form.title,
                                  position: form.position,
                                  durationSec: form.durationSec > 0 ? form.durationSec : undefined,
                                  content: form.content,
                                  isPublished: form.isPublished,
                                  isFreePreview: form.isFreePreview,
                                  video: form.video ?? undefined,
                                });
                                await loadCourse();
                              }}
                              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                            >
                              Save lecture
                            </button>
                          </div>
                        </div>
                        {previewLectureId === String(lecture.id) && (
                          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                            {previewLoading ? (
                              <p className="py-4 text-center text-sm text-slate-500">Loading video…</p>
                            ) : previewStreamUrl ? (
                              <video
                                key={previewStreamUrl}
                                src={previewStreamUrl}
                                controls
                                controlsList="nodownload noplaybackrate"
                                disablePictureInPicture
                                onContextMenu={(e) => e.preventDefault()}
                                className="w-full max-h-[400px] rounded-md bg-black"
                              />
                            ) : (
                              <p className="py-4 text-center text-sm text-red-500">Unable to load video preview</p>
                            )}
                          </div>
                        )}

                        {/* ── Resources ── */}
                        <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Resources</p>

                          {(lecture.resources ?? []).length > 0 && (
                            <ul className="mb-2 space-y-1">
                              {(lecture.resources ?? []).map((res: Resource) => (
                                <li key={res.id} className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm border border-slate-200">
                                  <a
                                    href={res.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate text-violet-700 hover:underline"
                                  >
                                    📎 {res.title}
                                  </a>
                                  <span className="ml-2 flex items-center gap-2 text-xs text-slate-500 shrink-0">
                                    <span>{(res.fileSize / 1024).toFixed(0)} KB</span>
                                    <button
                                      type="button"
                                      disabled={deletingResourceId === res.id}
                                      onClick={async () => {
                                        if (!confirm('Delete this resource?')) return;
                                        setDeletingResourceId(res.id);
                                        try {
                                          await deleteResource({
                                            courseId: course.id,
                                            sectionId: section.id,
                                            lectureId: lecture.id,
                                            resourceId: res.id,
                                          });
                                          await loadCourse();
                                        } catch {
                                          setError('Could not delete resource.');
                                        } finally {
                                          setDeletingResourceId(null);
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                    >
                                      ✕
                                    </button>
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="flex items-center gap-2">
                            <input
                              value={resourceTitle[lecture.id] ?? ''}
                              onChange={(e) => setResourceTitle((p) => ({ ...p, [lecture.id]: e.target.value }))}
                              placeholder="Resource title"
                              className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                            />
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.webp"
                              onChange={(e) => setResourceFile((p) => ({ ...p, [lecture.id]: e.target.files?.[0] ?? null }))}
                              className="text-sm"
                            />
                            <button
                              type="button"
                              disabled={
                                uploadingResource === lecture.id ||
                                !resourceFile[lecture.id]
                              }
                              onClick={async () => {
                                const file = resourceFile[lecture.id];
                                if (!file) return;
                                setUploadingResource(lecture.id);
                                setError(null);
                                try {
                                  await uploadResource({
                                    courseId: course.id,
                                    sectionId: section.id,
                                    lectureId: lecture.id,
                                    title: resourceTitle[lecture.id]?.trim() || file.name,
                                    file,
                                  });
                                  setResourceFile((p) => ({ ...p, [lecture.id]: null }));
                                  setResourceTitle((p) => ({ ...p, [lecture.id]: '' }));
                                  await loadCourse();
                                } catch {
                                  setError('Could not upload resource.');
                                } finally {
                                  setUploadingResource(null);
                                }
                              }}
                              className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                            >
                              {uploadingResource === lecture.id ? 'Uploading…' : '+ Add'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Add new lecture ── */}
                <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-sm font-medium text-slate-700">Add new lecture</p>
                  <div className="grid gap-2 md:grid-cols-[1fr_180px_auto]">
                    <input
                      value={newLectureForms[section.id]?.title ?? ''}
                      onChange={(e) =>
                        setNewLectureForms((prev) => ({
                          ...prev,
                          [section.id]: {
                            ...prev[section.id],
                            title: e.target.value,
                            video: prev[section.id]?.video ?? null,
                            durationSec: prev[section.id]?.durationSec ?? 0,
                          },
                        }))
                      }
                      placeholder="Lecture title"
                      className="rounded-md border border-slate-300 px-3 py-2"
                    />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        setNewLectureForms((prev) => ({
                          ...prev,
                          [section.id]: {
                            ...prev[section.id],
                            title: prev[section.id]?.title ?? '',
                            durationSec: prev[section.id]?.durationSec ?? 0,
                            video: e.target.files?.[0] ?? null,
                          },
                        }))
                      }
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      disabled={
                        addingLectureLoading === section.id ||
                        (newLectureForms[section.id]?.title ?? '').trim().length < 3 ||
                        !newLectureForms[section.id]?.video
                      }
                      onClick={async () => {
                        const form = newLectureForms[section.id];
                        if (!form?.video || form.title.trim().length < 3) return;
                        setAddingLectureLoading(section.id);
                        setError(null);
                        try {
                          await uploadLectureVideo({
                            courseId: course.id,
                            sectionId: section.id,
                            title: form.title.trim(),
                            durationSec: form.durationSec > 0 ? form.durationSec : undefined,
                            video: form.video,
                          });
                          setNewLectureForms((prev) => {
                            const next = { ...prev };
                            delete next[section.id];
                            return next;
                          });
                          await loadCourse();
                        } catch {
                          setError('Could not upload lecture.');
                        } finally {
                          setAddingLectureLoading(null);
                        }
                      }}
                      className="rounded-md bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {addingLectureLoading === section.id ? 'Uploading…' : '+ Upload'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
