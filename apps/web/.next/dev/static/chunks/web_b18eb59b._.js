(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InstructorCoursePreviewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/src/lib/client-api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function InstructorCoursePreviewPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const courseId = params?.courseId ?? '';
    const [course, setCourse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // video player state
    const [playingLectureId, setPlayingLectureId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [streamUrl, setStreamUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [streamLoading, setStreamLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InstructorCoursePreviewPage.useEffect": ()=>{
            loadCourse();
        }
    }["InstructorCoursePreviewPage.useEffect"], [
        courseId
    ]);
    async function loadCourse() {
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInstructorCourse"])(courseId);
            setCourse(data);
        } catch  {
        // ignore
        } finally{
            setLoading(false);
        }
    }
    async function playLecture(lectureId) {
        if (playingLectureId === lectureId) {
            setPlayingLectureId(null);
            setStreamUrl(null);
            return;
        }
        setPlayingLectureId(lectureId);
        setStreamUrl(null);
        setStreamLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoStreamUrl"])(lectureId);
            setStreamUrl(data.streamUrl);
        } catch  {
            setStreamUrl(null);
        } finally{
            setStreamLoading(false);
        }
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "flex min-h-screen items-center justify-center bg-slate-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"
                    }, void 0, false, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm text-slate-500",
                        children: "Loading preview..."
                    }, void 0, false, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this);
    }
    if (!course) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "mx-auto max-w-5xl px-6 py-16",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold text-slate-900",
                    children: "Course not found"
                }, void 0, false, {
                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/instructor/courses",
                    className: "mt-4 inline-block text-violet-700",
                    children: "Back to dashboard"
                }, void 0, false, {
                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, this);
    }
    const requirements = course.requirements ? (()=>{
        try {
            return JSON.parse(course.requirements);
        } catch  {
            return [];
        }
    })() : [];
    const targetAudience = course.targetAudience ? (()=>{
        try {
            return JSON.parse(course.targetAudience);
        } catch  {
            return [];
        }
    })() : [];
    const totalLectures = (course.sections ?? []).reduce((acc, s)=>acc + (s.lectures?.length ?? 0), 0);
    const totalDuration = (course.sections ?? []).reduce((acc, s)=>acc + (s.lectures?.reduce((a, l)=>a + (l.durationSec ?? 0), 0) ?? 0), 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-amber-200 bg-amber-50 px-4 py-2 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-6xl flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-semibold text-amber-700",
                            children: "👁 INSTRUCTOR PREVIEW — This is how students will see your course"
                        }, void 0, false, {
                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/instructor/courses/${courseId}/edit`,
                                className: "rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition",
                                children: "← Back to Editor"
                            }, void 0, false, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                lineNumber: 108,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "border-b border-slate-200 bg-slate-900 text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-6xl px-6 py-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "max-w-3xl text-4xl font-bold",
                            children: course.title
                        }, void 0, false, {
                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 max-w-3xl text-slate-300",
                            children: course.description
                        }, void 0, false, {
                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-violet-300",
                                    children: course.level
                                }, void 0, false, {
                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this),
                                course.language && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "Language: ",
                                        course.language
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                    lineNumber: 125,
                                    columnNumber: 33
                                }, this),
                                !course.isPublished && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300",
                                    children: "DRAFT"
                                }, void 0, false, {
                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                    lineNumber: 127,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_340px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-8",
                        children: [
                            targetAudience.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "rounded-xl border border-slate-200 bg-white p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-semibold",
                                        children: "Who this course is for"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "mt-4 space-y-2",
                                        children: targetAudience.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start gap-2 text-sm text-slate-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-green-500 mt-0.5",
                                                        children: "✓"
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                        lineNumber: 145,
                                                        columnNumber: 21
                                                    }, this),
                                                    item
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 144,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this),
                            requirements.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "rounded-xl border border-slate-200 bg-white p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-semibold",
                                        children: "Requirements"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "mt-4 space-y-2",
                                        children: requirements.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start gap-2 text-sm text-slate-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-slate-400 mt-0.5",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 21
                                                    }, this),
                                                    item
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 159,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                lineNumber: 155,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "rounded-xl border border-slate-200 bg-white p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-semibold",
                                                children: "Course curriculum"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 171,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-slate-500",
                                                children: [
                                                    (course.sections ?? []).length,
                                                    " sections · ",
                                                    totalLectures,
                                                    " lectures",
                                                    totalDuration > 0 && ` · ${Math.round(totalDuration / 60)}m`
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 172,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 170,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "mt-5 space-y-3",
                                        children: [
                                            (course.sections ?? []).map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "rounded-lg border border-slate-200 p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                            children: [
                                                                                "Section ",
                                                                                section.position
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                            lineNumber: 182,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-1 font-medium text-slate-900",
                                                                            children: section.title
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                            lineNumber: 185,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                    lineNumber: 181,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: !section.isPublished && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700",
                                                                        children: "Draft"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                        lineNumber: 189,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                    lineNumber: 187,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                            lineNumber: 180,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "mt-3 space-y-2",
                                                            children: (section.lectures ?? []).map((lecture)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `flex items-center justify-between rounded-md px-3 py-2 text-sm ${playingLectureId === String(lecture.id) ? 'bg-violet-50 border border-violet-200' : 'bg-slate-50 text-slate-700'}`,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-3 flex-1 min-w-0",
                                                                                    children: [
                                                                                        lecture.videoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>playLecture(String(lecture.id)),
                                                                                            className: "flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-500 transition",
                                                                                            title: "Play video",
                                                                                            children: playingLectureId === String(lecture.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                                                className: "h-3.5 w-3.5",
                                                                                                fill: "currentColor",
                                                                                                viewBox: "0 0 20 20",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                    fillRule: "evenodd",
                                                                                                    d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                                                                                                    clipRule: "evenodd"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                                    lineNumber: 215,
                                                                                                    columnNumber: 37
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                                lineNumber: 214,
                                                                                                columnNumber: 35
                                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                                                className: "h-3.5 w-3.5 ml-0.5",
                                                                                                fill: "currentColor",
                                                                                                viewBox: "0 0 20 20",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                    d: "M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                                    lineNumber: 219,
                                                                                                    columnNumber: 37
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                                lineNumber: 218,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                            lineNumber: 207,
                                                                                            columnNumber: 31
                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-400",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                                                className: "h-4 w-4",
                                                                                                fill: "none",
                                                                                                viewBox: "0 0 24 24",
                                                                                                stroke: "currentColor",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                    strokeLinecap: "round",
                                                                                                    strokeLinejoin: "round",
                                                                                                    strokeWidth: 2,
                                                                                                    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                                    lineNumber: 226,
                                                                                                    columnNumber: 35
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                                lineNumber: 225,
                                                                                                columnNumber: 33
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                            lineNumber: 224,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "min-w-0",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                    className: "font-medium text-slate-900",
                                                                                                    children: [
                                                                                                        "#",
                                                                                                        lecture.position,
                                                                                                        " ",
                                                                                                        lecture.title
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                                    lineNumber: 231,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                lecture.durationSec ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                    className: "text-xs text-slate-500",
                                                                                                    children: [
                                                                                                        Math.floor(lecture.durationSec / 60),
                                                                                                        ":",
                                                                                                        String(lecture.durationSec % 60).padStart(2, '0')
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                                    lineNumber: 235,
                                                                                                    columnNumber: 33
                                                                                                }, this) : null
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                            lineNumber: 230,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                    lineNumber: 205,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-2 flex-shrink-0 ml-2",
                                                                                    children: [
                                                                                        (lecture.resources ?? []).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600",
                                                                                            children: [
                                                                                                "📎 ",
                                                                                                (lecture.resources ?? []).length
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                            lineNumber: 243,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        lecture.isFreePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700",
                                                                                            children: "Preview"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                            lineNumber: 248,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        !lecture.isPublished && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700",
                                                                                            children: "Draft"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                            lineNumber: 253,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                    lineNumber: 241,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                            lineNumber: 198,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        playingLectureId === String(lecture.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-2 rounded-lg border border-slate-200 bg-black overflow-hidden",
                                                                            children: streamLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center justify-center py-16",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-center text-white",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-white"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                            lineNumber: 266,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "mt-3 text-sm text-slate-400",
                                                                                            children: "Loading video..."
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                            lineNumber: 267,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                    lineNumber: 265,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                lineNumber: 264,
                                                                                columnNumber: 31
                                                                            }, this) : streamUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                                                src: streamUrl,
                                                                                controls: true,
                                                                                autoPlay: true,
                                                                                controlsList: "nodownload noplaybackrate",
                                                                                disablePictureInPicture: true,
                                                                                onContextMenu: (e)=>e.preventDefault(),
                                                                                className: "w-full max-h-[480px] object-contain"
                                                                            }, streamUrl, false, {
                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                lineNumber: 271,
                                                                                columnNumber: 31
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center justify-center py-16",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-red-400",
                                                                                    children: "Unable to load video"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                    lineNumber: 283,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                lineNumber: 282,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                            lineNumber: 262,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        (lecture.resources ?? []).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-1 ml-11 flex flex-wrap gap-2",
                                                                            children: (lecture.resources ?? []).map((res)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                    href: res.fileUrl,
                                                                                    target: "_blank",
                                                                                    rel: "noopener noreferrer",
                                                                                    className: "inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 transition",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResourceIcon, {
                                                                                            fileType: res.fileType
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                            lineNumber: 300,
                                                                                            columnNumber: 33
                                                                                        }, this),
                                                                                        res.title,
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-slate-400",
                                                                                            children: [
                                                                                                "(",
                                                                                                formatFileSize(res.fileSize),
                                                                                                ")"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                            lineNumber: 302,
                                                                                            columnNumber: 33
                                                                                        }, this)
                                                                                    ]
                                                                                }, res.id, true, {
                                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                                    lineNumber: 293,
                                                                                    columnNumber: 31
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                            lineNumber: 291,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, lecture.id, true, {
                                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                                    lineNumber: 197,
                                                                    columnNumber: 23
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                            lineNumber: 195,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, section.id, true, {
                                                    fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 17
                                                }, this)),
                                            (course.sections ?? []).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "rounded-lg border border-dashed border-slate-300 p-4 text-slate-500",
                                                children: "No sections yet."
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 315,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 177,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "space-y-4 lg:sticky lg:top-6 lg:self-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-slate-200 bg-white p-6",
                                children: [
                                    course.previewVideoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 aspect-video overflow-hidden rounded-lg bg-slate-900",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                            src: course.previewVideoUrl,
                                            controls: true,
                                            controlsList: "nodownload",
                                            disablePictureInPicture: true,
                                            onContextMenu: (e)=>e.preventDefault(),
                                            className: "h-full w-full object-cover",
                                            poster: course.thumbnailUrl ?? undefined
                                        }, void 0, false, {
                                            fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                            lineNumber: 328,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 327,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-3xl font-bold text-slate-900",
                                        children: Number(course.price) === 0 ? 'Free' : `$${Number(course.price).toFixed(2)}`
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 339,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-sm text-slate-500",
                                        children: "One-time purchase · lifetime access"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-5 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full rounded-lg bg-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white opacity-60 cursor-not-allowed",
                                                children: "Add to Cart (Preview)"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 346,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full rounded-lg border border-violet-200 bg-violet-50 px-4 py-2.5 text-center text-sm font-semibold text-violet-700 opacity-60 cursor-not-allowed",
                                                children: "Enroll Now (Preview)"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 349,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 345,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-slate-200 bg-white p-6 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-slate-900",
                                        children: "This course includes:"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "mt-3 space-y-2 text-slate-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    "📹 ",
                                                    totalLectures,
                                                    " lectures"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 357,
                                                columnNumber: 15
                                            }, this),
                                            totalDuration > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    "⏱ ",
                                                    Math.round(totalDuration / 60),
                                                    " minutes of content"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 358,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    "📂 ",
                                                    (course.sections ?? []).length,
                                                    " sections"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 359,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "🏆 Full lifetime access"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 360,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "📜 Certificate of completion"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                                lineNumber: 361,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                        lineNumber: 356,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/instructor/courses/${courseId}/edit`,
                                className: "inline-block text-sm font-semibold text-violet-700 hover:underline",
                                children: "← Back to Editor"
                            }, void 0, false, {
                                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                        lineNumber: 324,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(InstructorCoursePreviewPage, "gebPTRaL13nDxuui/AVemNQOSF8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = InstructorCoursePreviewPage;
/* ─── Helper components ─── */ function ResourceIcon({ fileType }) {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-red-500",
        children: "📄"
    }, void 0, false, {
        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
        lineNumber: 380,
        columnNumber: 36
    }, this);
    if (type.includes('doc') || type.includes('word')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-blue-500",
        children: "📝"
    }, void 0, false, {
        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
        lineNumber: 381,
        columnNumber: 61
    }, this);
    if (type.includes('ppt') || type.includes('presentation')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-orange-500",
        children: "📊"
    }, void 0, false, {
        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
        lineNumber: 382,
        columnNumber: 69
    }, this);
    if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('gif')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        children: "🖼️"
    }, void 0, false, {
        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
        lineNumber: 383,
        columnNumber: 110
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        children: "📁"
    }, void 0, false, {
        fileName: "[project]/web/src/app/instructor/courses/[courseId]/preview/page.tsx",
        lineNumber: 384,
        columnNumber: 10
    }, this);
}
_c1 = ResourceIcon;
function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
var _c, _c1;
__turbopack_context__.k.register(_c, "InstructorCoursePreviewPage");
__turbopack_context__.k.register(_c1, "ResourceIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/web/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=web_b18eb59b._.js.map