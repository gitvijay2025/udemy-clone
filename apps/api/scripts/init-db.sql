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

-- ─── Password Resets ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS password_resets (
  id        INT          NOT NULL AUTO_INCREMENT,
  userId    INT          NOT NULL,
  token     VARCHAR(255) NOT NULL,
  expiresAt DATETIME     NOT NULL,
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_token (token),
  KEY idx_userId (userId),
  CONSTRAINT fk_password_resets_user FOREIGN KEY (userId)
    REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
