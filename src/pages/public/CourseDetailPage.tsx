import React, { useState, useMemo } from 'react';
import { Course, CourseModule } from '../../types/courses';
import {
  getCourseBySlug,
  getCourseModules,
  getCurrentStudent,
  getEnrollment,
} from '../../lib/courseDb';
import { useCouture } from '../../context/CoutureContext';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Award,
  Play,
  Share2,
  Users,
  ShieldCheck,
  ArrowLeft,
  Lock,
  GraduationCap
} from 'lucide-react';

interface CourseDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ slug, onNavigate }) => {
  const course = useMemo(() => getCourseBySlug(slug), [slug]);
  const modules = useMemo(() => (course ? getCourseModules(course.id) : []), [course]);
  const currentStudent = getCurrentStudent();
  const enrollment = useMemo(() => {
    if (!currentStudent || !course) return null;
    return getEnrollment(currentStudent.id, course.id);
  }, [currentStudent, course]);

  const { formatPrice } = useCouture();

  const [expandedModules, setExpandedModules] = useState<{ [id: string]: boolean }>({
    [modules[0]?.id || '']: true,
  });

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#58111A]">Course Not Found</h2>
        <p className="text-xs text-stone-500">The training program you are looking for does not exist or has been relocated.</p>
        <button
          onClick={() => onNavigate('/courses')}
          className="px-6 py-2.5 bg-[#58111A] text-white text-xs uppercase tracking-wider font-semibold rounded-lg"
        >
          Back to All Courses
        </button>
      </div>
    );
  }

  const isFree = course.type === 'free' || course.price === 0;
  const isEnrolled = Boolean(enrollment);
  const hasDiscount = course.discountPrice && course.discountPrice < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.price - course.discountPrice!) / course.price) * 100)
    : 0;

  const handleEnrollOrResume = () => {
    if (isEnrolled) {
      onNavigate(`/student/player/${course.slug}`);
      return;
    }

    if (isFree) {
      if (!currentStudent) {
        onNavigate(`/student/auth?course=${course.slug}&action=enroll_free`);
      } else {
        onNavigate(`/checkout/${course.slug}`);
      }
    } else {
      onNavigate(`/checkout/${course.slug}`);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] min-h-screen pb-20">
      {/* Breadcrumb Bar */}
      <div className="bg-[#EFE8DE] border-b border-[#E1D3C1] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2 truncate">
            <button
              onClick={() => onNavigate('/courses')}
              className="hover:text-[#58111A] flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Training &amp; Courses</span>
            </button>
            <span>/</span>
            <span className="text-stone-400">{course.category}</span>
            <span>/</span>
            <span className="text-stone-900 font-medium truncate max-w-xs">{course.title}</span>
          </div>
          <span className="font-mono text-[#58111A] font-semibold text-[11px] hidden sm:inline">
            {course.courseCode}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[#2B060B] text-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest bg-[#C5A059] text-stone-950 rounded">
                {course.category}
              </span>
              <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-wider bg-white/10 text-stone-200 rounded">
                {course.level}
              </span>
              {isFree ? (
                <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-emerald-600 text-white rounded">
                  Free Access
                </span>
              ) : (
                <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-[#58111A] text-[#C5A059] border border-[#C5A059]/40 rounded">
                  Diploma Course
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-3xl">
              {course.shortDescription || course.description}
            </p>

            {/* Quick Meta */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#C5A059]" />
                <span>{course.totalLessons} Comprehensive Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#C5A059]" />
                <span>{course.studentsCount} Students Trained</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C5A059]" />
                <span>Official Completion Certificate</span>
              </div>
            </div>

            {/* Instructor Line */}
            <div className="pt-4 flex items-center gap-3">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-10 h-10 rounded-full object-cover border border-[#C5A059]"
              />
              <div>
                <span className="text-[11px] text-stone-400 block uppercase tracking-wider">Instructor &amp; Mentor</span>
                <span className="text-sm font-medium text-white">{course.instructor.name}</span>
                <span className="text-xs text-[#C5A059] ml-2">({course.instructor.role})</span>
              </div>
            </div>
          </div>

          {/* Desktop Floating Action Card preview */}
          <div className="lg:col-span-4 bg-white text-stone-900 rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-stone-100 relative group">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#C5A059] flex items-center justify-center text-stone-950 shadow-lg">
                  <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-1">
              {isFree ? (
                <div className="flex items-center gap-2">
                  <span className="font-serif text-3xl font-bold text-emerald-700">FREE</span>
                  <span className="text-xs text-stone-500 uppercase tracking-wider">(100% Complimentary)</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl font-bold text-[#58111A]">
                      {formatPrice(hasDiscount ? course.discountPrice! : course.price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatPrice(course.price)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded inline-block">
                      Special Introductory Offer • Save {discountPercent}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Main Action Button */}
            <button
              onClick={handleEnrollOrResume}
              className="w-full py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest font-semibold text-white bg-[#58111A] hover:bg-[#6D1621] shadow-lg transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>
                {isEnrolled
                  ? 'Continue Learning Course'
                  : isFree
                  ? 'Enroll Free Now'
                  : 'Enroll in Program'}
              </span>
            </button>

            {isEnrolled && (
              <p className="text-center text-xs text-emerald-700 font-medium">
                ✓ You are already enrolled in this course.
              </p>
            )}

            <div className="space-y-2 pt-2 border-t border-stone-200 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full Lifetime Access (Self-Paced)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mobile, Tablet &amp; Laptop Accessible</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verifiable Certificate of Course Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct WhatsApp Mentor Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Course Syllabus & Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* 1. What You Will Learn (Outcomes) */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif text-2xl text-[#58111A] font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <span>What You Will Learn</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {course.learningOutcomes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Course Curriculum & Expandable Modules (Requirement 5) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-[#58111A] font-medium">
                  Course Curriculum &amp; Modules
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {modules.length} Modules • {modules.reduce((a, m) => a + m.lessons.length, 0)} Lessons
                </p>
              </div>
              <button
                onClick={() => {
                  const allExpanded = Object.keys(expandedModules).length === modules.length;
                  if (allExpanded) {
                    setExpandedModules({});
                  } else {
                    const all: { [id: string]: boolean } = {};
                    modules.forEach((m) => (all[m.id] = true));
                    setExpandedModules(all);
                  }
                }}
                className="text-xs text-[#58111A] hover:underline font-semibold cursor-pointer"
              >
                Expand/Collapse All
              </button>
            </div>

            <div className="space-y-3">
              {modules.map((module, mIdx) => {
                const isOpen = Boolean(expandedModules[module.id]);
                return (
                  <div
                    key={module.id}
                    className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs"
                  >
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full px-5 py-4 bg-stone-50/80 hover:bg-stone-100 flex items-center justify-between text-left transition cursor-pointer"
                    >
                      <div className="space-y-1 pr-4">
                        <span className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider font-semibold">
                          Module {mIdx + 1}
                        </span>
                        <h4 className="font-serif text-base sm:text-lg font-medium text-stone-900">
                          {module.title}
                        </h4>
                        {module.description && (
                          <p className="text-xs text-stone-500 line-clamp-1">{module.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-stone-500">
                          {module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-stone-500 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="divide-y divide-stone-100 px-5">
                        {module.lessons.map((lesson, lIdx) => (
                          <div
                            key={lesson.id}
                            className="py-3 flex items-center justify-between text-xs text-stone-700"
                          >
                            <div className="flex items-center gap-3">
                              <Play className="w-3.5 h-3.5 text-[#58111A]" />
                              <div>
                                <span className="font-medium text-stone-900">
                                  {lesson.title}
                                </span>
                                {lesson.description && (
                                  <p className="text-[11px] text-stone-500 line-clamp-1">
                                    {lesson.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {lesson.isPreview ? (
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                                  Preview Available
                                </span>
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-stone-400" />
                              )}
                              <span className="text-stone-400 font-mono text-[11px]">
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Requirements & Who this course is for */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <h4 className="font-serif text-lg font-medium text-stone-900">Course Requirements</h4>
              <ul className="space-y-2 text-xs text-stone-600">
                {course.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#58111A] mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <h4 className="font-serif text-lg font-medium text-stone-900">Who This Course Is For</h4>
              <ul className="space-y-2 text-xs text-stone-600">
                {course.whoIsThisFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Instructor Bio */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h4 className="font-serif text-xl font-medium text-[#58111A]">Your Instructor &amp; Atelier Mentor</h4>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C5A059] shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div>
                  <h5 className="font-serif text-lg font-semibold text-stone-900">{course.instructor.name}</h5>
                  <p className="text-xs text-[#C5A059] font-medium">{course.instructor.role}</p>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {course.instructor.bio}
                </p>
              </div>
            </div>
          </div>

          {/* 5. Certificate Preview Info (Requirement 20 Compliance) */}
          <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#C5A059]/40 shadow-xs space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#58111A] text-[#C5A059] rounded-xl shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl font-medium text-[#58111A]">
                  Official Certificate of Course Completion
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Upon finishing all module lessons and passing the final assessment quiz (70%+ passing score), you will be awarded an authorized <strong>Certificate of Course Completion</strong> from <strong>AK COUTCHER</strong>.
                </p>
                <div className="pt-1 flex items-center gap-2 text-xs text-stone-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Includes unique Certificate ID (e.g., AKC-FD-2026-XXXXX) &amp; QR verification.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info / Secondary CTA for mobile/tablet */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h4 className="font-serif text-lg font-medium text-stone-900">Need Guidance on Course Selection?</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Have questions regarding offline vs online modules, kit materials, or payment? Connect directly with our academy admissions desk.
            </p>
            <a
              href="https://wa.me/919501657426?text=Hello%20AK%20COUTCHER%20Academy,%20I%20would%20like%20guidance%20regarding%20the%20courses."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>WhatsApp Admission Desk</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 text-xs text-stone-600">
            <h5 className="font-serif text-base font-medium text-stone-900">Learning Guarantee</h5>
            <p className="leading-relaxed">
              Study anywhere on any device. Track your progress with every lesson completed, retake quizzes, and download downloadable PDF charts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
