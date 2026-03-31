(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InstructorCourseEditPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/src/lib/client-api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function slugify(value) {
    return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}
function InstructorCourseEditPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const courseId = params?.courseId ?? '';
    const [course, setCourse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [courseForm, setCourseForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        description: '',
        level: 'BEGINNER',
        price: 1
    });
    const [sectionForms, setSectionForms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [lectureForms, setLectureForms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [newSectionTitle, setNewSectionTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [addingSectionLoading, setAddingSectionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newLectureForms, setNewLectureForms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [addingLectureLoading, setAddingLectureLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [deletingSectionId, setDeletingSectionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resourceFile, setResourceFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [resourceTitle, setResourceTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [uploadingResource, setUploadingResource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [deletingResourceId, setDeletingResourceId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewLectureId, setPreviewLectureId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewStreamUrl, setPreviewStreamUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewLoading, setPreviewLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handlePreviewVideo(lectureId) {
        if (previewLectureId === lectureId) {
            setPreviewLectureId(null);
            setPreviewStreamUrl(null);
            return;
        }
        setPreviewLectureId(lectureId);
        setPreviewStreamUrl(null);
        setPreviewLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoStreamUrl"])(String(lectureId));
            setPreviewStreamUrl(data.streamUrl);
        } catch  {
            setPreviewStreamUrl(null);
        } finally{
            setPreviewLoading(false);
        }
    }
    async function loadCourse() {
        if (!courseId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInstructorCourse"])(courseId);
            setCourse(data);
            setCourseForm({
                title: data.title,
                description: data.description,
                level: data.level,
                price: Number(data.price)
            });
            const nextSections = {};
            const nextLectures = {};
            for (const section of data.sections ?? []){
                nextSections[section.id] = {
                    title: section.title,
                    position: section.position,
                    isPublished: section.isPublished
                };
                for (const lecture of section.lectures ?? []){
                    nextLectures[lecture.id] = {
                        title: lecture.title,
                        position: lecture.position,
                        durationSec: Number(lecture.durationSec ?? 0),
                        content: lecture.content ?? '',
                        isPublished: lecture.isPublished,
                        isFreePreview: !!lecture.isFreePreview,
                        video: null
                    };
                }
            }
            setSectionForms(nextSections);
            setLectureForms(nextLectures);
        } catch  {
            setError('Unable to load course. Please login as instructor.');
        } finally{
            setLoading(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InstructorCourseEditPage.useEffect": ()=>{
            void loadCourse();
        }
    }["InstructorCourseEditPage.useEffect"], [
        courseId
    ]);
    const sectionCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InstructorCourseEditPage.useMemo[sectionCount]": ()=>(course?.sections ?? []).length
    }["InstructorCourseEditPage.useMemo[sectionCount]"], [
        course?.sections
    ]);
    async function onSaveCourse(event) {
        event.preventDefault();
        if (!course) return;
        setSaving(true);
        setError(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCourse"])(course.id, {
                title: courseForm.title,
                slug: slugify(courseForm.title),
                description: courseForm.description,
                level: courseForm.level,
                price: courseForm.price
            });
            await loadCourse();
        } catch  {
            setError('Could not update course.');
        } finally{
            setSaving(false);
        }
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "mx-auto max-w-6xl px-6 py-12",
            children: "Loading course editor..."
        }, void 0, false, {
            fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
            lineNumber: 178,
            columnNumber: 12
        }, this);
    }
    if (!course) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "mx-auto max-w-6xl px-6 py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-slate-700",
                    children: "Course not found or unauthorized."
                }, void 0, false, {
                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/instructor/courses",
                    className: "mt-3 inline-block text-violet-700",
                    children: "Back to instructor dashboard"
                }, void 0, false, {
                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                    lineNumber: 185,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
            lineNumber: 183,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "mx-auto max-w-6xl px-6 py-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-slate-900",
                                children: "Edit course"
                            }, void 0, false, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-slate-600",
                                children: "Update course, topics, and lecture content."
                            }, void 0, false, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/instructor/courses/${courseId}/preview`,
                                className: "inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-4 w-4",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 205,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 206,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    "Preview Course"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/instructor/courses",
                                className: "rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold",
                                children: "Back"
                            }, void 0, false, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 210,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700",
                children: error
            }, void 0, false, {
                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                lineNumber: 216,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: onSaveCourse,
                className: "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-slate-900",
                        children: "Course details"
                    }, void 0, false, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 grid gap-4 md:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-sm font-medium",
                                        children: "Title"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: courseForm.title,
                                        onChange: (e)=>setCourseForm((p)=>({
                                                    ...p,
                                                    title: e.target.value
                                                })),
                                        className: "w-full rounded-md border border-slate-300 px-3 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 223,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-sm font-medium",
                                        children: "Level"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: courseForm.level,
                                        onChange: (e)=>setCourseForm((p)=>({
                                                    ...p,
                                                    level: e.target.value
                                                })),
                                        className: "w-full rounded-md border border-slate-300 px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "BEGINNER",
                                                children: "Beginner"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 241,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "INTERMEDIATE",
                                                children: "Intermediate"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 242,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "ADVANCED",
                                                children: "Advanced"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 243,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 231,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 grid gap-4 md:grid-cols-[1fr_220px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-sm font-medium",
                                        children: "Description"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 249,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: courseForm.description,
                                        onChange: (e)=>setCourseForm((p)=>({
                                                    ...p,
                                                    description: e.target.value
                                                })),
                                        rows: 4,
                                        className: "w-full rounded-md border border-slate-300 px-3 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 250,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-sm font-medium",
                                        children: "Price (USD)"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 258,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 1,
                                        step: "0.01",
                                        value: courseForm.price,
                                        onChange: (e)=>setCourseForm((p)=>({
                                                    ...p,
                                                    price: Number(e.target.value)
                                                })),
                                        className: "w-full rounded-md border border-slate-300 px-3 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: saving,
                        className: "mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50",
                        children: saving ? 'Saving...' : 'Save course'
                    }, void 0, false, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-slate-900",
                        children: [
                            "Topics & content (",
                            sectionCount,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex items-end gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-sm font-medium text-slate-700",
                                        children: "New topic title"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 284,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: newSectionTitle,
                                        onChange: (e)=>setNewSectionTitle(e.target.value),
                                        placeholder: "e.g. Getting Started",
                                        className: "w-full rounded-md border border-slate-300 px-3 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 285,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 283,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                disabled: addingSectionLoading || newSectionTitle.trim().length < 3,
                                onClick: async ()=>{
                                    setAddingSectionLoading(true);
                                    setError(null);
                                    try {
                                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addSection"])(course.id, {
                                            title: newSectionTitle.trim()
                                        });
                                        setNewSectionTitle('');
                                        await loadCourse();
                                    } catch  {
                                        setError('Could not create topic.');
                                    } finally{
                                        setAddingSectionLoading(false);
                                    }
                                },
                                className: "rounded-md bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50",
                                children: addingSectionLoading ? 'Adding…' : '+ Add topic'
                            }, void 0, false, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 space-y-4",
                        children: (course.sections ?? []).map((section)=>{
                            const sectionForm = sectionForms[section.id] ?? {
                                title: section.title,
                                position: section.position,
                                isPublished: section.isPublished
                            };
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-3 md:grid-cols-[1fr_120px_auto_auto_auto]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: sectionForm.title,
                                                onChange: (e)=>setSectionForms((prev)=>({
                                                            ...prev,
                                                            [section.id]: {
                                                                ...sectionForm,
                                                                title: e.target.value
                                                            }
                                                        })),
                                                className: "rounded-md border border-slate-300 px-3 py-2"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 325,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: 1,
                                                value: sectionForm.position,
                                                onChange: (e)=>setSectionForms((prev)=>({
                                                            ...prev,
                                                            [section.id]: {
                                                                ...sectionForm,
                                                                position: Number(e.target.value)
                                                            }
                                                        })),
                                                className: "rounded-md border border-slate-300 px-3 py-2"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 338,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center gap-2 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: sectionForm.isPublished,
                                                        onChange: (e)=>setSectionForms((prev)=>({
                                                                    ...prev,
                                                                    [section.id]: {
                                                                        ...sectionForm,
                                                                        isPublished: e.target.checked
                                                                    }
                                                                }))
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                        lineNumber: 354,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Published"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 353,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: async ()=>{
                                                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateSection"])(course.id, section.id, sectionForms[section.id] ?? sectionForm);
                                                    await loadCourse();
                                                },
                                                className: "rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold",
                                                children: "Save topic"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 369,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: deletingSectionId === section.id,
                                                onClick: async ()=>{
                                                    if (!confirm('Delete this topic and all its lectures? This cannot be undone.')) return;
                                                    setDeletingSectionId(section.id);
                                                    setError(null);
                                                    try {
                                                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteSection"])(course.id, section.id);
                                                        await loadCourse();
                                                    } catch  {
                                                        setError('Could not delete topic.');
                                                    } finally{
                                                        setDeletingSectionId(null);
                                                    }
                                                },
                                                className: "rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50",
                                                children: deletingSectionId === section.id ? 'Deleting…' : 'Delete'
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 379,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 324,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 space-y-3",
                                        children: (section.lectures ?? []).map((lecture)=>{
                                            const lectureForm = lectureForms[lecture.id] ?? {
                                                title: lecture.title,
                                                position: lecture.position,
                                                durationSec: Number(lecture.durationSec ?? 0),
                                                content: lecture.content ?? '',
                                                isPublished: lecture.isPublished,
                                                isFreePreview: !!lecture.isFreePreview,
                                                video: null
                                            };
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border border-slate-200 p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid gap-2 md:grid-cols-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: lectureForm.title,
                                                                onChange: (e)=>setLectureForms((prev)=>({
                                                                            ...prev,
                                                                            [lecture.id]: {
                                                                                ...lectureForm,
                                                                                title: e.target.value
                                                                            }
                                                                        })),
                                                                placeholder: "Lecture title",
                                                                className: "rounded-md border border-slate-300 px-3 py-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                lineNumber: 416,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: 1,
                                                                value: lectureForm.position,
                                                                onChange: (e)=>setLectureForms((prev)=>({
                                                                            ...prev,
                                                                            [lecture.id]: {
                                                                                ...lectureForm,
                                                                                position: Number(e.target.value)
                                                                            }
                                                                        })),
                                                                placeholder: "Position",
                                                                className: "rounded-md border border-slate-300 px-3 py-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                lineNumber: 430,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                        lineNumber: 415,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 grid gap-2 md:grid-cols-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: 1,
                                                                value: lectureForm.durationSec,
                                                                onChange: (e)=>setLectureForms((prev)=>({
                                                                            ...prev,
                                                                            [lecture.id]: {
                                                                                ...lectureForm,
                                                                                durationSec: Number(e.target.value)
                                                                            }
                                                                        })),
                                                                placeholder: "Duration (sec)",
                                                                className: "rounded-md border border-slate-300 px-3 py-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                lineNumber: 449,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "file",
                                                                accept: "video/*",
                                                                onChange: (e)=>setLectureForms((prev)=>({
                                                                            ...prev,
                                                                            [lecture.id]: {
                                                                                ...lectureForm,
                                                                                video: e.target.files?.[0] ?? null
                                                                            }
                                                                        })),
                                                                className: "rounded-md border border-slate-300 px-3 py-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                lineNumber: 465,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                        lineNumber: 448,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        value: lectureForm.content,
                                                        onChange: (e)=>setLectureForms((prev)=>({
                                                                    ...prev,
                                                                    [lecture.id]: {
                                                                        ...lectureForm,
                                                                        content: e.target.value
                                                                    }
                                                                })),
                                                        rows: 3,
                                                        placeholder: "Lecture notes/content",
                                                        className: "mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                        lineNumber: 481,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 flex flex-wrap items-center justify-between gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "flex items-center gap-2 text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: lectureForm.isPublished,
                                                                                onChange: (e)=>setLectureForms((prev)=>({
                                                                                            ...prev,
                                                                                            [lecture.id]: {
                                                                                                ...lectureForm,
                                                                                                isPublished: e.target.checked
                                                                                            }
                                                                                        }))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                                lineNumber: 500,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            "Published"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                        lineNumber: 499,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "flex items-center gap-2 text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: lectureForm.isFreePreview,
                                                                                onChange: (e)=>setLectureForms((prev)=>({
                                                                                            ...prev,
                                                                                            [lecture.id]: {
                                                                                                ...lectureForm,
                                                                                                isFreePreview: e.target.checked
                                                                                            }
                                                                                        }))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                                lineNumber: 516,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-green-700",
                                                                                children: "Free Preview"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                                lineNumber: 529,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                        lineNumber: 515,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                lineNumber: 498,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    lecture.videoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handlePreviewVideo(String(lecture.id)),
                                                                        className: "text-sm font-semibold text-violet-700 hover:text-violet-900",
                                                                        children: previewLectureId === String(lecture.id) ? '✕ Close preview' : '▶ Preview video'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                        lineNumber: 535,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: async ()=>{
                                                                            const form = lectureForms[lecture.id] ?? lectureForm;
                                                                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateLecture"])({
                                                                                courseId: course.id,
                                                                                sectionId: section.id,
                                                                                lectureId: lecture.id,
                                                                                title: form.title,
                                                                                position: form.position,
                                                                                durationSec: form.durationSec > 0 ? form.durationSec : undefined,
                                                                                content: form.content,
                                                                                isPublished: form.isPublished,
                                                                                isFreePreview: form.isFreePreview,
                                                                                video: form.video ?? undefined
                                                                            });
                                                                            await loadCourse();
                                                                        },
                                                                        className: "rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white",
                                                                        children: "Save lecture"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                        lineNumber: 543,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                lineNumber: 533,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 25
                                                    }, this),
                                                    previewLectureId === String(lecture.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3",
                                                        children: previewLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "py-4 text-center text-sm text-slate-500",
                                                            children: "Loading video…"
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                            lineNumber: 570,
                                                            columnNumber: 31
                                                        }, this) : previewStreamUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                            src: previewStreamUrl,
                                                            controls: true,
                                                            controlsList: "nodownload noplaybackrate",
                                                            disablePictureInPicture: true,
                                                            onContextMenu: (e)=>e.preventDefault(),
                                                            className: "w-full max-h-[400px] rounded-md bg-black"
                                                        }, previewStreamUrl, false, {
                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                            lineNumber: 572,
                                                            columnNumber: 31
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "py-4 text-center text-sm text-red-500",
                                                            children: "Unable to load video preview"
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                            lineNumber: 582,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                        lineNumber: 568,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                children: "Resources"
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                lineNumber: 589,
                                                                columnNumber: 27
                                                            }, this),
                                                            (lecture.resources ?? []).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: "mb-2 space-y-1",
                                                                children: (lecture.resources ?? []).map((res)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        className: "flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm border border-slate-200",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                href: res.fileUrl,
                                                                                target: "_blank",
                                                                                rel: "noopener noreferrer",
                                                                                className: "truncate text-violet-700 hover:underline",
                                                                                children: [
                                                                                    "📎 ",
                                                                                    res.title
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                                lineNumber: 595,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "ml-2 flex items-center gap-2 text-xs text-slate-500 shrink-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: [
                                                                                            (res.fileSize / 1024).toFixed(0),
                                                                                            " KB"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                                        lineNumber: 604,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        disabled: deletingResourceId === res.id,
                                                                                        onClick: async ()=>{
                                                                                            if (!confirm('Delete this resource?')) return;
                                                                                            setDeletingResourceId(res.id);
                                                                                            try {
                                                                                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteResource"])({
                                                                                                    courseId: course.id,
                                                                                                    sectionId: section.id,
                                                                                                    lectureId: lecture.id,
                                                                                                    resourceId: res.id
                                                                                                });
                                                                                                await loadCourse();
                                                                                            } catch  {
                                                                                                setError('Could not delete resource.');
                                                                                            } finally{
                                                                                                setDeletingResourceId(null);
                                                                                            }
                                                                                        },
                                                                                        className: "text-red-500 hover:text-red-700 disabled:opacity-50",
                                                                                        children: "✕"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                                        lineNumber: 605,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                                lineNumber: 603,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, res.id, true, {
                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                        lineNumber: 594,
                                                                        columnNumber: 33
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                lineNumber: 592,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: resourceTitle[lecture.id] ?? '',
                                                                        onChange: (e)=>setResourceTitle((p)=>({
                                                                                    ...p,
                                                                                    [lecture.id]: e.target.value
                                                                                })),
                                                                        placeholder: "Resource title",
                                                                        className: "flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                        lineNumber: 636,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "file",
                                                                        accept: ".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.webp",
                                                                        onChange: (e)=>setResourceFile((p)=>({
                                                                                    ...p,
                                                                                    [lecture.id]: e.target.files?.[0] ?? null
                                                                                })),
                                                                        className: "text-sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                        lineNumber: 642,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        disabled: uploadingResource === lecture.id || !resourceFile[lecture.id],
                                                                        onClick: async ()=>{
                                                                            const file = resourceFile[lecture.id];
                                                                            if (!file) return;
                                                                            setUploadingResource(lecture.id);
                                                                            setError(null);
                                                                            try {
                                                                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadResource"])({
                                                                                    courseId: course.id,
                                                                                    sectionId: section.id,
                                                                                    lectureId: lecture.id,
                                                                                    title: resourceTitle[lecture.id]?.trim() || file.name,
                                                                                    file
                                                                                });
                                                                                setResourceFile((p)=>({
                                                                                        ...p,
                                                                                        [lecture.id]: null
                                                                                    }));
                                                                                setResourceTitle((p)=>({
                                                                                        ...p,
                                                                                        [lecture.id]: ''
                                                                                    }));
                                                                                await loadCourse();
                                                                            } catch  {
                                                                                setError('Could not upload resource.');
                                                                            } finally{
                                                                                setUploadingResource(null);
                                                                            }
                                                                        },
                                                                        className: "rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50",
                                                                        children: uploadingResource === lecture.id ? 'Uploading…' : '+ Add'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                        lineNumber: 648,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                                lineNumber: 635,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                        lineNumber: 588,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, lecture.id, true, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 414,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 401,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-2 text-sm font-medium text-slate-700",
                                                children: "Add new lecture"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 689,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid gap-2 md:grid-cols-[1fr_180px_auto]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: newLectureForms[section.id]?.title ?? '',
                                                        onChange: (e)=>setNewLectureForms((prev)=>({
                                                                    ...prev,
                                                                    [section.id]: {
                                                                        ...prev[section.id],
                                                                        title: e.target.value,
                                                                        video: prev[section.id]?.video ?? null,
                                                                        durationSec: prev[section.id]?.durationSec ?? 0
                                                                    }
                                                                })),
                                                        placeholder: "Lecture title",
                                                        className: "rounded-md border border-slate-300 px-3 py-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                        lineNumber: 691,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "file",
                                                        accept: "video/*",
                                                        onChange: (e)=>setNewLectureForms((prev)=>({
                                                                    ...prev,
                                                                    [section.id]: {
                                                                        ...prev[section.id],
                                                                        title: prev[section.id]?.title ?? '',
                                                                        durationSec: prev[section.id]?.durationSec ?? 0,
                                                                        video: e.target.files?.[0] ?? null
                                                                    }
                                                                })),
                                                        className: "rounded-md border border-slate-300 px-3 py-2 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                        lineNumber: 707,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        disabled: addingLectureLoading === section.id || (newLectureForms[section.id]?.title ?? '').trim().length < 3 || !newLectureForms[section.id]?.video,
                                                        onClick: async ()=>{
                                                            const form = newLectureForms[section.id];
                                                            if (!form?.video || form.title.trim().length < 3) return;
                                                            setAddingLectureLoading(section.id);
                                                            setError(null);
                                                            try {
                                                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadLectureVideo"])({
                                                                    courseId: course.id,
                                                                    sectionId: section.id,
                                                                    title: form.title.trim(),
                                                                    durationSec: form.durationSec > 0 ? form.durationSec : undefined,
                                                                    video: form.video
                                                                });
                                                                setNewLectureForms((prev)=>{
                                                                    const next = {
                                                                        ...prev
                                                                    };
                                                                    delete next[section.id];
                                                                    return next;
                                                                });
                                                                await loadCourse();
                                                            } catch  {
                                                                setError('Could not upload lecture.');
                                                            } finally{
                                                                setAddingLectureLoading(null);
                                                            }
                                                        },
                                                        className: "rounded-md bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50",
                                                        children: addingLectureLoading === section.id ? 'Uploading…' : '+ Upload'
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                        lineNumber: 723,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                                lineNumber: 690,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                        lineNumber: 688,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, section.id, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                                lineNumber: 323,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                        lineNumber: 314,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
                lineNumber: 278,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/src/app/instructor/courses/[courseId]/edit/page.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
_s(InstructorCourseEditPage, "8HjrBNaVqLBNldOb3Kj79n8oRjg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = InstructorCourseEditPage;
var _c;
__turbopack_context__.k.register(_c, "InstructorCourseEditPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/web/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=web_016b2cad._.js.map