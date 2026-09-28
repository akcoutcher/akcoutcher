import {
  Course,
  CourseCategory,
  CourseModule,
  CourseQuiz,
  StudentUser,
  CourseEnrollment,
  IssuedCertificate,
  AcademySettings,
} from '../types/courses';
import {
  INITIAL_COURSE_CATEGORIES,
  INITIAL_COURSES,
  INITIAL_MODULES,
  INITIAL_QUIZZES,
  DEFAULT_ACADEMY_SETTINGS,
} from '../data/coursesData';

const STORAGE_KEYS = {
  COURSES: 'akc_courses_v1',
  CATEGORIES: 'akc_course_categories_v1',
  MODULES: 'akc_course_modules_v1',
  QUIZZES: 'akc_course_quizzes_v1',
  STUDENTS: 'akc_students_v1',
  ENROLLMENTS: 'akc_course_enrollments_v1',
  CERTIFICATES: 'akc_certificates_v1',
  CURRENT_STUDENT: 'akc_current_student_session_v1',
  ACADEMY_SETTINGS: 'akc_academy_settings_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// ----------------------------------------------------------------------
// ACADEMY SETTINGS
// ----------------------------------------------------------------------
export function getAcademySettings(): AcademySettings {
  return readStorage<AcademySettings>(STORAGE_KEYS.ACADEMY_SETTINGS, DEFAULT_ACADEMY_SETTINGS);
}

export function updateAcademySettings(settings: Partial<AcademySettings>): AcademySettings {
  const current = getAcademySettings();
  const updated = { ...current, ...settings };
  writeStorage(STORAGE_KEYS.ACADEMY_SETTINGS, updated);
  return updated;
}

// ----------------------------------------------------------------------
// CATEGORIES
// ----------------------------------------------------------------------
export function getCourseCategories(): CourseCategory[] {
  return readStorage<CourseCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_COURSE_CATEGORIES);
}

export function saveCourseCategory(category: Omit<CourseCategory, 'id'> & { id?: string }): CourseCategory {
  const categories = getCourseCategories();
  if (category.id) {
    const updated = categories.map((c) => (c.id === category.id ? { ...c, ...category } : c));
    writeStorage(STORAGE_KEYS.CATEGORIES, updated);
    return category as CourseCategory;
  } else {
    const newCat: CourseCategory = {
      ...category,
      id: `cat-${Date.now()}`,
      order: categories.length + 1,
    };
    writeStorage(STORAGE_KEYS.CATEGORIES, [...categories, newCat]);
    return newCat;
  }
}

export function deleteCourseCategory(id: string): void {
  const categories = getCourseCategories().filter((c) => c.id !== id);
  writeStorage(STORAGE_KEYS.CATEGORIES, categories);
}

// ----------------------------------------------------------------------
// COURSES
// ----------------------------------------------------------------------
export function getCourses(): Course[] {
  const courses = readStorage<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  // Ensure we always return at least the initial courses if empty
  if (!courses || courses.length === 0) {
    writeStorage(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    return INITIAL_COURSES;
  }
  return courses;
}

export function getCourseBySlug(slug: string): Course | null {
  const courses = getCourses();
  return courses.find((c) => c.slug === slug || c.id === slug) || null;
}

export function saveCourse(courseData: Partial<Course> & { id?: string; title: string }): Course {
  const courses = getCourses();
  const now = new Date().toISOString();

  if (courseData.id) {
    let found = false;
    const updated = courses.map((c) => {
      if (c.id === courseData.id) {
        found = true;
        return { ...c, ...courseData, updatedAt: now } as Course;
      }
      return c;
    });
    if (found) {
      writeStorage(STORAGE_KEYS.COURSES, updated);
      return updated.find((c) => c.id === courseData.id)!;
    }
  }

  // Create new course
  const newSlug = courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newCourse: Course = {
    id: `course-${Date.now()}`,
    title: courseData.title,
    slug: newSlug,
    courseCode: courseData.courseCode || `AKC-FD-${Math.floor(100 + Math.random() * 900)}`,
    description: courseData.description || '',
    shortDescription: courseData.shortDescription || '',
    category: courseData.category || 'Fashion Designing',
    level: courseData.level || 'Beginner',
    type: courseData.type || 'paid',
    price: courseData.price || 0,
    discountPrice: courseData.discountPrice,
    duration: courseData.duration || '4 Weeks',
    totalLessons: courseData.totalLessons || 10,
    image: courseData.image || '/src/assets/images/punjabi_couture_hero_1790501175200.jpg',
    instructor: courseData.instructor || {
      name: 'Anmol Kaur',
      role: 'Creative Director & Master Couturier',
      avatar: '/src/assets/images/punjabi_designer_portrait_1790501188325.jpg',
      bio: 'Master Couturier at AK Coutcher Atelier.',
    },
    mode: courseData.mode || 'Online Video & Practical',
    requirements: courseData.requirements || ['Passion for fashion'],
    learningOutcomes: courseData.learningOutcomes || ['Master core garment designing'],
    whoIsThisFor: courseData.whoIsThisFor || ['Aspiring fashion designers'],
    certificateAvailable: courseData.certificateAvailable ?? true,
    status: courseData.status || 'published',
    isBestseller: courseData.isBestseller || false,
    rating: courseData.rating || 5.0,
    studentsCount: courseData.studentsCount || 0,
    faqs: courseData.faqs || [],
    createdAt: now,
    updatedAt: now,
  };

  writeStorage(STORAGE_KEYS.COURSES, [newCourse, ...courses]);
  return newCourse;
}

export function deleteCourse(id: string): void {
  const courses = getCourses().filter((c) => c.id !== id);
  writeStorage(STORAGE_KEYS.COURSES, courses);
}

// ----------------------------------------------------------------------
// MODULES & LESSONS
// ----------------------------------------------------------------------
export function getCourseModules(courseId: string): CourseModule[] {
  const allModules = readStorage<CourseModule[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES);
  const courseMods = allModules.filter((m) => m.courseId === courseId);
  if (courseMods.length > 0) {
    return courseMods.sort((a, b) => a.order - b.order);
  }

  // If no modules specifically exist for this course, generate default preview modules
  const defaultFallbackModules: CourseModule[] = [
    {
      id: `mod-${courseId}-1`,
      courseId,
      title: 'Module 1: Foundations & Atelier Overview',
      description: 'Orientation to tools, silhouette anatomy, and course objectives.',
      order: 1,
      lessons: [
        {
          id: `les-${courseId}-1`,
          moduleId: `mod-${courseId}-1`,
          title: 'Lesson 1: Course Introduction & Orientation',
          description: 'An overview of what we will build and master throughout this syllabus.',
          duration: '15 mins',
          order: 1,
          isPreview: true,
          content: 'Welcome to this masterclass by Anmol Kaur at AK Coutcher. Follow through every lesson methodically.',
        },
        {
          id: `les-${courseId}-2`,
          moduleId: `mod-${courseId}-1`,
          title: 'Lesson 2: Core Equipment & Essential Measurements',
          description: 'Tools of the trade: scissors, French curves, tracing wheels, and measurement charts.',
          duration: '20 mins',
          order: 2,
          content: 'Understanding how precision tools directly translate to error-free bespoke luxury fittings.',
        },
      ],
    },
    {
      id: `mod-${courseId}-2`,
      courseId,
      title: 'Module 2: Practical Studio Techniques',
      description: 'Hands-on drafting, cutting, and structural assembly.',
      order: 2,
      lessons: [
        {
          id: `les-${courseId}-3`,
          moduleId: `mod-${courseId}-2`,
          title: 'Lesson 3: Drafting Patterns & Sloper Engineering',
          description: 'Constructing the blueprint patterns with balanced grainlines.',
          duration: '35 mins',
          order: 1,
          content: 'Step-by-step master draft walkthrough with Anmol Kaur.',
        },
        {
          id: `les-${courseId}-4`,
          moduleId: `mod-${courseId}-2`,
          title: 'Lesson 4: Couture Assembly & Artisan Finishes',
          description: 'Hemming, neck facing, concealed zippers, and lining insertion.',
          duration: '40 mins',
          order: 2,
          content: 'Final assembly techniques utilized for royal Punjabi bridal garments.',
        },
      ],
    },
  ];

  return defaultFallbackModules;
}

export function saveCourseModule(module: Omit<CourseModule, 'id'> & { id?: string }): CourseModule {
  const allModules = readStorage<CourseModule[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES);
  if (module.id) {
    const updated = allModules.map((m) => (m.id === module.id ? { ...m, ...module } : m));
    writeStorage(STORAGE_KEYS.MODULES, updated);
    return module as CourseModule;
  } else {
    const newMod: CourseModule = {
      ...module,
      id: `mod-${Date.now()}`,
      order: module.order || allModules.filter((m) => m.courseId === module.courseId).length + 1,
      lessons: module.lessons || [],
    };
    writeStorage(STORAGE_KEYS.MODULES, [...allModules, newMod]);
    return newMod;
  }
}

export function deleteCourseModule(id: string): void {
  const allModules = readStorage<CourseModule[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES).filter((m) => m.id !== id);
  writeStorage(STORAGE_KEYS.MODULES, allModules);
}

// ----------------------------------------------------------------------
// QUIZZES & ASSESSMENTS
// ----------------------------------------------------------------------
export function getCourseQuiz(courseId: string): CourseQuiz | null {
  const quizzes = readStorage<CourseQuiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  const found = quizzes.find((q) => q.courseId === courseId);
  if (found) return found;

  // Default quiz for any course without a dedicated one
  const course = getCourses().find((c) => c.id === courseId);
  return {
    id: `quiz-${courseId}`,
    courseId,
    title: `${course?.title || 'Course'} — Final Assessment`,
    description: 'Verify your proficiency across the key modules and practical techniques.',
    passingPercentage: 70,
    maxAttempts: 3,
    questions: [
      {
        id: `q-${courseId}-1`,
        quizId: `quiz-${courseId}`,
        question: 'What is the most critical factor before cutting expensive fabrics for a bespoke outfit?',
        type: 'multiple_choice',
        options: [
          'Checking accurate measurements and grainline alignment',
          'Cutting immediately without checking',
          'Painting the fabric',
          'Ironing on maximum heat without testing steam',
        ],
        correctAnswer: 0,
        explanation: 'Accurate measurements and straight grainline alignment prevent distortion in the finished silhouette.',
        marks: 35,
      },
      {
        id: `q-${courseId}-2`,
        quizId: `quiz-${courseId}`,
        question: 'True or False: A bespoke garment includes personal ease allowances tailored specifically to the patron\'s posture.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Bespoke tailoring accounts for shoulder slopes, posture, and individualized comfort.',
        marks: 35,
      },
      {
        id: `q-${courseId}-3`,
        quizId: `quiz-${courseId}`,
        question: 'In fashion design terminology, what does "silhouette" represent?',
        type: 'multiple_choice',
        options: [
          'The external outline or contour shape of an ensemble',
          'The brand price tag',
          'The sewing machine needle size',
          'The button diameter',
        ],
        correctAnswer: 0,
        explanation: 'Silhouette is the outer shape of the outfit seen against a background.',
        marks: 30,
      },
    ],
  };
}

export function saveCourseQuiz(quiz: CourseQuiz): CourseQuiz {
  const quizzes = readStorage<CourseQuiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  const idx = quizzes.findIndex((q) => q.id === quiz.id || q.courseId === quiz.courseId);
  if (idx >= 0) {
    quizzes[idx] = quiz;
  } else {
    quizzes.push(quiz);
  }
  writeStorage(STORAGE_KEYS.QUIZZES, quizzes);
  return quiz;
}

// ----------------------------------------------------------------------
// STUDENT AUTH & REGISTRATION
// ----------------------------------------------------------------------
export function getRegisteredStudents(): StudentUser[] {
  return readStorage<StudentUser[]>(STORAGE_KEYS.STUDENTS, [
    {
      id: 'student-demo',
      name: 'Simran Preet Kaur',
      email: 'student@akcoutcher.com',
      phone: '+91 98765 00001',
      password: 'password123',
      bio: 'Fashion designing aspirant passionate about Punjabi couture and embroidery.',
      createdAt: '2026-01-01T10:00:00Z',
    },
  ]);
}

export function registerStudent(data: { name: string; email: string; phone: string; password: string }): { success: boolean; student?: StudentUser; message?: string } {
  const students = getRegisteredStudents();
  const normalizedEmail = data.email.trim().toLowerCase();

  const existing = students.find((s) => s.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, message: 'An account with this email address already exists. Please log in.' };
  }

  const newStudent: StudentUser = {
    id: `student-${Date.now()}`,
    name: data.name.trim(),
    email: normalizedEmail,
    phone: data.phone.trim(),
    password: data.password,
    createdAt: new Date().toISOString(),
  };

  writeStorage(STORAGE_KEYS.STUDENTS, [...students, newStudent]);
  setCurrentStudent(newStudent);
  return { success: true, student: newStudent };
}

export function loginStudent(email: string, password?: string): { success: boolean; student?: StudentUser; message?: string } {
  const students = getRegisteredStudents();
  const normalizedEmail = email.trim().toLowerCase();

  const student = students.find((s) => s.email.toLowerCase() === normalizedEmail);
  if (!student) {
    return { success: false, message: 'No student found with this email. Please register first.' };
  }

  if (password && student.password && student.password !== password) {
    return { success: false, message: 'Invalid password. Please check and try again.' };
  }

  setCurrentStudent(student);
  return { success: true, student };
}

export function getCurrentStudent(): StudentUser | null {
  return readStorage<StudentUser | null>(STORAGE_KEYS.CURRENT_STUDENT, null);
}

export function setCurrentStudent(student: StudentUser | null): void {
  writeStorage(STORAGE_KEYS.CURRENT_STUDENT, student);
}

export function logoutStudent(): void {
  setCurrentStudent(null);
}

// ----------------------------------------------------------------------
// ENROLLMENTS & PROGRESS
// ----------------------------------------------------------------------
export function getAllEnrollments(): CourseEnrollment[] {
  return readStorage<CourseEnrollment[]>(STORAGE_KEYS.ENROLLMENTS, [
    {
      id: 'enr-demo-1',
      studentId: 'student-demo',
      courseId: 'course-free-1',
      paymentStatus: 'free',
      enrollmentDate: '2026-01-15T12:00:00Z',
      completedLessons: ['les-f1-1', 'les-f1-2', 'les-f1-3'],
      progress: 43,
      completionStatus: 'in_progress',
      quizAttempts: [],
    },
  ]);
}

export function getStudentEnrollments(studentId: string): CourseEnrollment[] {
  return getAllEnrollments().filter((e) => e.studentId === studentId);
}

export function getEnrollment(studentId: string, courseId: string): CourseEnrollment | null {
  return getAllEnrollments().find((e) => e.studentId === studentId && e.courseId === courseId) || null;
}

export function enrollStudentInCourse(params: {
  studentId: string;
  courseId: string;
  paymentStatus: 'free' | 'paid';
  amountPaid?: number;
  transactionId?: string;
  paymentMethod?: string;
}): CourseEnrollment {
  const enrollments = getAllEnrollments();
  const existing = enrollments.find((e) => e.studentId === params.studentId && e.courseId === params.courseId);

  if (existing) {
    return existing;
  }

  const newEnrollment: CourseEnrollment = {
    id: `enr-${Date.now()}`,
    studentId: params.studentId,
    courseId: params.courseId,
    paymentStatus: params.paymentStatus,
    amountPaid: params.amountPaid,
    transactionId: params.transactionId,
    paymentMethod: params.paymentMethod,
    enrollmentDate: new Date().toISOString(),
    completedLessons: [],
    progress: 0,
    completionStatus: 'in_progress',
    quizAttempts: [],
  };

  writeStorage(STORAGE_KEYS.ENROLLMENTS, [...enrollments, newEnrollment]);

  // Increment student count in course
  const courses = getCourses();
  const courseIdx = courses.findIndex((c) => c.id === params.courseId);
  if (courseIdx >= 0) {
    courses[courseIdx].studentsCount = (courses[courseIdx].studentsCount || 0) + 1;
    writeStorage(STORAGE_KEYS.COURSES, courses);
  }

  return newEnrollment;
}

export function updateLessonProgress(studentId: string, courseId: string, lessonId: string, isCompleted: boolean): CourseEnrollment | null {
  const enrollments = getAllEnrollments();
  const idx = enrollments.findIndex((e) => e.studentId === studentId && e.courseId === courseId);
  if (idx < 0) return null;

  const enr = { ...enrollments[idx] };
  let completed = [...enr.completedLessons];

  if (isCompleted && !completed.includes(lessonId)) {
    completed.push(lessonId);
  } else if (!isCompleted && completed.includes(lessonId)) {
    completed = completed.filter((id) => id !== lessonId);
  }

  enr.completedLessons = completed;

  // Calculate progress against total lessons in course
  const modules = getCourseModules(courseId);
  const totalLessonsCount = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 1;

  enr.progress = Math.min(100, Math.round((completed.length / totalLessonsCount) * 100));

  enrollments[idx] = enr;
  writeStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);
  return enr;
}

export function recordQuizAttempt(params: {
  studentId: string;
  courseId: string;
  quizId: string;
  score: number;
  passed: boolean;
}): { enrollment: CourseEnrollment; certificate?: IssuedCertificate } {
  const enrollments = getAllEnrollments();
  const idx = enrollments.findIndex((e) => e.studentId === params.studentId && e.courseId === params.courseId);

  if (idx < 0) {
    throw new Error('Student is not enrolled in this course.');
  }

  const enr = { ...enrollments[idx] };
  const attempt = {
    quizId: params.quizId,
    score: params.score,
    passed: params.passed,
    attemptDate: new Date().toISOString(),
  };

  enr.quizAttempts = [...(enr.quizAttempts || []), attempt];

  let certificate: IssuedCertificate | undefined;

  // Check if eligible for certificate: passed quiz and high lesson completion
  if (params.passed) {
    enr.completionStatus = 'completed';
    enr.progress = 100;

    // Issue certificate if not already issued
    if (!enr.certificateId) {
      certificate = issueCertificate({
        studentId: params.studentId,
        courseId: params.courseId,
      });
      enr.certificateId = certificate.certificateId;
    }
  }

  enrollments[idx] = enr;
  writeStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);
  return { enrollment: enr, certificate };
}

// ----------------------------------------------------------------------
// CERTIFICATE GENERATION & VERIFICATION
// ----------------------------------------------------------------------
export function getAllCertificates(): IssuedCertificate[] {
  return readStorage<IssuedCertificate[]>(STORAGE_KEYS.CERTIFICATES, [
    {
      id: 'cert-1',
      certificateId: 'AKC-FD-2026-01842',
      studentId: 'student-demo',
      courseId: 'course-free-1',
      studentName: 'Simran Preet Kaur',
      courseName: 'Fashion Designing Basics',
      courseCode: 'AKC-FD-FREE-01',
      courseDuration: '2 Weeks (8 Hours)',
      completionDate: '2026-02-14',
      issueDate: '2026-02-14',
      status: 'valid',
      verificationUrl: '/verify/AKC-FD-2026-01842',
      instructorName: 'Anmol Kaur',
      instructorSignatureText: 'Anmol Kaur (Head Couturier & Master Designer)',
    },
  ]);
}

export function issueCertificate(params: { studentId: string; courseId: string }): IssuedCertificate {
  const students = getRegisteredStudents();
  const courses = getCourses();
  const certificates = getAllCertificates();
  const settings = getAcademySettings();

  const student = students.find((s) => s.id === params.studentId);
  const course = courses.find((c) => c.id === params.courseId);

  const studentName = student?.name || 'Valued Student';
  const courseName = course?.title || 'Fashion Designing Masterclass';
  const courseCode = course?.courseCode || 'AKC-FD-01';
  const courseDuration = course?.duration || '4 Weeks';

  // Format: AKC-FD-YYYY-XXXXX (Req 21)
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const certificateId = `${settings.certificatePrefix || 'AKC-FD'}-${year}-${randomSuffix}`;
  const now = new Date().toISOString().split('T')[0];

  const newCertificate: IssuedCertificate = {
    id: `cert-${Date.now()}`,
    certificateId,
    studentId: params.studentId,
    courseId: params.courseId,
    studentName,
    courseName,
    courseCode,
    courseDuration,
    completionDate: now,
    issueDate: now,
    status: 'valid',
    verificationUrl: `/verify/${certificateId}`,
    instructorName: course?.instructor?.name || 'Anmol Kaur',
    instructorSignatureText: `${course?.instructor?.name || 'Anmol Kaur'} (Creative Director & Master Couturier)`,
  };

  writeStorage(STORAGE_KEYS.CERTIFICATES, [newCertificate, ...certificates]);
  return newCertificate;
}

export function verifyCertificate(certificateId: string): IssuedCertificate | null {
  const certificates = getAllCertificates();
  const cleanId = certificateId.trim().toUpperCase();
  return certificates.find((c) => c.certificateId.toUpperCase() === cleanId) || null;
}

export function updateCertificateStatus(id: string, status: 'valid' | 'revoked'): void {
  const certificates = getAllCertificates().map((c) => (c.id === id || c.certificateId === id ? { ...c, status } : c));
  writeStorage(STORAGE_KEYS.CERTIFICATES, certificates);
}
