export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type CourseType = 'free' | 'paid';
export type CourseMode = 'Online Video & Practical' | 'Interactive Workshop' | 'Self-Paced Masterclass' | 'Hybrid Studio Training';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  courseCount?: number;
  order: number;
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl?: string; // e.g. embed link or video sample
  content?: string; // Rich text / reading material
  duration: string; // e.g. "18 mins"
  order: number;
  isPreview?: boolean;
  resources?: { title: string; url: string; type: 'pdf' | 'doc' | 'link' }[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  type: QuestionType;
  options?: string[]; // for multiple choice
  correctAnswer: string | number; // string for short/TF or index for MC
  explanation?: string;
  marks: number;
}

export interface CourseQuiz {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  passingPercentage: number;
  maxAttempts?: number;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  level: CourseLevel;
  type: CourseType;
  price: number;
  discountPrice?: number;
  duration: string; // e.g. "6 Weeks (48 Hours)"
  totalLessons: number;
  image: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  mode: CourseMode;
  requirements: string[];
  learningOutcomes: string[];
  whoIsThisFor: string[];
  certificateAvailable: boolean;
  status: 'published' | 'draft' | 'archived';
  isBestseller?: boolean;
  rating: number;
  studentsCount: number;
  faqs: { question: string; answer: string }[];
  seoTitle?: string;
  seoDescription?: string;
  courseCode: string; // e.g. "AKC-FD-01"
  createdAt: string;
  updatedAt: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  paymentStatus: 'free' | 'paid' | 'pending';
  amountPaid?: number;
  transactionId?: string;
  paymentMethod?: string;
  enrollmentDate: string;
  completedLessons: string[]; // lesson IDs
  progress: number; // 0 to 100 percentage
  completionStatus: 'in_progress' | 'completed';
  quizAttempts: {
    quizId: string;
    score: number;
    passed: boolean;
    attemptDate: string;
  }[];
  certificateId?: string;
}

export interface IssuedCertificate {
  id: string;
  certificateId: string; // e.g. AKC-FD-2026-08492
  studentId: string;
  courseId: string;
  studentName: string;
  courseName: string;
  courseCode: string;
  courseDuration: string;
  completionDate: string;
  issueDate: string;
  status: 'valid' | 'revoked';
  verificationUrl: string;
  instructorName: string;
  instructorSignatureText?: string;
}

export interface AcademySettings {
  instituteName: string;
  tagline: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  websiteUrl: string;
  certificateSignature: string;
  certificatePrefix: string;
  certificateVerificationUrl: string;
}
