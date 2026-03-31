# Udemy Clone – Project Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Database Schema – 29 Tables](#4-database-schema--29-tables)
5. [Application Flow](#5-application-flow)
6. [API Modules (20 Modules)](#6-api-modules-20-modules)
7. [Frontend Pages (27 Routes)](#7-frontend-pages-27-routes)
8. [User Roles & Permissions](#8-user-roles--permissions)
9. [How to Run](#9-how-to-run)
10. [Complete Table Schemas](#10-complete-table-schemas-29-tables)
11. [State Diagrams](#11-state-diagrams)

---

## 1. Project Overview

A full-featured Udemy-like online learning platform where **Instructors** create and sell courses, **Students** browse, purchase, and learn, and **Admins** manage the entire platform. The application supports course creation with sections/lectures, shopping cart & checkout, quizzes & assignments, certificates, messaging, notifications, support tickets, analytics, and more.

---

## 2. Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| **Backend**  | NestJS 11, TypeScript, mysql2 (raw SQL queries) |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4            |
| **Database** | MySQL 8.4 (Docker)                              |
| **Auth**     | JWT + bcrypt + Passport                         |
| **Infra**    | Docker Compose (MySQL + Redis)                  |

---

## 3. Architecture

```
┌──────────────┐         ┌──────────────┐         ┌────────────┐
│   Next.js    │  HTTP   │   NestJS     │  SQL    │   MySQL    │
│   Frontend   │ ──────► │   Backend    │ ──────► │   8.4      │
│   :3000      │  /api   │   :3001      │  mysql2 │   :3306    │
└──────────────┘         └──────────────┘         └────────────┘
```

- **Frontend** (apps/web) — Server-side rendered Next.js app with App Router
- **Backend** (apps/api) — RESTful API with 20 modules, JWT auth, role-based guards
- **Database** — 29 MySQL tables, raw SQL via mysql2 connection pool

---

## 4. Database Schema – 29 Tables

### Summary Table

| #  | Table Name             | Purpose                              | Key Relations                    |
| -- | ---------------------- | ------------------------------------ | -------------------------------- |
| 1  | **User**               | All users (student/instructor/admin) | –                                |
| 2  | **Category**           | Course categories (hierarchical)     | Self-referencing (parentId)      |
| 3  | **Course**             | Courses created by instructors       | → User, → Category              |
| 4  | **Section**            | Course sections (chapters)           | → Course                        |
| 5  | **Lecture**            | Individual lessons within sections   | → Section                       |
| 6  | **Resource**           | Downloadable files for lectures      | → Lecture                       |
| 7  | **Enrollment**         | Student ↔ Course enrollment          | → User, → Course                |
| 8  | **LectureProgress**    | Per-lecture watch progress            | → User, → Lecture               |
| 9  | **Review**             | Course ratings & comments            | → User, → Course                |
| 10 | **Cart**               | Shopping cart (one per user)          | → User                          |
| 11 | **CartItem**           | Items inside a cart                  | → Cart, → Course                |
| 12 | **Order**              | Purchase orders                      | → User, → Coupon                |
| 13 | **OrderItem**          | Individual items in an order         | → Order, → Course               |
| 14 | **Coupon**             | Discount coupons                     | → Course (optional)             |
| 15 | **Quiz**               | Quizzes attached to courses          | → Course                        |
| 16 | **QuizQuestion**       | Questions within a quiz              | → Quiz                          |
| 17 | **QuizOption**         | Answer options for a question        | → QuizQuestion                  |
| 18 | **QuizAttempt**        | Student's quiz attempt record        | → User, → Quiz                  |
| 19 | **QuizAnswer**         | Individual answers per attempt        | → QuizAttempt, → QuizQuestion   |
| 20 | **Assignment**         | Assignments for courses              | → Course                        |
| 21 | **AssignmentSubmission**| Student submissions for assignments  | → Assignment, → User            |
| 22 | **Certificate**        | Completion certificates              | → User, → Course                |
| 23 | **Notification**       | User notifications                   | → User                          |
| 24 | **Message**            | Direct messages between users        | → User (sender), → User (receiver) |
| 25 | **SupportTicket**      | Help/support tickets                 | → User                          |
| 26 | **TicketMessage**      | Messages within a support ticket     | → SupportTicket, → User         |
| 27 | **FAQ**                | Frequently asked questions           | –                                |
| 28 | **Wallet**             | Instructor earnings wallet           | → User                          |
| 29 | **WalletTransaction**  | Wallet credit/debit history          | → Wallet                        |

### Entity Relationship Diagram (Text)

```
User ──┬── Course ──┬── Section ── Lecture ── Resource
       │            │                  │
       │            ├── Enrollment ────┘ (via LectureProgress)
       │            ├── Review
       │            ├── Quiz ── QuizQuestion ── QuizOption
       │            │             └── QuizAnswer ── QuizAttempt
       │            ├── Assignment ── AssignmentSubmission
       │            └── OrderItem ── Order ── Coupon
       │
       ├── Cart ── CartItem
       ├── Wallet ── WalletTransaction
       ├── Certificate
       ├── Notification
       ├── Message (sender/receiver)
       ├── SupportTicket ── TicketMessage
       └── Category (hierarchical, self-ref)

Standalone: FAQ
```

---

## 5. Application Flow

### 5.1 Authentication Flow

```
Register → POST /api/auth/register → Hash password → Insert User → Return JWT
Login    → POST /api/auth/login    → Verify bcrypt  → Return JWT + user info
Auth     → GET  /api/auth/me       → Decode JWT     → Return current user
```

- Passwords hashed with **bcrypt** (10 rounds)
- JWT token contains: `sub` (userId), `email`, `role`
- Protected routes use `JwtAuthGuard` + `RolesGuard`

### 5.2 Course Creation Flow (Instructor)

```
1. Instructor creates course     → POST /api/courses
2. Add sections to course        → POST /api/courses/:id/sections
3. Add lectures to sections      → POST /api/courses/:courseId/sections/:sectionId/lectures
4. Update content (video, text)  → PATCH lectures/sections/course
5. Publish course                → PATCH /api/courses/:id/publish (status → PENDING_REVIEW)
6. Admin approves                → PATCH /api/admin/courses/:id/approve (status → APPROVED)
7. Course goes live (isPublished = true)
```

### 5.3 Student Purchase Flow

```
1. Browse courses                → GET /api/courses?category=&level=&search=
2. View course detail            → GET /api/courses/slug/:slug
3. Add to cart                   → POST /api/cart/:courseId
4. View cart                     → GET /api/cart
5. Apply coupon (optional)       → POST /api/payments/validate-coupon
6. Checkout                      → POST /api/orders/checkout
   └── Creates Order + OrderItems
   └── Creates Enrollment records
   └── Credits instructor Wallet (70% revenue)
   └── Clears cart
   └── Sends notification
7. Order confirmation            → GET /api/orders/:id
```

### 5.4 Learning Flow

```
1. View enrolled courses         → GET /api/enrollments/me
2. Open course player            → /learn/:courseId (frontend)
3. Watch lecture                  → PATCH /api/progress/lecture/:lectureId
   └── Marks lecture completed
   └── Updates watchedSec
   └── Recalculates course progress %
4. View course progress          → GET /api/progress/course/:courseId
5. Take quiz                     → POST /api/quizzes/:id/submit
   └── Auto-graded (score calculated)
   └── Pass/fail determined by passingScore
6. Submit assignment             → POST /api/assignments/:id/submit
7. Instructor grades             → PATCH /api/assignments/submissions/:id/grade
8. Get certificate (100% done)   → POST /api/certificates/generate/:courseId
```

### 5.5 Review Flow

```
1. Student completes enrollment
2. Leave review                  → POST /api/reviews/course/:courseId
   └── Checks enrollment exists
   └── One review per user per course (upsert)
3. View reviews                  → GET /api/reviews/course/:courseId
   └── Returns reviews + average rating
```

### 5.6 Messaging Flow

```
1. Send message                  → POST /api/messages { receiverId, content }
   └── Creates notification for receiver
2. View conversations            → GET /api/messages (grouped by partner)
3. View thread                   → GET /api/messages/:partnerId
   └── Marks messages as read
```

### 5.7 Support Flow

```
1. Create ticket                 → POST /api/support/tickets { subject, priority, message }
2. View my tickets               → GET /api/support/tickets/me
3. Reply to ticket               → POST /api/support/tickets/:id/reply
   └── Admin reply can change status
4. Admin manages tickets         → GET /api/support/tickets (all)
   └── PATCH /api/support/tickets/:id/status
5. Browse FAQ                    → GET /api/support/faq
```

### 5.8 Admin Flow

```
1. Dashboard stats               → GET /api/admin/dashboard
   └── Total users, courses, enrollments, revenue
2. User management               → GET /api/admin/users
   └── Update role, ban user, approve instructor
3. Course moderation             → GET /api/admin/courses/pending
   └── Approve or reject courses
4. Coupon management             → CRUD /api/admin/coupons
5. Platform analytics            → GET /api/analytics/platform
```

### 5.9 Wallet & Payments Flow

```
1. Student checkout              → Order created, totalAmount charged
2. Instructor gets 70%           → Wallet credited automatically
3. View wallet                   → GET /api/payments/wallet
4. View revenue stats            → GET /api/payments/revenue
5. Refund request                → POST /api/orders/:id/refund
```

---

## 6. API Modules (20 Modules)

| #  | Module          | Controller Routes                                                        |
| -- | --------------- | ------------------------------------------------------------------------ |
| 1  | **Auth**        | `POST register`, `POST login`, `GET me`                                  |
| 2  | **Profile**     | `GET/PATCH profile`, `POST change-password/forgot/reset/verify/2fa`      |
| 3  | **Categories**  | `GET all`, `GET :slug`, `POST create`, `PATCH :id`, `DELETE :id`         |
| 4  | **Courses**     | `GET list`, `GET slug/:slug`, `POST create`, `PATCH update/publish`, sections/lectures CRUD |
| 5  | **Enrollments** | `POST :courseId`, `GET me`                                               |
| 6  | **Progress**    | `GET course/:courseId`, `PATCH lecture/:lectureId`                        |
| 7  | **Reviews**     | `GET/POST course/:courseId`, `PATCH :id`, `DELETE :id`                   |
| 8  | **Cart**        | `GET cart`, `POST/:DELETE :courseId`, `DELETE clear`                      |
| 9  | **Orders**      | `POST checkout`, `GET list`, `GET :id`, `POST :id/refund`               |
| 10 | **Payments**    | `POST validate-coupon`, `GET wallet`, `GET revenue`                      |
| 11 | **Quizzes**     | `GET course/:courseId`, `GET :id`, `POST create`, `POST submit`, `GET attempts` |
| 12 | **Assignments** | `GET/POST course/:courseId`, `POST submit`, `GET submissions`, `PATCH grade` |
| 13 | **Certificates**| `POST generate/:courseId`, `GET me`, `GET verify/:id`                    |
| 14 | **Notifications**| `GET list`, `GET unread-count`, `PATCH read/:id`, `PATCH read-all`, `DELETE :id` |
| 15 | **Messages**    | `GET conversations`, `GET :partnerId`, `POST send`                       |
| 16 | **Support**     | FAQ CRUD + `POST ticket`, `GET my/all tickets`, `POST reply`, `PATCH status` |
| 17 | **Admin**       | `GET dashboard/users/courses/coupons`, user/course/coupon management     |
| 18 | **Analytics**   | `GET student`, `GET instructor`, `GET platform`                          |
| 19 | **Database**    | Global module — mysql2 connection pool (DatabaseService)                 |
| 20 | **App**         | Root module — `GET /api` health check                                    |

---

## 7. Frontend Pages (27 Routes)

| #  | Route                                           | Page                        |
| -- | ----------------------------------------------- | --------------------------- |
| 1  | `/`                                             | Homepage                    |
| 2  | `/auth/login`                                   | Login page                  |
| 3  | `/auth/register`                                | Registration page           |
| 4  | `/courses`                                      | Course catalog / browse     |
| 5  | `/courses/[slug]`                               | Course detail page          |
| 6  | `/cart`                                         | Shopping cart               |
| 7  | `/my-learning`                                  | Enrolled courses list       |
| 8  | `/learn/[courseId]`                              | Course player               |
| 9  | `/certificates`                                 | My certificates             |
| 10 | `/profile`                                      | User profile settings       |
| 11 | `/messages`                                     | Direct messaging            |
| 12 | `/notifications`                                | Notifications list          |
| 13 | `/support`                                      | Support & FAQ               |
| 14 | `/instructor/courses`                           | Instructor course list      |
| 15 | `/instructor/courses/new`                       | Create new course           |
| 16 | `/instructor/courses/[id]/edit`                 | Edit course                 |
| 17 | `/instructor/courses/[courseId]/quizzes/new`     | Create quiz                 |
| 18 | `/instructor/courses/[courseId]/assignments/new` | Create assignment           |
| 19 | `/instructor/courses/[courseId]/assignments/[assignmentId]/submissions` | View submissions |
| 20 | `/instructor/analytics`                         | Instructor analytics        |
| 21 | `/admin`                                        | Admin dashboard             |
| 22 | `/admin/users`                                  | User management             |
| 23 | `/admin/courses`                                | Course moderation           |
| 24 | `/admin/categories`                             | Category management         |
| 25 | `/admin/coupons`                                | Coupon management           |
| 26 | `/admin/support`                                | Support ticket management   |
| 27 | `/admin/analytics`                              | Platform analytics          |

---

## 8. User Roles & Permissions

| Feature              | STUDENT | INSTRUCTOR | ADMIN |
| -------------------- | :-----: | :--------: | :---: |
| Browse/search courses | ✅      | ✅         | ✅    |
| Purchase courses      | ✅      | ✅         | ✅    |
| Enroll & learn        | ✅      | ✅         | ✅    |
| Leave reviews         | ✅      | ✅         | ✅    |
| Take quizzes          | ✅      | ✅         | ✅    |
| Submit assignments    | ✅      | ✅         | ✅    |
| Get certificates      | ✅      | ✅         | ✅    |
| Create courses        | ❌      | ✅         | ✅    |
| Create quizzes        | ❌      | ✅         | ✅    |
| Create assignments    | ❌      | ✅         | ✅    |
| Grade submissions     | ❌      | ✅         | ✅    |
| View instructor analytics | ❌  | ✅         | ✅    |
| Manage users          | ❌      | ❌         | ✅    |
| Approve courses       | ❌      | ❌         | ✅    |
| Manage coupons        | ❌      | ❌         | ✅    |
| Manage support tickets| ❌      | ❌         | ✅    |
| View platform analytics| ❌     | ❌         | ✅    |
| Manage FAQ            | ❌      | ❌         | ✅    |

---

## 9. How to Run

```bash
# 1. Start MySQL (Docker)
docker compose up -d

# 2. Initialize database (if tables don't exist)
docker compose exec mysql mysql -uudemy -pudemy123 udemy_clone < apps/api/scripts/init-db.sql

# 3. Start backend
cd apps/api
npm install
npx nest build
node dist/main.js          # Runs on http://localhost:3001

# 4. Start frontend
cd apps/web
npm install
npm run dev                # Runs on http://localhost:3000
```

### Environment Variables (Backend)

| Variable      | Default        | Description           |
| ------------- | -------------- | --------------------- |
| `DB_HOST`     | `localhost`    | MySQL host            |
| `DB_PORT`     | `3306`         | MySQL port            |
| `DB_USER`     | `udemy`        | MySQL user            |
| `DB_PASSWORD` | `udemy123`     | MySQL password        |
| `DB_NAME`     | `udemy_clone`  | MySQL database name   |
| `JWT_SECRET`  | `super-secret` | JWT signing key       |

---

## 10. Complete Table Schemas (29 Tables)

### Table 1 — User

| Column                   | Type         | Constraints                     |
| ------------------------ | ------------ | ------------------------------- |
| id                       | INT          | **PK**, AUTO_INCREMENT                          |
| email                    | VARCHAR(255) | NOT NULL, **UNIQUE**            |
| name                     | VARCHAR(255) | NOT NULL                        |
| password                 | VARCHAR(255) | NOT NULL                        |
| role                     | ENUM('STUDENT','INSTRUCTOR','ADMIN') | NOT NULL, DEFAULT 'STUDENT' |
| phone                    | VARCHAR(50)  | NULL                            |
| bio                      | TEXT         | NULL                            |
| avatarUrl                | VARCHAR(500) | NULL                            |
| emailVerified            | BOOLEAN      | NOT NULL, DEFAULT FALSE         |
| emailVerificationToken   | VARCHAR(255) | NULL                            |
| passwordResetToken       | VARCHAR(255) | NULL                            |
| passwordResetExpires     | DATETIME     | NULL                            |
| twoFactorEnabled         | BOOLEAN      | NOT NULL, DEFAULT FALSE         |
| twoFactorSecret          | VARCHAR(255) | NULL                            |
| isApprovedInstructor     | BOOLEAN      | NOT NULL, DEFAULT FALSE         |
| locale                   | VARCHAR(10)  | NOT NULL, DEFAULT 'en'          |
| currency                 | VARCHAR(10)  | NOT NULL, DEFAULT 'USD'         |
| createdAt                | DATETIME     | NOT NULL, DEFAULT NOW           |
| updatedAt                | DATETIME     | NOT NULL, AUTO-UPDATE           |

---

### Table 2 — Category

| Column    | Type         | Constraints                        |
| --------- | ------------ | ---------------------------------- |
| id        | INT          | **PK**, AUTO_INCREMENT                             |
| name      | VARCHAR(255) | NOT NULL, **UNIQUE**               |
| slug      | VARCHAR(255) | NOT NULL, **UNIQUE**               |
| parentId  | INT          | NULL, **FK → Category(id)** ON DELETE SET NULL |
| createdAt | DATETIME     | NOT NULL, DEFAULT NOW              |
| updatedAt | DATETIME     | NOT NULL, AUTO-UPDATE              |

---

### Table 3 — Course

| Column          | Type           | Constraints                                    |
| --------------- | -------------- | ---------------------------------------------- |
| id              | INT            | **PK**, AUTO_INCREMENT                                         |
| title           | VARCHAR(255)   | NOT NULL                                       |
| slug            | VARCHAR(255)   | NOT NULL, **UNIQUE**                           |
| description     | TEXT           | NOT NULL                                       |
| price           | DECIMAL(10,2)  | NOT NULL                                       |
| thumbnailUrl    | VARCHAR(500)   | NULL                                           |
| previewVideoUrl | VARCHAR(500)   | NULL                                           |
| level           | ENUM('BEGINNER','INTERMEDIATE','ADVANCED') | NOT NULL, DEFAULT 'BEGINNER' |
| language        | VARCHAR(50)    | NOT NULL, DEFAULT 'English'                    |
| requirements    | TEXT           | NULL                                           |
| targetAudience  | TEXT           | NULL                                           |
| isPublished     | BOOLEAN        | NOT NULL, DEFAULT FALSE                        |
| status          | ENUM('DRAFT','PENDING_REVIEW','APPROVED','REJECTED') | NOT NULL, DEFAULT 'DRAFT' |
| instructorId    | INT            | NOT NULL, **FK → User(id)** ON DELETE CASCADE  |
| categoryId      | INT            | NULL, **FK → Category(id)** ON DELETE SET NULL |
| createdAt       | DATETIME       | NOT NULL, DEFAULT NOW                          |
| updatedAt       | DATETIME       | NOT NULL, AUTO-UPDATE                          |

---

### Table 4 — Section

| Column      | Type         | Constraints                                  |
| ----------- | ------------ | -------------------------------------------- |
| id          | INT          | **PK**, AUTO_INCREMENT                                       |
| title       | VARCHAR(255) | NOT NULL                                     |
| position    | INT          | NOT NULL                                     |
| isPublished | BOOLEAN      | NOT NULL, DEFAULT FALSE                      |
| courseId     | INT          | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| createdAt   | DATETIME     | NOT NULL, DEFAULT NOW                        |
| updatedAt   | DATETIME     | NOT NULL, AUTO-UPDATE                        |

**Unique:** `(courseId, position)`

---

### Table 5 — Lecture

| Column        | Type         | Constraints                                    |
| ------------- | ------------ | ---------------------------------------------- |
| id            | INT          | **PK**, AUTO_INCREMENT                                         |
| title         | VARCHAR(255) | NOT NULL                                       |
| videoUrl      | VARCHAR(500) | NULL                                           |
| content       | TEXT         | NULL                                           |
| durationSec   | INT          | NULL                                           |
| position      | INT          | NOT NULL                                       |
| isPublished   | BOOLEAN      | NOT NULL, DEFAULT FALSE                        |
| isFreePreview | BOOLEAN      | NOT NULL, DEFAULT FALSE                        |
| sectionId     | INT          | NOT NULL, **FK → Section(id)** ON DELETE CASCADE |
| createdAt     | DATETIME     | NOT NULL, DEFAULT NOW                          |
| updatedAt     | DATETIME     | NOT NULL, AUTO-UPDATE                          |

**Unique:** `(sectionId, position)`

---

### Table 6 — Resource

| Column    | Type         | Constraints                                    |
| --------- | ------------ | ---------------------------------------------- |
| id        | INT          | **PK**, AUTO_INCREMENT                                         |
| title     | VARCHAR(255) | NOT NULL                                       |
| fileUrl   | VARCHAR(500) | NOT NULL                                       |
| fileType  | VARCHAR(100) | NOT NULL                                       |
| fileSize  | INT          | NULL                                           |
| lectureId | INT          | NOT NULL, **FK → Lecture(id)** ON DELETE CASCADE |
| createdAt | DATETIME     | NOT NULL, DEFAULT NOW                          |

---

### Table 7 — Enrollment

| Column      | Type        | Constraints                                  |
| ----------- | ----------- | -------------------------------------------- |
| id          | INT         | **PK**, AUTO_INCREMENT                                       |
| userId      | INT         | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| courseId     | INT         | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| progress    | INT         | NOT NULL, DEFAULT 0                          |
| enrolledAt  | DATETIME    | NOT NULL, DEFAULT NOW                        |
| completedAt | DATETIME    | NULL                                         |

**Unique:** `(userId, courseId)`

---

### Table 8 — LectureProgress

| Column     | Type        | Constraints                                    |
| ---------- | ----------- | ---------------------------------------------- |
| id         | INT         | **PK**, AUTO_INCREMENT                                         |
| userId     | INT         | NOT NULL, **FK → User(id)** ON DELETE CASCADE  |
| lectureId  | INT         | NOT NULL, **FK → Lecture(id)** ON DELETE CASCADE |
| completed  | BOOLEAN     | NOT NULL, DEFAULT FALSE                        |
| watchedSec | INT         | NOT NULL, DEFAULT 0                            |
| updatedAt  | DATETIME    | NOT NULL, AUTO-UPDATE                          |

**Unique:** `(userId, lectureId)`

---

### Table 9 — Review

| Column    | Type        | Constraints                                   |
| --------- | ----------- | --------------------------------------------- |
| id        | INT         | **PK**, AUTO_INCREMENT                                        |
| rating    | INT         | NOT NULL                                      |
| comment   | TEXT        | NULL                                          |
| userId    | INT         | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| courseId   | INT         | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| createdAt | DATETIME    | NOT NULL, DEFAULT NOW                         |
| updatedAt | DATETIME    | NOT NULL, AUTO-UPDATE                         |

**Unique:** `(userId, courseId)`

---

### Table 10 — Cart

| Column    | Type        | Constraints                                   |
| --------- | ----------- | --------------------------------------------- |
| id        | INT         | **PK**, AUTO_INCREMENT                                        |
| userId    | INT         | NOT NULL, **UNIQUE**, **FK → User(id)** ON DELETE CASCADE |
| updatedAt | DATETIME    | NOT NULL, AUTO-UPDATE                         |

---

### Table 11 — CartItem

| Column   | Type        | Constraints                                   |
| -------- | ----------- | --------------------------------------------- |
| id       | INT         | **PK**, AUTO_INCREMENT                                        |
| cartId   | INT         | NOT NULL, **FK → Cart(id)** ON DELETE CASCADE |
| courseId  | INT         | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| addedAt  | DATETIME    | NOT NULL, DEFAULT NOW                         |

**Unique:** `(cartId, courseId)`

---

### Table 12 — Order

> ⚠️ Table name backtick-quoted in SQL because `ORDER` is a reserved word.

| Column                | Type          | Constraints                                   |
| --------------------- | ------------- | --------------------------------------------- |
| id                    | INT           | **PK**, AUTO_INCREMENT                                        |
| userId                | INT           | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| totalAmount           | DECIMAL(10,2) | NOT NULL                                      |
| status                | ENUM('PENDING','COMPLETED','FAILED','REFUNDED') | NOT NULL, DEFAULT 'PENDING' |
| couponId              | INT           | NULL, **FK → Coupon(id)** ON DELETE SET NULL  |
| stripePaymentIntentId | VARCHAR(255)  | NULL                                          |
| createdAt             | DATETIME      | NOT NULL, DEFAULT NOW                         |
| updatedAt             | DATETIME      | NOT NULL, AUTO-UPDATE                         |

---

### Table 13 — OrderItem

| Column   | Type          | Constraints                                    |
| -------- | ------------- | ---------------------------------------------- |
| id       | INT           | **PK**, AUTO_INCREMENT                                         |
| orderId  | INT           | NOT NULL, **FK → Order(id)** ON DELETE CASCADE |
| courseId  | INT           | NOT NULL, **FK → Course(id)**                  |
| price    | DECIMAL(10,2) | NOT NULL                                       |

---

### Table 14 — Coupon

| Column          | Type         | Constraints                                    |
| --------------- | ------------ | ---------------------------------------------- |
| id              | INT          | **PK**, AUTO_INCREMENT                                         |
| code            | VARCHAR(100) | NOT NULL, **UNIQUE**                           |
| discountPercent | INT          | NOT NULL                                       |
| maxUses         | INT          | NULL                                           |
| currentUses     | INT          | NOT NULL, DEFAULT 0                            |
| courseId         | INT          | NULL, **FK → Course(id)** ON DELETE CASCADE    |
| expiresAt       | DATETIME     | NULL                                           |
| isActive        | BOOLEAN      | NOT NULL, DEFAULT TRUE                         |
| createdAt       | DATETIME     | NOT NULL, DEFAULT NOW                          |

---

### Table 15 — Quiz

| Column       | Type         | Constraints                                    |
| ------------ | ------------ | ---------------------------------------------- |
| id           | INT          | **PK**, AUTO_INCREMENT                                         |
| title        | VARCHAR(255) | NOT NULL                                       |
| description  | TEXT         | NULL                                           |
| courseId      | INT          | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| passingScore | INT          | NOT NULL, DEFAULT 70                           |
| createdAt    | DATETIME     | NOT NULL, DEFAULT NOW                          |
| updatedAt    | DATETIME     | NOT NULL, AUTO-UPDATE                          |

---

### Table 16 — QuizQuestion

| Column    | Type        | Constraints                                  |
| --------- | ----------- | -------------------------------------------- |
| id        | INT         | **PK**, AUTO_INCREMENT                                       |
| question  | TEXT        | NOT NULL                                     |
| type      | ENUM('MULTIPLE_CHOICE','TRUE_FALSE','SHORT_ANSWER') | NOT NULL, DEFAULT 'MULTIPLE_CHOICE' |
| points    | INT         | NOT NULL, DEFAULT 1                          |
| position  | INT         | NOT NULL                                     |
| quizId    | INT         | NOT NULL, **FK → Quiz(id)** ON DELETE CASCADE |
| createdAt | DATETIME    | NOT NULL, DEFAULT NOW                        |

---

### Table 17 — QuizOption

| Column     | Type         | Constraints                                          |
| ---------- | ------------ | ---------------------------------------------------- |
| id         | INT          | **PK**, AUTO_INCREMENT                                               |
| text       | VARCHAR(500) | NOT NULL                                             |
| isCorrect  | BOOLEAN      | NOT NULL, DEFAULT FALSE                              |
| questionId | INT          | NOT NULL, **FK → QuizQuestion(id)** ON DELETE CASCADE |

---

### Table 18 — QuizAttempt

| Column      | Type        | Constraints                                   |
| ----------- | ----------- | --------------------------------------------- |
| id          | INT         | **PK**, AUTO_INCREMENT                                        |
| userId      | INT         | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| quizId      | INT         | NOT NULL, **FK → Quiz(id)** ON DELETE CASCADE |
| score       | INT         | NOT NULL, DEFAULT 0                           |
| passed      | BOOLEAN     | NOT NULL, DEFAULT FALSE                       |
| completedAt | DATETIME    | NOT NULL, DEFAULT NOW                         |

---

### Table 19 — QuizAnswer

| Column     | Type        | Constraints                                          |
| ---------- | ----------- | ---------------------------------------------------- |
| id         | INT         | **PK**, AUTO_INCREMENT                                               |
| attemptId  | INT         | NOT NULL, **FK → QuizAttempt(id)** ON DELETE CASCADE |
| questionId | INT         | NOT NULL, **FK → QuizQuestion(id)** ON DELETE CASCADE |
| answer     | TEXT        | NOT NULL                                             |
| isCorrect  | BOOLEAN     | NOT NULL, DEFAULT FALSE                              |

---

### Table 20 — Assignment

| Column      | Type         | Constraints                                    |
| ----------- | ------------ | ---------------------------------------------- |
| id          | INT          | **PK**, AUTO_INCREMENT                                         |
| title       | VARCHAR(255) | NOT NULL                                       |
| description | TEXT         | NOT NULL                                       |
| courseId     | INT          | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| dueDate     | DATETIME     | NULL                                           |
| maxScore    | INT          | NOT NULL, DEFAULT 100                          |
| createdAt   | DATETIME     | NOT NULL, DEFAULT NOW                          |
| updatedAt   | DATETIME     | NOT NULL, AUTO-UPDATE                          |

---

### Table 21 — AssignmentSubmission

| Column       | Type         | Constraints                                        |
| ------------ | ------------ | -------------------------------------------------- |
| id           | INT          | **PK**, AUTO_INCREMENT                                             |
| assignmentId | INT          | NOT NULL, **FK → Assignment(id)** ON DELETE CASCADE |
| userId       | INT          | NOT NULL, **FK → User(id)** ON DELETE CASCADE      |
| content      | TEXT         | NOT NULL                                           |
| fileUrl      | VARCHAR(500) | NULL                                               |
| score        | INT          | NULL                                               |
| feedback     | TEXT         | NULL                                               |
| submittedAt  | DATETIME     | NOT NULL, DEFAULT NOW                              |
| gradedAt     | DATETIME     | NULL                                               |

**Unique:** `(assignmentId, userId)`

---

### Table 22 — Certificate

| Column         | Type         | Constraints                                   |
| -------------- | ------------ | --------------------------------------------- |
| id             | INT          | **PK**, AUTO_INCREMENT                                        |
| userId         | INT          | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| courseId        | INT          | NOT NULL                                      |
| certificateUrl | VARCHAR(500) | NULL                                          |
| issuedAt       | DATETIME     | NOT NULL, DEFAULT NOW                         |

**Unique:** `(userId, courseId)`

---

### Table 23 — Notification

| Column    | Type         | Constraints                                   |
| --------- | ------------ | --------------------------------------------- |
| id        | INT          | **PK**, AUTO_INCREMENT                                        |
| userId    | INT          | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| type      | ENUM('ENROLLMENT','COURSE_UPDATE','REVIEW','PAYMENT','SYSTEM','MESSAGE') | NOT NULL, DEFAULT 'SYSTEM' |
| title     | VARCHAR(255) | NOT NULL                                      |
| message   | TEXT         | NOT NULL                                      |
| isRead    | BOOLEAN      | NOT NULL, DEFAULT FALSE                       |
| link      | VARCHAR(500) | NULL                                          |
| createdAt | DATETIME     | NOT NULL, DEFAULT NOW                         |

---

### Table 24 — Message

| Column     | Type        | Constraints                                            |
| ---------- | ----------- | ------------------------------------------------------ |
| id         | INT         | **PK**, AUTO_INCREMENT                                                 |
| senderId   | INT         | NOT NULL, **FK → User(id)** ON DELETE CASCADE (sender) |
| receiverId | INT         | NOT NULL, **FK → User(id)** ON DELETE CASCADE (receiver) |
| content    | TEXT        | NOT NULL                                               |
| isRead     | BOOLEAN     | NOT NULL, DEFAULT FALSE                                |
| createdAt  | DATETIME    | NOT NULL, DEFAULT NOW                                  |

---

### Table 25 — SupportTicket

| Column    | Type         | Constraints                                   |
| --------- | ------------ | --------------------------------------------- |
| id        | INT          | **PK**, AUTO_INCREMENT                                        |
| userId    | INT          | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| subject   | VARCHAR(255) | NOT NULL                                      |
| status    | ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') | NOT NULL, DEFAULT 'OPEN' |
| priority  | ENUM('LOW','MEDIUM','HIGH','URGENT') | NOT NULL, DEFAULT 'MEDIUM' |
| createdAt | DATETIME     | NOT NULL, DEFAULT NOW                         |
| updatedAt | DATETIME     | NOT NULL, AUTO-UPDATE                         |

---

### Table 26 — TicketMessage

| Column    | Type        | Constraints                                            |
| --------- | ----------- | ------------------------------------------------------ |
| id        | INT         | **PK**, AUTO_INCREMENT                                                 |
| ticketId  | INT         | NOT NULL, **FK → SupportTicket(id)** ON DELETE CASCADE |
| userId    | INT         | NOT NULL, **FK → User(id)** ON DELETE CASCADE          |
| content   | TEXT        | NOT NULL                                               |
| createdAt | DATETIME    | NOT NULL, DEFAULT NOW                                  |

---

### Table 27 — FAQ

| Column      | Type         | Constraints                     |
| ----------- | ------------ | ------------------------------- |
| id          | INT          | **PK**, AUTO_INCREMENT                          |
| question    | VARCHAR(500) | NOT NULL                        |
| answer      | TEXT         | NOT NULL                        |
| category    | VARCHAR(100) | NOT NULL, DEFAULT 'General'     |
| position    | INT          | NOT NULL, DEFAULT 0             |
| isPublished | BOOLEAN      | NOT NULL, DEFAULT TRUE          |
| createdAt   | DATETIME     | NOT NULL, DEFAULT NOW           |
| updatedAt   | DATETIME     | NOT NULL, AUTO-UPDATE           |

---

### Table 28 — Wallet

| Column    | Type          | Constraints                                            |
| --------- | ------------- | ------------------------------------------------------ |
| id        | INT           | **PK**, AUTO_INCREMENT                                                 |
| userId    | INT           | NOT NULL, **UNIQUE**, **FK → User(id)** ON DELETE CASCADE |
| balance   | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00                                 |
| updatedAt | DATETIME      | NOT NULL, AUTO-UPDATE                                  |

---

### Table 29 — WalletTransaction

| Column      | Type          | Constraints                                    |
| ----------- | ------------- | ---------------------------------------------- |
| id          | INT           | **PK**, AUTO_INCREMENT                                         |
| walletId    | INT           | NOT NULL, **FK → Wallet(id)** ON DELETE CASCADE |
| amount      | DECIMAL(10,2) | NOT NULL                                       |
| type        | VARCHAR(50)   | NOT NULL                                       |
| description | VARCHAR(500)  | NULL                                           |
| createdAt   | DATETIME      | NOT NULL, DEFAULT NOW                          |

---

### Enums Used

| Enum Name          | Values                                                          |
| ------------------ | --------------------------------------------------------------- |
| **UserRole**       | STUDENT, INSTRUCTOR, ADMIN                                      |
| **CourseLevel**    | BEGINNER, INTERMEDIATE, ADVANCED                                |
| **CourseStatus**   | DRAFT, PENDING_REVIEW, APPROVED, REJECTED                       |
| **PaymentStatus**  | PENDING, COMPLETED, FAILED, REFUNDED                            |
| **TicketStatus**   | OPEN, IN_PROGRESS, RESOLVED, CLOSED                             |
| **TicketPriority** | LOW, MEDIUM, HIGH, URGENT                                       |
| **NotificationType** | ENROLLMENT, COURSE_UPDATE, REVIEW, PAYMENT, SYSTEM, MESSAGE  |
| **QuizQuestionType** | MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER                     |

---

### Column Count Summary

| Table                | Columns |
| -------------------- | :-----: |
| User                 | 19      |
| Category             | 6       |
| Course               | 17      |
| Section              | 7       |
| Lecture              | 11      |
| Resource             | 7       |
| Enrollment           | 6       |
| LectureProgress      | 6       |
| Review               | 7       |
| Cart                 | 3       |
| CartItem             | 4       |
| Order                | 8       |
| OrderItem            | 4       |
| Coupon               | 9       |
| Quiz                 | 7       |
| QuizQuestion         | 7       |
| QuizOption           | 4       |
| QuizAttempt          | 6       |
| QuizAnswer           | 5       |
| Assignment           | 8       |
| AssignmentSubmission | 9       |
| Certificate          | 5       |
| Notification         | 8       |
| Message              | 6       |
| SupportTicket        | 7       |
| TicketMessage        | 5       |
| FAQ                  | 7       |
| Wallet               | 4       |
| WalletTransaction    | 6       |
| **TOTAL**            | **201** |

---

### SQL CREATE TABLE Statements (Full DDL)

```sql
-- ============================================================================
-- Udemy Clone – Database Init Script
-- MySQL 8.x  •  All PKs are INT AUTO_INCREMENT
-- ============================================================================

CREATE DATABASE IF NOT EXISTS udemy_clone
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE udemy_clone;

-- ─── Users ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS User (
  id                     INT          NOT NULL AUTO_INCREMENT,
  email                  VARCHAR(255) NOT NULL,
  name                   VARCHAR(255) NOT NULL,
  password               VARCHAR(255) NOT NULL,
  role                   ENUM('STUDENT','INSTRUCTOR','ADMIN') NOT NULL DEFAULT 'STUDENT',
  phone                  VARCHAR(50)  NULL,
  bio                    TEXT         NULL,
  avatarUrl              VARCHAR(500) NULL,
  emailVerified          BOOLEAN      NOT NULL DEFAULT FALSE,
  emailVerificationToken VARCHAR(255) NULL,
  passwordResetToken     VARCHAR(255) NULL,
  passwordResetExpires   DATETIME     NULL,
  twoFactorEnabled       BOOLEAN      NOT NULL DEFAULT FALSE,
  twoFactorSecret        VARCHAR(255) NULL,
  isApprovedInstructor   BOOLEAN      NOT NULL DEFAULT FALSE,
  locale                 VARCHAR(10)  NOT NULL DEFAULT 'en',
  currency               VARCHAR(10)  NOT NULL DEFAULT 'USD',
  createdAt              DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt              DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_email (email)
) ENGINE=InnoDB;

-- ─── Categories ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Category (
  id        INT          NOT NULL AUTO_INCREMENT,
  name      VARCHAR(255) NOT NULL,
  slug      VARCHAR(255) NOT NULL,
  parentId  INT          NULL,
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_category_name (name),
  UNIQUE KEY uk_category_slug (slug),
  KEY idx_category_parent (parentId),
  CONSTRAINT fk_category_parent FOREIGN KEY (parentId)
    REFERENCES Category(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Courses ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Course (
  id              INT            NOT NULL AUTO_INCREMENT,
  title           VARCHAR(255)   NOT NULL,
  slug            VARCHAR(255)   NOT NULL,
  description     TEXT           NOT NULL,
  price           DECIMAL(10,2)  NOT NULL,
  thumbnailUrl    VARCHAR(500)   NULL,
  previewVideoUrl VARCHAR(500)   NULL,
  level           ENUM('BEGINNER','INTERMEDIATE','ADVANCED') NOT NULL DEFAULT 'BEGINNER',
  language        VARCHAR(50)    NOT NULL DEFAULT 'English',
  requirements    TEXT           NULL,
  targetAudience  TEXT           NULL,
  isPublished     BOOLEAN        NOT NULL DEFAULT FALSE,
  status          ENUM('DRAFT','PENDING_REVIEW','APPROVED','REJECTED') NOT NULL DEFAULT 'DRAFT',
  instructorId    INT            NOT NULL,
  categoryId      INT            NULL,
  createdAt       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_course_slug (slug),
  KEY idx_course_instructor (instructorId),
  KEY idx_course_category (categoryId),
  CONSTRAINT fk_course_instructor FOREIGN KEY (instructorId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_course_category FOREIGN KEY (categoryId)
    REFERENCES Category(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Sections ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Section (
  id          INT          NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255) NOT NULL,
  position    INT          NOT NULL,
  isPublished BOOLEAN      NOT NULL DEFAULT FALSE,
  courseId     INT          NOT NULL,
  createdAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_section_course_pos (courseId, position),
  CONSTRAINT fk_section_course FOREIGN KEY (courseId)
    REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Lectures ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Lecture (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  videoUrl      VARCHAR(500) NULL,
  content       TEXT         NULL,
  durationSec   INT          NULL,
  position      INT          NOT NULL,
  isPublished   BOOLEAN      NOT NULL DEFAULT FALSE,
  isFreePreview BOOLEAN      NOT NULL DEFAULT FALSE,
  sectionId     INT          NOT NULL,
  createdAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_lecture_section_pos (sectionId, position),
  CONSTRAINT fk_lecture_section FOREIGN KEY (sectionId)
    REFERENCES Section(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Resources ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Resource (
  id        INT          NOT NULL AUTO_INCREMENT,
  title     VARCHAR(255) NOT NULL,
  fileUrl   VARCHAR(500) NOT NULL,
  fileType  VARCHAR(100) NOT NULL,
  fileSize  INT          NULL,
  lectureId INT          NOT NULL,
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_resource_lecture (lectureId),
  CONSTRAINT fk_resource_lecture FOREIGN KEY (lectureId)
    REFERENCES Lecture(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Enrollments ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Enrollment (
  id          INT         NOT NULL AUTO_INCREMENT,
  userId      INT         NOT NULL,
  courseId     INT         NOT NULL,
  progress    INT         NOT NULL DEFAULT 0,
  enrolledAt  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completedAt DATETIME    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_enrollment_user_course (userId, courseId),
  KEY idx_enrollment_course (courseId),
  CONSTRAINT fk_enrollment_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_enrollment_course FOREIGN KEY (courseId)
    REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Lecture Progress ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS LectureProgress (
  id         INT         NOT NULL AUTO_INCREMENT,
  userId     INT         NOT NULL,
  lectureId  INT         NOT NULL,
  completed  BOOLEAN     NOT NULL DEFAULT FALSE,
  watchedSec INT         NOT NULL DEFAULT 0,
  updatedAt  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_progress_user_lecture (userId, lectureId),
  KEY idx_progress_lecture (lectureId),
  CONSTRAINT fk_progress_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_progress_lecture FOREIGN KEY (lectureId)
    REFERENCES Lecture(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Reviews ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Review (
  id        INT         NOT NULL AUTO_INCREMENT,
  rating    INT         NOT NULL,
  comment   TEXT        NULL,
  userId    INT         NOT NULL,
  courseId   INT         NOT NULL,
  createdAt DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_review_user_course (userId, courseId),
  KEY idx_review_course (courseId),
  CONSTRAINT fk_review_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_review_course FOREIGN KEY (courseId)
    REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Cart ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Cart (
  id        INT         NOT NULL AUTO_INCREMENT,
  userId    INT         NOT NULL,
  updatedAt DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cart_user (userId),
  CONSTRAINT fk_cart_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS CartItem (
  id       INT         NOT NULL AUTO_INCREMENT,
  cartId   INT         NOT NULL,
  courseId  INT         NOT NULL,
  addedAt  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cartitem_cart_course (cartId, courseId),
  KEY idx_cartitem_course (courseId),
  CONSTRAINT fk_cartitem_cart FOREIGN KEY (cartId)
    REFERENCES Cart(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cartitem_course FOREIGN KEY (courseId)
    REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Orders ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `Order` (
  id                    INT           NOT NULL AUTO_INCREMENT,
  userId                INT           NOT NULL,
  totalAmount           DECIMAL(10,2) NOT NULL,
  status                ENUM('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  couponId              INT           NULL,
  stripePaymentIntentId VARCHAR(255)  NULL,
  createdAt             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_user (userId),
  KEY idx_order_coupon (couponId),
  CONSTRAINT fk_order_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Coupon (
  id              INT          NOT NULL AUTO_INCREMENT,
  code            VARCHAR(100) NOT NULL,
  discountPercent INT          NOT NULL,
  maxUses         INT          NULL,
  currentUses     INT          NOT NULL DEFAULT 0,
  courseId         INT          NULL,
  expiresAt       DATETIME     NULL,
  isActive        BOOLEAN      NOT NULL DEFAULT TRUE,
  createdAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_coupon_code (code),
  KEY idx_coupon_course (courseId),
  CONSTRAINT fk_coupon_course FOREIGN KEY (courseId)
    REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Add coupon FK to Order (deferred because Coupon may not exist yet)
ALTER TABLE `Order`
  ADD CONSTRAINT fk_order_coupon FOREIGN KEY (couponId)
    REFERENCES Coupon(id) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS OrderItem (
  id       INT           NOT NULL AUTO_INCREMENT,
  orderId  INT           NOT NULL,
  courseId  INT           NOT NULL,
  price    DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_orderitem_order (orderId),
  KEY idx_orderitem_course (courseId),
  CONSTRAINT fk_orderitem_order FOREIGN KEY (orderId)
    REFERENCES `Order`(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_orderitem_course FOREIGN KEY (courseId)
    REFERENCES Course(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Quizzes ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Quiz (
  id           INT          NOT NULL AUTO_INCREMENT,
  title        VARCHAR(255) NOT NULL,
  description  TEXT         NULL,
  courseId      INT          NOT NULL,
  passingScore INT          NOT NULL DEFAULT 70,
  createdAt    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_quiz_course (courseId),
  CONSTRAINT fk_quiz_course FOREIGN KEY (courseId)
    REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS QuizQuestion (
  id        INT         NOT NULL AUTO_INCREMENT,
  question  TEXT        NOT NULL,
  type      ENUM('MULTIPLE_CHOICE','TRUE_FALSE','SHORT_ANSWER') NOT NULL DEFAULT 'MULTIPLE_CHOICE',
  points    INT         NOT NULL DEFAULT 1,
  position  INT         NOT NULL,
  quizId    INT         NOT NULL,
  createdAt DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_quizquestion_quiz (quizId),
  CONSTRAINT fk_quizquestion_quiz FOREIGN KEY (quizId)
    REFERENCES Quiz(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS QuizOption (
  id         INT          NOT NULL AUTO_INCREMENT,
  text       VARCHAR(500) NOT NULL,
  isCorrect  BOOLEAN      NOT NULL DEFAULT FALSE,
  questionId INT          NOT NULL,
  PRIMARY KEY (id),
  KEY idx_quizoption_question (questionId),
  CONSTRAINT fk_quizoption_question FOREIGN KEY (questionId)
    REFERENCES QuizQuestion(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS QuizAttempt (
  id          INT         NOT NULL AUTO_INCREMENT,
  userId      INT         NOT NULL,
  quizId      INT         NOT NULL,
  score       INT         NOT NULL DEFAULT 0,
  passed      BOOLEAN     NOT NULL DEFAULT FALSE,
  completedAt DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_quizattempt_user (userId),
  KEY idx_quizattempt_quiz (quizId),
  CONSTRAINT fk_quizattempt_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_quizattempt_quiz FOREIGN KEY (quizId)
    REFERENCES Quiz(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS QuizAnswer (
  id         INT         NOT NULL AUTO_INCREMENT,
  attemptId  INT         NOT NULL,
  questionId INT         NOT NULL,
  answer     TEXT        NOT NULL,
  isCorrect  BOOLEAN     NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  KEY idx_quizanswer_attempt (attemptId),
  KEY idx_quizanswer_question (questionId),
  CONSTRAINT fk_quizanswer_attempt FOREIGN KEY (attemptId)
    REFERENCES QuizAttempt(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_quizanswer_question FOREIGN KEY (questionId)
    REFERENCES QuizQuestion(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Assignments ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Assignment (
  id          INT          NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255) NOT NULL,
  description TEXT         NOT NULL,
  courseId     INT          NOT NULL,
  dueDate     DATETIME     NULL,
  maxScore    INT          NOT NULL DEFAULT 100,
  createdAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_assignment_course (courseId),
  CONSTRAINT fk_assignment_course FOREIGN KEY (courseId)
    REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS AssignmentSubmission (
  id           INT         NOT NULL AUTO_INCREMENT,
  assignmentId INT         NOT NULL,
  userId       INT         NOT NULL,
  content      TEXT        NOT NULL,
  fileUrl      VARCHAR(500) NULL,
  score        INT         NULL,
  feedback     TEXT        NULL,
  submittedAt  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  gradedAt     DATETIME    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_submission_assignment_user (assignmentId, userId),
  KEY idx_submission_user (userId),
  CONSTRAINT fk_submission_assignment FOREIGN KEY (assignmentId)
    REFERENCES Assignment(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_submission_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Certificates ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Certificate (
  id             INT          NOT NULL AUTO_INCREMENT,
  userId         INT          NOT NULL,
  courseId        INT          NOT NULL,
  certificateUrl VARCHAR(500) NULL,
  issuedAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_certificate_user_course (userId, courseId),
  KEY idx_certificate_course (courseId),
  CONSTRAINT fk_certificate_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Notifications ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Notification (
  id        INT          NOT NULL AUTO_INCREMENT,
  userId    INT          NOT NULL,
  type      ENUM('ENROLLMENT','COURSE_UPDATE','REVIEW','PAYMENT','SYSTEM','MESSAGE') NOT NULL DEFAULT 'SYSTEM',
  title     VARCHAR(255) NOT NULL,
  message   TEXT         NOT NULL,
  isRead    BOOLEAN      NOT NULL DEFAULT FALSE,
  link      VARCHAR(500) NULL,
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notification_user (userId),
  CONSTRAINT fk_notification_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Messages ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Message (
  id         INT         NOT NULL AUTO_INCREMENT,
  senderId   INT         NOT NULL,
  receiverId INT         NOT NULL,
  content    TEXT        NOT NULL,
  isRead     BOOLEAN     NOT NULL DEFAULT FALSE,
  createdAt  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_message_sender (senderId),
  KEY idx_message_receiver (receiverId),
  CONSTRAINT fk_message_sender FOREIGN KEY (senderId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_message_receiver FOREIGN KEY (receiverId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Support Tickets ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS SupportTicket (
  id        INT          NOT NULL AUTO_INCREMENT,
  userId    INT          NOT NULL,
  subject   VARCHAR(255) NOT NULL,
  status    ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
  priority  ENUM('LOW','MEDIUM','HIGH','URGENT')           NOT NULL DEFAULT 'MEDIUM',
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_user (userId),
  CONSTRAINT fk_ticket_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS TicketMessage (
  id        INT         NOT NULL AUTO_INCREMENT,
  ticketId  INT         NOT NULL,
  userId    INT         NOT NULL,
  content   TEXT        NOT NULL,
  createdAt DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticketmsg_ticket (ticketId),
  KEY idx_ticketmsg_user (userId),
  CONSTRAINT fk_ticketmsg_ticket FOREIGN KEY (ticketId)
    REFERENCES SupportTicket(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ticketmsg_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── FAQ ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS FAQ (
  id          INT          NOT NULL AUTO_INCREMENT,
  question    VARCHAR(500) NOT NULL,
  answer      TEXT         NOT NULL,
  category    VARCHAR(100) NOT NULL DEFAULT 'General',
  position    INT          NOT NULL DEFAULT 0,
  isPublished BOOLEAN      NOT NULL DEFAULT TRUE,
  createdAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ─── Wallet ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Wallet (
  id        INT           NOT NULL AUTO_INCREMENT,
  userId    INT           NOT NULL,
  balance   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  updatedAt DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_wallet_user (userId),
  CONSTRAINT fk_wallet_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS WalletTransaction (
  id          INT           NOT NULL AUTO_INCREMENT,
  walletId    INT           NOT NULL,
  amount      DECIMAL(10,2) NOT NULL,
  type        VARCHAR(50)   NOT NULL,
  description VARCHAR(500)  NULL,
  createdAt   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_wallettx_wallet (walletId),
  CONSTRAINT fk_wallettx_wallet FOREIGN KEY (walletId)
    REFERENCES Wallet(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
```

---

## 11. State Diagrams

### 11.1 User Role State

```
  ┌──────────┐
  │ STUDENT  │  ← Default on registration
  └────┬─────┘
       │ Request instructor access
       ▼
  ┌──────────────────┐
  │ STUDENT          │  (isApprovedInstructor = false)
  │ (pending review) │
  └────┬─────────────┘
       │ Admin approves (PATCH /api/admin/users/:id/approve-instructor)
       ▼
  ┌──────────────┐
  │ INSTRUCTOR   │  (role = INSTRUCTOR, isApprovedInstructor = true)
  └──────────────┘

  ┌──────────┐
  │  ADMIN   │  ← Set by another Admin (PATCH /api/admin/users/:id/role)
  └──────────┘

  Any role ──► [BANNED]  (Admin bans user via PATCH /api/admin/users/:id/ban)
```

### 11.2 Course Status State

```
  ┌─────────┐
  │  DRAFT  │  ← Default on creation (POST /api/courses)
  └────┬────┘
       │ Instructor edits title, description, sections, lectures...
       │ Instructor publishes (PATCH /api/courses/:id/publish)
       ▼
  ┌────────────────┐
  │ PENDING_REVIEW │  (isPublished = false, awaiting admin)
  └───┬────────┬───┘
      │        │
      │        │ Admin rejects (PATCH /api/admin/courses/:id/reject)
      │        ▼
      │   ┌──────────┐
      │   │ REJECTED │ ──► Instructor can edit & re-publish ──► PENDING_REVIEW
      │   └──────────┘
      │
      │ Admin approves (PATCH /api/admin/courses/:id/approve)
      ▼
  ┌──────────┐
  │ APPROVED │  (isPublished = true, visible to students)
  └──────────┘
```

### 11.3 Order / Payment Status State

```
  ┌─────────┐
  │ PENDING │  ← Created at checkout (POST /api/orders/checkout)
  └────┬────┘
       │
       ├──── Payment succeeds ────► ┌───────────┐
       │                            │ COMPLETED │  (Enrollments created, wallet credited)
       │                            └─────┬─────┘
       │                                  │
       │                                  │ Student requests refund
       │                                  │ (POST /api/orders/:id/refund)
       │                                  ▼
       │                            ┌──────────┐
       │                            │ REFUNDED │
       │                            └──────────┘
       │
       └──── Payment fails ─────► ┌────────┐
                                  │ FAILED │
                                  └────────┘
```

### 11.4 Enrollment & Progress State

```
  Student purchases course
       │
       ▼
  ┌────────────┐
  │  ENROLLED  │  progress = 0%, completedAt = NULL
  └─────┬──────┘
        │ Student watches lectures
        │ (PATCH /api/progress/lecture/:lectureId)
        ▼
  ┌─────────────┐
  │ IN PROGRESS │  progress = 1–99%
  └─────┬───────┘
        │ All lectures completed
        │ (progress recalculated to 100%)
        ▼
  ┌───────────┐
  │ COMPLETED │  progress = 100%, completedAt = NOW
  └─────┬─────┘
        │ Can now generate certificate
        │ (POST /api/certificates/generate/:courseId)
        ▼
  ┌─────────────┐
  │ CERTIFIED   │  Certificate record created
  └─────────────┘
```

### 11.5 Support Ticket Status State

```
  ┌──────┐
  │ OPEN │  ← Created by user (POST /api/support/tickets)
  └──┬───┘
     │ Admin starts working on it
     │ (PATCH /api/support/tickets/:id/status)
     ▼
  ┌─────────────┐
  │ IN_PROGRESS │
  └──┬──────┬───┘
     │      │
     │      │ Admin resolves
     │      ▼
     │  ┌──────────┐
     │  │ RESOLVED │
     │  └────┬─────┘
     │       │ User or admin closes
     │       ▼
     │  ┌────────┐
     ├─►│ CLOSED │  ← Can also close directly from OPEN or IN_PROGRESS
        └────────┘
```

### 11.6 Quiz Attempt State

```
  Student opens quiz
       │
       ▼
  ┌───────────────┐
  │ TAKING QUIZ   │  Student selects answers
  └──────┬────────┘
         │ Submit (POST /api/quizzes/:id/submit)
         │ Auto-graded: score calculated from correct answers
         ▼
    ┌────┴─────┐
    │          │
    ▼          ▼
  ┌────────┐  ┌────────┐
  │ PASSED │  │ FAILED │  (score >= passingScore → PASSED, else FAILED)
  └────────┘  └────┬───┘
                   │ Student can re-attempt
                   └──► TAKING QUIZ
```

### 11.7 Assignment Submission State

```
  Instructor creates assignment
       │
       ▼
  ┌──────────────────┐
  │ AWAITING         │  No submission yet
  │ SUBMISSION       │
  └──────┬───────────┘
         │ Student submits (POST /api/assignments/:id/submit)
         ▼
  ┌──────────────────┐
  │ SUBMITTED        │  content + optional fileUrl, score = NULL
  └──────┬───────────┘
         │ Instructor grades
         │ (PATCH /api/assignments/submissions/:submissionId/grade)
         ▼
  ┌──────────────────┐
  │ GRADED           │  score + feedback assigned, gradedAt = NOW
  └──────────────────┘

  Note: Student can re-submit (upsert), overwriting previous submission
```

### 11.8 Cart → Order Lifecycle

```
  ┌────────────┐
  │ EMPTY CART │  ← User starts with no cart (created on first add)
  └─────┬──────┘
        │ Add course (POST /api/cart/:courseId)
        ▼
  ┌────────────────┐
  │ CART WITH      │  ← Can add/remove items
  │ ITEMS          │    (DELETE /api/cart/:courseId)
  └──────┬─────────┘
         │ Checkout (POST /api/orders/checkout)
         │
         ├──► Validate cart items (not already enrolled)
         ├──► Apply coupon discount (optional)
         ├──► Create Order + OrderItems
         ├──► Create Enrollment for each course
         ├──► Credit instructor Wallet (70%)
         ├──► Create WalletTransaction records
         ├──► Send notification to student
         ▼
  ┌────────────┐
  │ CART       │  (cleared after checkout)
  │ CLEARED    │
  └────────────┘
         │
         ▼
  ┌─────────────────┐
  │ ORDER COMPLETED │  Student can now access courses
  └─────────────────┘
```

### 11.9 Notification Lifecycle

```
  Event triggers notification
  (enrollment, payment, message, review, system)
       │
       ▼
  ┌──────────┐
  │  UNREAD  │  isRead = false
  └────┬─────┘
       │ User views / marks as read
       │ (PATCH /api/notifications/:id/read)
       │ or mark all (PATCH /api/notifications/read-all)
       ▼
  ┌──────────┐
  │   READ   │  isRead = true
  └────┬─────┘
       │ User deletes
       │ (DELETE /api/notifications/:id)
       ▼
  ┌──────────┐
  │ DELETED  │  Removed from DB
  └──────────┘
```

### 11.10 Message State

```
  Sender composes message
       │
       ▼
  ┌──────────────┐
  │    SENT      │  isRead = false
  │   (UNREAD)   │  + Notification created for receiver
  └──────┬───────┘
         │ Receiver opens thread
         │ (GET /api/messages/:partnerId)
         ▼
  ┌──────────────┐
  │    READ      │  isRead = true (auto-marked on thread view)
  └──────────────┘
```

### State Summary

| Entity         | States                                             | Stored In         |
| -------------- | -------------------------------------------------- | ----------------- |
| User Role      | STUDENT → INSTRUCTOR → ADMIN / BANNED              | `User.role`       |
| Course         | DRAFT → PENDING_REVIEW → APPROVED / REJECTED       | `Course.status`   |
| Order          | PENDING → COMPLETED / FAILED → REFUNDED            | `Order.status`    |
| Enrollment     | ENROLLED → IN PROGRESS → COMPLETED → CERTIFIED     | `Enrollment.progress` + `Certificate` |
| Support Ticket | OPEN → IN_PROGRESS → RESOLVED → CLOSED             | `SupportTicket.status` |
| Quiz Attempt   | TAKING → PASSED / FAILED (can retry)               | `QuizAttempt.passed` |
| Assignment     | AWAITING → SUBMITTED → GRADED                      | `AssignmentSubmission.score` |
| Cart           | EMPTY → HAS ITEMS → CLEARED (after checkout)       | `Cart` + `CartItem` |
| Notification   | UNREAD → READ → DELETED                            | `Notification.isRead` |
| Message        | SENT (UNREAD) → READ                               | `Message.isRead`  |

---

> **Total: 29 database tables (201 columns), 8 enums, 20 backend modules, 27 frontend routes, 3 user roles, 10 state machines**



Field	Value
Email	admin@gmail.com
Password	admin123
Role	ADMIN
User ID	4