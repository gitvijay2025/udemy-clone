/* ──────────────────────── types ──────────────────────── */

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
};

export type CourseListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  previewVideoUrl: string | null;
  level: CourseLevel;
  language: string;
  price: string | number;
  isPublished: boolean;
  averageRating?: number;
  instructor: { id: string; name: string };
  category?: { id: string; name: string; slug: string } | null;
  _count?: { enrollments: number; reviews: number };
};

export type PaginatedCourses = {
  courses: CourseListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type InstructorCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  price: string | number;
  isPublished: boolean;
  status: CourseStatus;
  language: string;
  requirements: string | null;
  targetAudience: string | null;
  previewVideoUrl: string | null;
  thumbnailUrl: string | null;
  categoryId: string | null;
  createdAt: string;
  sections?: Section[];
};

export type Section = {
  id: string;
  title: string;
  position: number;
  isPublished: boolean;
  lectures?: Lecture[];
};

export type Lecture = {
  id: string;
  title: string;
  position: number;
  durationSec?: number | null;
  content?: string | null;
  isPublished: boolean;
  isFreePreview: boolean;
  videoUrl: string | null;
  resources?: Resource[];
};

export type Resource = {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
};

export type LearningItem = {
  id: string;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  course: {
    id: string;
    slug: string;
    title: string;
    description: string;
    thumbnailUrl: string | null;
    level: CourseLevel;
    instructor: { id: string; name: string };
  };
};

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null };
};

export type ReviewsResponse = {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
};

export type CartItem = {
  id: string;
  courseId: string;
  course: CourseListItem;
};

export type Cart = {
  id: string;
  items: CartItem[];
};

export type Order = {
  id: string;
  totalAmount: string | number;
  paymentStatus: string;
  couponCode: string | null;
  discountAmount: string | number | null;
  createdAt: string;
  items: Array<{
    id: string;
    price: string | number;
    course: { id: string; title: string; slug: string; thumbnailUrl: string | null };
  }>;
};

export type Quiz = {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  timeLimit: number | null;
  courseId: string;
  questions: QuizQuestion[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  points: number;
  options: Array<{ id: string; text: string; isCorrect?: boolean }>;
};

export type QuizAttempt = {
  id: string;
  score: number;
  passed: boolean;
  totalPoints: number;
  startedAt: string;
  completedAt: string | null;
};

export type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  maxScore: number;
  courseId: string;
};

export type AssignmentSubmission = {
  id: string;
  content: string;
  fileUrl: string | null;
  score: number | null;
  feedback: string | null;
  submittedAt: string;
  gradedAt: string | null;
};

export type Certificate = {
  id: string;
  certificateUrl: string;
  issuedAt: string;
  course: { title: string; slug: string };
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type Message = {
  id: string;
  subject: string | null;
  content: string;
  isRead: boolean;
  createdAt: string;
  parentId: string | null;
  sender: { id: string; name: string; avatarUrl: string | null };
  receiver: { id: string; name: string; avatarUrl: string | null };
  replyCount?: number;
};

export type MessageDetail = Message & {
  replies: Message[];
};

export type SupportTicket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; name: string };
  }>;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  position: number;
};

export type Profile = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  locale: string;
  currency: string;
  twoFactorEnabled: boolean;
  createdAt: string;
};

export type Wallet = {
  id: string;
  balance: string | number;
  transactions: Array<{
    id: string;
    amount: string | number;
    type: string;
    description: string | null;
    createdAt: string;
  }>;
};

export type AdminStats = {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentUsers: Array<{ id: string; name: string; email: string; role: UserRole; createdAt: string }>;
};

export type LectureProgress = {
  lectureId: string;
  completed: boolean;
  watchedSec: number;
};

export type CourseProgress = {
  courseId: string;
  overallProgress: number;
  sections: Array<{
    id: string;
    title: string;
    lectures: Array<{
      id: string;
      title: string;
      videoUrl?: string | null;
      hasVideo?: boolean;
      progress: LectureProgress | null;
    }>;
  }>;
};

/* ──────────────────────── helpers ──────────────────────── */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
const TOKEN_KEY = 'udemy_clone_token';
const USER_KEY = 'udemy_clone_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthResponse): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, session.accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  window.dispatchEvent(new Event('auth-change'));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('auth-change'));
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const isFormData = init?.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
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
    } catch {
      if (text) friendly = text;
    }
    throw new Error(friendly);
  }

  return (await response.json()) as T;
}

/* ──────────────────────── auth ──────────────────────── */

export function register(payload: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return request<AuthUser>('/auth/me');
}

export function forgotPassword(payload: { email: string }) {
  return request<{ message: string; resetToken?: string; resetUrl?: string }>(
    '/auth/forgot-password',
    { method: 'POST', body: JSON.stringify(payload) },
  );
}

export function resetPassword(payload: { token: string; newPassword: string }) {
  return request<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/* ──────────────────────── profile ──────────────────────── */

export function getProfile() {
  return request<Profile>('/profile');
}

export function updateProfile(payload: {
  name?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  locale?: string;
  currency?: string;
}) {
  return request<Profile>('/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  return request('/profile/change-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/* ──────────────────────── categories ──────────────────────── */

export function getCategories() {
  return request<Category[]>('/categories');
}

export function createCategory(payload: { name: string; slug: string; parentId?: string }) {
  return request<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCategory(id: string, payload: { name?: string; slug?: string }) {
  return request<Category>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(id: string) {
  return request(`/categories/${id}`, { method: 'DELETE' });
}

/* ──────────────────────── courses ──────────────────────── */

export function searchCourses(params?: {
  search?: string;
  category?: string;
  level?: CourseLevel;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') sp.set(k, String(v));
    });
  }
  const qs = sp.toString();
  return request<PaginatedCourses>(`/courses${qs ? `?${qs}` : ''}`);
}

export function createCourse(payload: {
  title: string;
  slug: string;
  description: string;
  price: number;
  level: CourseLevel;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  language?: string;
  requirements?: string[];
  targetAudience?: string[];
  categoryId?: string;
}) {
  return request<InstructorCourse>('/courses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function listMyInstructorCourses() {
  return request<InstructorCourse[]>('/courses/instructor/mine');
}

export function publishCourse(courseId: string) {
  return request<InstructorCourse>(`/courses/${courseId}/publish`, {
    method: 'PATCH',
  });
}

export function getInstructorCourse(courseId: string) {
  return request<InstructorCourse>(`/courses/instructor/${courseId}`);
}

export function updateCourse(
  courseId: string,
  payload: {
    title?: string;
    slug?: string;
    description?: string;
    price?: number;
    level?: CourseLevel;
    thumbnailUrl?: string;
    previewVideoUrl?: string;
    language?: string;
    requirements?: string[];
    targetAudience?: string[];
    categoryId?: string;
  },
) {
  return request<InstructorCourse>(`/courses/${courseId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function addSection(courseId: string, payload: { title: string; position?: number }) {
  return request(`/courses/${courseId}/sections`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateSection(
  courseId: string,
  sectionId: string,
  payload: { title?: string; position?: number; isPublished?: boolean },
) {
  return request(`/courses/${courseId}/sections/${sectionId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteSection(courseId: string, sectionId: string) {
  return request(`/courses/${courseId}/sections/${sectionId}`, {
    method: 'DELETE',
  });
}

export function uploadResource(payload: {
  courseId: string;
  sectionId: string;
  lectureId: string;
  title: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('file', payload.file);
  return request<Resource>(
    `/courses/${payload.courseId}/sections/${payload.sectionId}/lectures/${payload.lectureId}/resources`,
    { method: 'POST', body: formData },
  );
}

export function deleteResource(payload: {
  courseId: string;
  sectionId: string;
  lectureId: string;
  resourceId: string;
}) {
  return request(
    `/courses/${payload.courseId}/sections/${payload.sectionId}/lectures/${payload.lectureId}/resources/${payload.resourceId}`,
    { method: 'DELETE' },
  );
}

export function uploadLectureVideo(payload: {
  courseId: string;
  sectionId: string;
  title: string;
  durationSec?: number;
  video: File;
}) {
  const formData = new FormData();
  formData.append('title', payload.title);
  if (typeof payload.durationSec === 'number' && payload.durationSec > 0) {
    formData.append('durationSec', String(payload.durationSec));
  }
  formData.append('video', payload.video);

  return request(
    `/courses/${payload.courseId}/sections/${payload.sectionId}/lectures`,
    { method: 'POST', body: formData },
  );
}

export function updateLecture(payload: {
  courseId: string;
  sectionId: string;
  lectureId: string;
  title?: string;
  position?: number;
  durationSec?: number;
  content?: string;
  isPublished?: boolean;
  isFreePreview?: boolean;
  video?: File;
}) {
  const formData = new FormData();
  if (payload.title) formData.append('title', payload.title);
  if (typeof payload.position === 'number') formData.append('position', String(payload.position));
  if (typeof payload.durationSec === 'number') formData.append('durationSec', String(payload.durationSec));
  if (payload.content) formData.append('content', payload.content);
  if (typeof payload.isPublished === 'boolean') formData.append('isPublished', String(payload.isPublished));
  if (typeof payload.isFreePreview === 'boolean') formData.append('isFreePreview', String(payload.isFreePreview));
  if (payload.video) formData.append('video', payload.video);

  return request(
    `/courses/${payload.courseId}/sections/${payload.sectionId}/lectures/${payload.lectureId}`,
    { method: 'PATCH', body: formData },
  );
}

/* ──────────────────────── enrollments ──────────────────────── */

export function enrollInCourse(courseId: string) {
  return request(`/enrollments/${courseId}`, { method: 'POST' });
}

export function listMyLearning() {
  return request<LearningItem[]>('/enrollments/me');
}

/* ──────────────────────── progress ──────────────────────── */

export function updateLectureProgress(
  courseId: string,
  lectureId: string,
  payload: { completed?: boolean; watchedSec?: number },
) {
  return request(`/progress/lecture/${lectureId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getCourseProgress(courseId: string) {
  return request<CourseProgress>(`/progress/course/${courseId}`);
}

/* ──────────────────── video streaming ──────────────────── */

export function getVideoStreamUrl(lectureId: string) {
  return request<{ streamUrl: string; expiresIn: number }>(`/videos/token/${lectureId}`);
}

/* ──────────────────────── reviews ──────────────────────── */

export function getCourseReviews(courseId: string) {
  return request<ReviewsResponse>(`/reviews/course/${courseId}`);
}

export function createReview(courseId: string, payload: { rating: number; comment?: string }) {
  return request<Review>(`/reviews/course/${courseId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateReview(reviewId: string, payload: { rating?: number; comment?: string }) {
  return request<Review>(`/reviews/${reviewId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteReview(reviewId: string) {
  return request(`/reviews/${reviewId}`, { method: 'DELETE' });
}

/* ──────────────────────── cart ──────────────────────── */

export function getCart() {
  return request<Cart>('/cart');
}

export function addToCart(courseId: string) {
  return request<Cart>(`/cart/${courseId}`, { method: 'POST' });
}

export function removeFromCart(courseId: string) {
  return request<Cart>(`/cart/${courseId}`, { method: 'DELETE' });
}

export function clearCart() {
  return request<Cart>('/cart', { method: 'DELETE' });
}

/* ──────────────────────── orders ──────────────────────── */

export function checkout(payload?: { couponCode?: string }) {
  return request<Order>('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(payload ?? {}),
  });
}

export function getOrders() {
  return request<Order[]>('/orders');
}

export function getOrder(orderId: string) {
  return request<Order>(`/orders/${orderId}`);
}

/* ──────────────────────── payments ──────────────────────── */

export function validateCoupon(code: string) {
  return request<{ valid: boolean; discount: number; type: string }>(`/payments/coupon/${code}`);
}

export function getWallet() {
  return request<Wallet>('/payments/wallet');
}

export function getInstructorRevenue() {
  return request('/payments/revenue');
}

/* ──────────────────────── quizzes ──────────────────────── */

export function getCourseQuizzes(courseId: string) {
  return request<Quiz[]>(`/quizzes/course/${courseId}`);
}

export function getQuiz(quizId: string) {
  return request<Quiz>(`/quizzes/${quizId}`);
}

export function submitQuiz(quizId: string, answers: Array<{ questionId: string; answer: string }>) {
  return request<QuizAttempt>(`/quizzes/${quizId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}

export function getQuizAttempts(quizId: string) {
  return request<QuizAttempt[]>(`/quizzes/${quizId}/attempts`);
}

export function createQuiz(payload: {
  title: string;
  description?: string;
  passingScore?: number;
  timeLimit?: number;
  courseId: string;
  questions: Array<{
    question: string;
    type: string;
    points?: number;
    options: Array<{ text: string; isCorrect: boolean }>;
  }>;
}) {
  return request<Quiz>('/quizzes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/* ──────────────────────── assignments ──────────────────────── */

export function getCourseAssignments(courseId: string) {
  return request<Assignment[]>(`/assignments/course/${courseId}`);
}

export function submitAssignment(assignmentId: string, payload: { content: string; fileUrl?: string }) {
  return request<AssignmentSubmission>(`/assignments/${assignmentId}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getAssignmentSubmissions(assignmentId: string) {
  return request<AssignmentSubmission[]>(`/assignments/${assignmentId}/submissions`);
}

export function gradeAssignment(
  submissionId: string,
  payload: { score: number; feedback?: string },
) {
  return request<AssignmentSubmission>(`/assignments/submissions/${submissionId}/grade`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function createAssignment(payload: {
  title: string;
  description: string;
  dueDate?: string;
  maxScore?: number;
  courseId: string;
}) {
  return request<Assignment>('/assignments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/* ──────────────────────── certificates ──────────────────────── */

export function generateCertificate(courseId: string) {
  return request<Certificate>(`/certificates/generate/${courseId}`, { method: 'POST' });
}

export function getMyCertificates() {
  return request<Certificate[]>('/certificates/me');
}

export function verifyCertificate(certId: string) {
  return request<Certificate>(`/certificates/verify/${certId}`);
}

/* ──────────────────────── notifications ──────────────────────── */

export function getNotifications() {
  return request<Notification[]>('/notifications');
}

export function getUnreadCount() {
  return request<{ count: number }>('/notifications/unread-count');
}

export function markNotificationRead(id: string) {
  return request(`/notifications/${id}/read`, { method: 'PATCH' });
}

export function markAllNotificationsRead() {
  return request('/notifications/read-all', { method: 'PATCH' });
}

/* ──────────────────────── messages ──────────────────────── */

export function getUnreadMessageCount() {
  return request<{ count: number }>('/messages/unread-count');
}

export function getInbox() {
  return request<Message[]>('/messages/inbox');
}

export function getSentMessages() {
  return request<Message[]>('/messages/sent');
}

export function getMessage(id: string) {
  return request<MessageDetail>(`/messages/${id}`);
}

export function composeMessage(payload: { receiverId: string; subject: string; content: string }) {
  return request<Message>('/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function replyToMessage(messageId: string, content: string) {
  return request<Message>(`/messages/${messageId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export function markMessageRead(id: string) {
  return request(`/messages/${id}/read`, { method: 'PATCH' });
}

/* ──────────────────────── support ──────────────────────── */

export function createSupportTicket(payload: {
  subject: string;
  message: string;
  priority?: string;
}) {
  return request<SupportTicket>('/support/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMyTickets() {
  return request<SupportTicket[]>('/support/tickets/me');
}

export function getTicket(ticketId: string) {
  return request<SupportTicket>(`/support/tickets/${ticketId}`);
}

export function replyToTicket(ticketId: string, content: string) {
  return request(`/support/tickets/${ticketId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export function getFaqs() {
  return request<FAQ[]>('/support/faqs');
}

/* ──────────────────────── admin ──────────────────────── */

export function getAdminDashboard() {
  return request<AdminStats>('/admin/dashboard');
}

export function getAdminUsers(params?: { search?: string; role?: string; page?: number; limit?: number }) {
  const sp = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') sp.set(k, String(v));
    });
  }
  const qs = sp.toString();
  return request<{ users: Array<AuthUser & { createdAt: string; isBanned?: boolean }>; total: number }>(
    `/admin/users${qs ? `?${qs}` : ''}`,
  );
}

export function updateUserRole(userId: string, role: UserRole) {
  return request(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export function banUser(userId: string) {
  return request(`/admin/users/${userId}/ban`, { method: 'PATCH' });
}

export function approveInstructor(userId: string) {
  return request(`/admin/users/${userId}/approve-instructor`, { method: 'PATCH' });
}

export function getAdminCourses(params?: { status?: string; page?: number; limit?: number }) {
  const sp = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') sp.set(k, String(v));
    });
  }
  const qs = sp.toString();
  return request<{ courses: CourseListItem[]; total: number }>(`/admin/courses${qs ? `?${qs}` : ''}`);
}

export function getAdminCourseDetail(courseId: string) {
  return request<any>(`/admin/courses/${courseId}`);
}

export function approveCourse(courseId: string) {
  return request(`/admin/courses/${courseId}/approve`, { method: 'PATCH' });
}

export function rejectCourse(courseId: string, reason?: string) {
  return request(`/admin/courses/${courseId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

export function getAdminCoupons() {
  return request<Array<{ id: string; code: string; discountPercent: number; isActive: boolean; currentUses: number; maxUses: number | null; courseId: number | null; expiresAt: string | null; createdAt: string }>>('/admin/coupons');
}

export function createCoupon(payload: {
  code: string;
  discountPercent: number;
  maxUses?: number;
  courseId?: string;
  expiresAt?: string;
}) {
  return request('/admin/coupons', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteCoupon(couponId: string) {
  return request(`/admin/coupons/${couponId}`, { method: 'DELETE' });
}

/* ──────────────────────── analytics ──────────────────────── */

export function getInstructorAnalytics() {
  return request('/analytics/instructor');
}

export function getPlatformAnalytics() {
  return request('/analytics/platform');
}

export function getStudentAnalytics() {
  return request('/analytics/student');
}
