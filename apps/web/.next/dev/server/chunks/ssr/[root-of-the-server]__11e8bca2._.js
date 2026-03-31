module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/web/src/lib/client-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* ──────────────────────── types ──────────────────────── */ __turbopack_context__.s([
    "addSection",
    ()=>addSection,
    "addToCart",
    ()=>addToCart,
    "approveCourse",
    ()=>approveCourse,
    "approveInstructor",
    ()=>approveInstructor,
    "banUser",
    ()=>banUser,
    "changePassword",
    ()=>changePassword,
    "checkout",
    ()=>checkout,
    "clearCart",
    ()=>clearCart,
    "clearSession",
    ()=>clearSession,
    "composeMessage",
    ()=>composeMessage,
    "createAssignment",
    ()=>createAssignment,
    "createCategory",
    ()=>createCategory,
    "createCoupon",
    ()=>createCoupon,
    "createCourse",
    ()=>createCourse,
    "createQuiz",
    ()=>createQuiz,
    "createReview",
    ()=>createReview,
    "createSupportTicket",
    ()=>createSupportTicket,
    "deleteCategory",
    ()=>deleteCategory,
    "deleteCoupon",
    ()=>deleteCoupon,
    "deleteResource",
    ()=>deleteResource,
    "deleteReview",
    ()=>deleteReview,
    "deleteSection",
    ()=>deleteSection,
    "enrollInCourse",
    ()=>enrollInCourse,
    "forgotPassword",
    ()=>forgotPassword,
    "generateCertificate",
    ()=>generateCertificate,
    "getAdminCoupons",
    ()=>getAdminCoupons,
    "getAdminCourseDetail",
    ()=>getAdminCourseDetail,
    "getAdminCourses",
    ()=>getAdminCourses,
    "getAdminDashboard",
    ()=>getAdminDashboard,
    "getAdminUsers",
    ()=>getAdminUsers,
    "getAssignmentSubmissions",
    ()=>getAssignmentSubmissions,
    "getCart",
    ()=>getCart,
    "getCategories",
    ()=>getCategories,
    "getCourseAssignments",
    ()=>getCourseAssignments,
    "getCourseProgress",
    ()=>getCourseProgress,
    "getCourseQuizzes",
    ()=>getCourseQuizzes,
    "getCourseReviews",
    ()=>getCourseReviews,
    "getFaqs",
    ()=>getFaqs,
    "getInbox",
    ()=>getInbox,
    "getInstructorAnalytics",
    ()=>getInstructorAnalytics,
    "getInstructorCourse",
    ()=>getInstructorCourse,
    "getInstructorRevenue",
    ()=>getInstructorRevenue,
    "getMe",
    ()=>getMe,
    "getMessage",
    ()=>getMessage,
    "getMyCertificates",
    ()=>getMyCertificates,
    "getMyTickets",
    ()=>getMyTickets,
    "getNotifications",
    ()=>getNotifications,
    "getOrder",
    ()=>getOrder,
    "getOrders",
    ()=>getOrders,
    "getPlatformAnalytics",
    ()=>getPlatformAnalytics,
    "getProfile",
    ()=>getProfile,
    "getQuiz",
    ()=>getQuiz,
    "getQuizAttempts",
    ()=>getQuizAttempts,
    "getSentMessages",
    ()=>getSentMessages,
    "getStoredUser",
    ()=>getStoredUser,
    "getStudentAnalytics",
    ()=>getStudentAnalytics,
    "getTicket",
    ()=>getTicket,
    "getToken",
    ()=>getToken,
    "getUnreadCount",
    ()=>getUnreadCount,
    "getUnreadMessageCount",
    ()=>getUnreadMessageCount,
    "getVideoStreamUrl",
    ()=>getVideoStreamUrl,
    "getWallet",
    ()=>getWallet,
    "gradeAssignment",
    ()=>gradeAssignment,
    "listMyInstructorCourses",
    ()=>listMyInstructorCourses,
    "listMyLearning",
    ()=>listMyLearning,
    "login",
    ()=>login,
    "markAllNotificationsRead",
    ()=>markAllNotificationsRead,
    "markMessageRead",
    ()=>markMessageRead,
    "markNotificationRead",
    ()=>markNotificationRead,
    "publishCourse",
    ()=>publishCourse,
    "register",
    ()=>register,
    "rejectCourse",
    ()=>rejectCourse,
    "removeFromCart",
    ()=>removeFromCart,
    "replyToMessage",
    ()=>replyToMessage,
    "replyToTicket",
    ()=>replyToTicket,
    "resetPassword",
    ()=>resetPassword,
    "saveSession",
    ()=>saveSession,
    "searchCourses",
    ()=>searchCourses,
    "submitAssignment",
    ()=>submitAssignment,
    "submitQuiz",
    ()=>submitQuiz,
    "updateCategory",
    ()=>updateCategory,
    "updateCourse",
    ()=>updateCourse,
    "updateLecture",
    ()=>updateLecture,
    "updateLectureProgress",
    ()=>updateLectureProgress,
    "updateProfile",
    ()=>updateProfile,
    "updateReview",
    ()=>updateReview,
    "updateSection",
    ()=>updateSection,
    "updateUserRole",
    ()=>updateUserRole,
    "uploadLectureVideo",
    ()=>uploadLectureVideo,
    "uploadResource",
    ()=>uploadResource,
    "validateCoupon",
    ()=>validateCoupon,
    "verifyCertificate",
    ()=>verifyCertificate
]);
/* ──────────────────────── helpers ──────────────────────── */ const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
const TOKEN_KEY = 'udemy_clone_token';
const USER_KEY = 'udemy_clone_user';
function getToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function getStoredUser() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const raw = undefined;
}
function saveSession(session) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function clearSession() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
async function request(path, init) {
    const token = getToken();
    const isFormData = init?.body instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            ...isFormData ? {} : {
                'Content-Type': 'application/json'
            },
            ...token ? {
                Authorization: `Bearer ${token}`
            } : {},
            ...init?.headers ?? {}
        }
    });
    if (!response.ok) {
        const text = await response.text();
        let friendly = `Request failed: ${response.status}`;
        try {
            const json = JSON.parse(text);
            const msg = json.message;
            if (Array.isArray(msg)) {
                friendly = msg.join('. ');
            } else if (typeof msg === 'string') {
                friendly = msg;
            }
        } catch  {
            if (text) friendly = text;
        }
        throw new Error(friendly);
    }
    return await response.json();
}
function register(payload) {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function login(payload) {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function getMe() {
    return request('/auth/me');
}
function forgotPassword(payload) {
    return request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function resetPassword(payload) {
    return request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function getProfile() {
    return request('/profile');
}
function updateProfile(payload) {
    return request('/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
}
function changePassword(payload) {
    return request('/profile/change-password', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function getCategories() {
    return request('/categories');
}
function createCategory(payload) {
    return request('/categories', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function updateCategory(id, payload) {
    return request(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
}
function deleteCategory(id) {
    return request(`/categories/${id}`, {
        method: 'DELETE'
    });
}
function searchCourses(params) {
    const sp = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([k, v])=>{
            if (v !== undefined && v !== '') sp.set(k, String(v));
        });
    }
    const qs = sp.toString();
    return request(`/courses${qs ? `?${qs}` : ''}`);
}
function createCourse(payload) {
    return request('/courses', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function listMyInstructorCourses() {
    return request('/courses/instructor/mine');
}
function publishCourse(courseId) {
    return request(`/courses/${courseId}/publish`, {
        method: 'PATCH'
    });
}
function getInstructorCourse(courseId) {
    return request(`/courses/instructor/${courseId}`);
}
function updateCourse(courseId, payload) {
    return request(`/courses/${courseId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
}
function addSection(courseId, payload) {
    return request(`/courses/${courseId}/sections`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function updateSection(courseId, sectionId, payload) {
    return request(`/courses/${courseId}/sections/${sectionId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
}
function deleteSection(courseId, sectionId) {
    return request(`/courses/${courseId}/sections/${sectionId}`, {
        method: 'DELETE'
    });
}
function uploadResource(payload) {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('file', payload.file);
    return request(`/courses/${payload.courseId}/sections/${payload.sectionId}/lectures/${payload.lectureId}/resources`, {
        method: 'POST',
        body: formData
    });
}
function deleteResource(payload) {
    return request(`/courses/${payload.courseId}/sections/${payload.sectionId}/lectures/${payload.lectureId}/resources/${payload.resourceId}`, {
        method: 'DELETE'
    });
}
function uploadLectureVideo(payload) {
    const formData = new FormData();
    formData.append('title', payload.title);
    if (typeof payload.durationSec === 'number' && payload.durationSec > 0) {
        formData.append('durationSec', String(payload.durationSec));
    }
    formData.append('video', payload.video);
    return request(`/courses/${payload.courseId}/sections/${payload.sectionId}/lectures`, {
        method: 'POST',
        body: formData
    });
}
function updateLecture(payload) {
    const formData = new FormData();
    if (payload.title) formData.append('title', payload.title);
    if (typeof payload.position === 'number') formData.append('position', String(payload.position));
    if (typeof payload.durationSec === 'number') formData.append('durationSec', String(payload.durationSec));
    if (payload.content) formData.append('content', payload.content);
    if (typeof payload.isPublished === 'boolean') formData.append('isPublished', String(payload.isPublished));
    if (typeof payload.isFreePreview === 'boolean') formData.append('isFreePreview', String(payload.isFreePreview));
    if (payload.video) formData.append('video', payload.video);
    return request(`/courses/${payload.courseId}/sections/${payload.sectionId}/lectures/${payload.lectureId}`, {
        method: 'PATCH',
        body: formData
    });
}
function enrollInCourse(courseId) {
    return request(`/enrollments/${courseId}`, {
        method: 'POST'
    });
}
function listMyLearning() {
    return request('/enrollments/me');
}
function updateLectureProgress(courseId, lectureId, payload) {
    return request(`/progress/lecture/${lectureId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
}
function getCourseProgress(courseId) {
    return request(`/progress/course/${courseId}`);
}
function getVideoStreamUrl(lectureId) {
    return request(`/videos/token/${lectureId}`);
}
function getCourseReviews(courseId) {
    return request(`/reviews/course/${courseId}`);
}
function createReview(courseId, payload) {
    return request(`/reviews/course/${courseId}`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function updateReview(reviewId, payload) {
    return request(`/reviews/${reviewId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
}
function deleteReview(reviewId) {
    return request(`/reviews/${reviewId}`, {
        method: 'DELETE'
    });
}
function getCart() {
    return request('/cart');
}
function addToCart(courseId) {
    return request(`/cart/${courseId}`, {
        method: 'POST'
    });
}
function removeFromCart(courseId) {
    return request(`/cart/${courseId}`, {
        method: 'DELETE'
    });
}
function clearCart() {
    return request('/cart', {
        method: 'DELETE'
    });
}
function checkout(payload) {
    return request('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload ?? {})
    });
}
function getOrders() {
    return request('/orders');
}
function getOrder(orderId) {
    return request(`/orders/${orderId}`);
}
function validateCoupon(code) {
    return request(`/payments/coupon/${code}`);
}
function getWallet() {
    return request('/payments/wallet');
}
function getInstructorRevenue() {
    return request('/payments/revenue');
}
function getCourseQuizzes(courseId) {
    return request(`/quizzes/course/${courseId}`);
}
function getQuiz(quizId) {
    return request(`/quizzes/${quizId}`);
}
function submitQuiz(quizId, answers) {
    return request(`/quizzes/${quizId}/submit`, {
        method: 'POST',
        body: JSON.stringify({
            answers
        })
    });
}
function getQuizAttempts(quizId) {
    return request(`/quizzes/${quizId}/attempts`);
}
function createQuiz(payload) {
    return request('/quizzes', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function getCourseAssignments(courseId) {
    return request(`/assignments/course/${courseId}`);
}
function submitAssignment(assignmentId, payload) {
    return request(`/assignments/${assignmentId}/submit`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function getAssignmentSubmissions(assignmentId) {
    return request(`/assignments/${assignmentId}/submissions`);
}
function gradeAssignment(submissionId, payload) {
    return request(`/assignments/submissions/${submissionId}/grade`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
}
function createAssignment(payload) {
    return request('/assignments', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function generateCertificate(courseId) {
    return request(`/certificates/generate/${courseId}`, {
        method: 'POST'
    });
}
function getMyCertificates() {
    return request('/certificates/me');
}
function verifyCertificate(certId) {
    return request(`/certificates/verify/${certId}`);
}
function getNotifications() {
    return request('/notifications');
}
function getUnreadCount() {
    return request('/notifications/unread-count');
}
function markNotificationRead(id) {
    return request(`/notifications/${id}/read`, {
        method: 'PATCH'
    });
}
function markAllNotificationsRead() {
    return request('/notifications/read-all', {
        method: 'PATCH'
    });
}
function getUnreadMessageCount() {
    return request('/messages/unread-count');
}
function getInbox() {
    return request('/messages/inbox');
}
function getSentMessages() {
    return request('/messages/sent');
}
function getMessage(id) {
    return request(`/messages/${id}`);
}
function composeMessage(payload) {
    return request('/messages', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function replyToMessage(messageId, content) {
    return request(`/messages/${messageId}/reply`, {
        method: 'POST',
        body: JSON.stringify({
            content
        })
    });
}
function markMessageRead(id) {
    return request(`/messages/${id}/read`, {
        method: 'PATCH'
    });
}
function createSupportTicket(payload) {
    return request('/support/tickets', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function getMyTickets() {
    return request('/support/tickets/me');
}
function getTicket(ticketId) {
    return request(`/support/tickets/${ticketId}`);
}
function replyToTicket(ticketId, content) {
    return request(`/support/tickets/${ticketId}/reply`, {
        method: 'POST',
        body: JSON.stringify({
            content
        })
    });
}
function getFaqs() {
    return request('/support/faqs');
}
function getAdminDashboard() {
    return request('/admin/dashboard');
}
function getAdminUsers(params) {
    const sp = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([k, v])=>{
            if (v !== undefined && v !== '') sp.set(k, String(v));
        });
    }
    const qs = sp.toString();
    return request(`/admin/users${qs ? `?${qs}` : ''}`);
}
function updateUserRole(userId, role) {
    return request(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({
            role
        })
    });
}
function banUser(userId) {
    return request(`/admin/users/${userId}/ban`, {
        method: 'PATCH'
    });
}
function approveInstructor(userId) {
    return request(`/admin/users/${userId}/approve-instructor`, {
        method: 'PATCH'
    });
}
function getAdminCourses(params) {
    const sp = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([k, v])=>{
            if (v !== undefined && v !== '') sp.set(k, String(v));
        });
    }
    const qs = sp.toString();
    return request(`/admin/courses${qs ? `?${qs}` : ''}`);
}
function getAdminCourseDetail(courseId) {
    return request(`/admin/courses/${courseId}`);
}
function approveCourse(courseId) {
    return request(`/admin/courses/${courseId}/approve`, {
        method: 'PATCH'
    });
}
function rejectCourse(courseId, reason) {
    return request(`/admin/courses/${courseId}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({
            reason
        })
    });
}
function getAdminCoupons() {
    return request('/admin/coupons');
}
function createCoupon(payload) {
    return request('/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
function deleteCoupon(couponId) {
    return request(`/admin/coupons/${couponId}`, {
        method: 'DELETE'
    });
}
function getInstructorAnalytics() {
    return request('/analytics/instructor');
}
function getPlatformAnalytics() {
    return request('/analytics/platform');
}
function getStudentAnalytics() {
    return request('/analytics/student');
}
}),
"[project]/web/src/components/site-header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/src/lib/client-api.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function SiteHeader() {
    const [userName, setUserName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userRole, setUserRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [unreadNotifs, setUnreadNotifs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [unreadMsgs, setUnreadMsgs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function syncAuth() {
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoredUser"])();
            setUserName(user?.name ?? null);
            setUserRole(user?.role ?? null);
            if (user) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUnreadCount"])().then((res)=>setUnreadNotifs(res.count)).catch(()=>{});
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUnreadMessageCount"])().then((res)=>setUnreadMsgs(res.count)).catch(()=>{});
            } else {
                setUnreadNotifs(0);
                setUnreadMsgs(0);
            }
        }
        syncAuth();
        window.addEventListener('auth-change', syncAuth);
        // Poll every 30s for new messages/notifications
        const interval = setInterval(syncAuth, 30000);
        return ()=>{
            window.removeEventListener('auth-change', syncAuth);
            clearInterval(interval);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "border-b border-slate-200 bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "text-xl font-bold text-slate-900",
                    children: "Udemy Clone"
                }, void 0, false, {
                    fileName: "[project]/web/src/components/site-header.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700",
                    children: [
                        userRole !== 'ADMIN' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/courses",
                            className: "hover:text-slate-950",
                            children: "Courses"
                        }, void 0, false, {
                            fileName: "[project]/web/src/components/site-header.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this),
                        userName && userRole !== 'ADMIN' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                userRole === 'STUDENT' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/my-learning",
                                    className: "hover:text-slate-950",
                                    children: "My Learning"
                                }, void 0, false, {
                                    fileName: "[project]/web/src/components/site-header.tsx",
                                    lineNumber: 60,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/cart",
                                    className: "relative hover:text-slate-950",
                                    children: "🛒 Cart"
                                }, void 0, false, {
                                    fileName: "[project]/web/src/components/site-header.tsx",
                                    lineNumber: 66,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/notifications",
                                    className: `relative transition-colors ${unreadNotifs > 0 ? 'text-amber-500 hover:text-amber-600' : 'hover:text-slate-950'}`,
                                    children: [
                                        "🔔",
                                        unreadNotifs > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white",
                                            children: unreadNotifs > 9 ? '9+' : unreadNotifs
                                        }, void 0, false, {
                                            fileName: "[project]/web/src/components/site-header.tsx",
                                            lineNumber: 81,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/src/components/site-header.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/messages",
                                    className: `relative transition-colors ${unreadMsgs > 0 ? 'text-violet-600 hover:text-violet-700' : 'hover:text-slate-950'}`,
                                    children: [
                                        "✉️",
                                        unreadMsgs > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white",
                                            children: unreadMsgs > 9 ? '9+' : unreadMsgs
                                        }, void 0, false, {
                                            fileName: "[project]/web/src/components/site-header.tsx",
                                            lineNumber: 98,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/src/components/site-header.tsx",
                                    lineNumber: 88,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/support",
                                    className: "hover:text-slate-950",
                                    children: "Support"
                                }, void 0, false, {
                                    fileName: "[project]/web/src/components/site-header.tsx",
                                    lineNumber: 105,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        userRole === 'INSTRUCTOR' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/instructor/courses",
                            className: "hover:text-slate-950",
                            children: "Instructor"
                        }, void 0, false, {
                            fileName: "[project]/web/src/components/site-header.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this),
                        userRole === 'ADMIN' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/admin",
                            className: "rounded-md bg-red-100 px-3 py-1.5 text-red-700 hover:bg-red-200",
                            children: "Admin"
                        }, void 0, false, {
                            fileName: "[project]/web/src/components/site-header.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this),
                        !userName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/auth/login",
                                    className: "rounded-md border border-slate-300 px-3 py-1.5",
                                    children: "Login"
                                }, void 0, false, {
                                    fileName: "[project]/web/src/components/site-header.tsx",
                                    lineNumber: 128,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/auth/register",
                                    className: "rounded-md bg-slate-900 px-3 py-1.5 text-white",
                                    children: "Register"
                                }, void 0, false, {
                                    fileName: "[project]/web/src/components/site-header.tsx",
                                    lineNumber: 131,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/profile",
                                    className: "rounded-md bg-slate-100 px-3 py-1.5 text-slate-800 hover:bg-slate-200",
                                    children: userName
                                }, void 0, false, {
                                    fileName: "[project]/web/src/components/site-header.tsx",
                                    lineNumber: 137,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>{
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$client$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearSession"])();
                                        setUserName(null);
                                        setUserRole(null);
                                        window.location.href = '/';
                                    },
                                    className: "rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50",
                                    children: "Logout"
                                }, void 0, false, {
                                    fileName: "[project]/web/src/components/site-header.tsx",
                                    lineNumber: 143,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/src/components/site-header.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/web/src/components/site-header.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/web/src/components/site-header.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11e8bca2._.js.map