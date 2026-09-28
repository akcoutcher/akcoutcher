import React, { useState, useEffect } from 'react';
import {
  getCurrentStudent,
  logoutStudent,
  getStudentEnrollments,
  getCourses,
  getAllCertificates,
} from '../../lib/courseDb';
import { Course, CourseEnrollment, IssuedCertificate, StudentUser } from '../../types/courses';
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface StudentDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ onNavigate }) => {
  const [student, setStudent] = useState<StudentUser | null>(() => getCurrentStudent());
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates' | 'profile'>('courses');

  useEffect(() => {
    const current = getCurrentStudent();
    if (!current) {
      onNavigate('/student/auth?tab=login');
      return;
    }
    setStudent(current);
    const enrs = getStudentEnrollments(current.id);
    setEnrollments(enrs);
    setCourses(getCourses());
    const allCerts = getAllCertificates().filter((c) => c.studentId === current.id);
    setCertificates(allCerts);
  }, []);

  const handleLogout = () => {
    logoutStudent();
    onNavigate('/courses');
  };

  if (!student) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center space-y-3">
          <p className="text-xs text-stone-500">Redirecting to Student Authentication...</p>
        </div>
      </div>
    );
  }

  // Map enrollments with corresponding course data
  const enrolledCoursesData = enrollments.map((enr) => {
    const course = courses.find((c) => c.id === enr.courseId);
    return {
      enrollment: enr,
      course,
    };
  });

  const completedCount = enrollments.filter((e) => e.completionStatus === 'completed' || e.progress >= 100).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-20">
      {/* Top Banner / Student Greeting */}
      <div className="bg-[#2B060B] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#C5A059]/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#58111A] to-[#1F0407] border-2 border-[#C5A059] flex items-center justify-center text-white shadow-lg font-serif text-2xl font-bold">
              {student.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] bg-white/10 px-2.5 py-0.5 rounded">
                  Student Portal
                </span>
                <span className="text-xs text-stone-300">ID: {student.id.slice(-6).toUpperCase()}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-light text-white">
                Welcome back, {student.name}
              </h1>
              <p className="text-xs text-stone-300 font-light flex items-center gap-2">
                <span>{student.email}</span>
                <span>•</span>
                <span>{student.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/courses')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs uppercase tracking-wider font-semibold border border-white/20 transition cursor-pointer"
            >
              Browse More Courses
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 text-red-200 rounded-xl text-xs uppercase tracking-wider font-semibold border border-red-800/40 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Quick KPI Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-[#C5A059]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-500 uppercase tracking-wider">Enrolled Courses</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">{enrollments.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-500 uppercase tracking-wider">Completed Programs</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">{completedCount}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-50 text-[#58111A]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-500 uppercase tracking-wider">Earned Certificates</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">{certificates.length}</h3>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mt-8 flex border-b border-stone-200 text-xs font-semibold uppercase tracking-wider gap-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-3.5 transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'border-[#58111A] text-[#58111A]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Courses ({enrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`py-3.5 transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'certificates'
                ? 'border-[#58111A] text-[#58111A]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>My Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-[#58111A] text-[#58111A]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student Profile</span>
          </button>
        </div>

        {/* TAB 1: ENROLLED COURSES */}
        {activeTab === 'courses' && (
          <div className="mt-8 space-y-6">
            {enrolledCoursesData.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-sm">
                <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif text-xl text-stone-800">No Enrolled Courses Yet</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  You haven't enrolled in any fashion designing course yet. Get started with our 6 free introductory courses or professional diplomas!
                </p>
                <button
                  onClick={() => onNavigate('/courses')}
                  className="px-6 py-2.5 bg-[#58111A] hover:bg-[#6D1621] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md cursor-pointer transition"
                >
                  Explore Free &amp; Paid Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCoursesData.map(({ enrollment, course }) => {
                  if (!course) return null;
                  const isCompleted = enrollment.completionStatus === 'completed' || enrollment.progress >= 100;

                  return (
                    <div
                      key={enrollment.id}
                      className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-16 h-16 rounded-xl object-cover border border-stone-200"
                            />
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">
                                {course.category}
                              </span>
                              <h4 className="font-serif text-lg font-medium text-stone-900 leading-snug line-clamp-1">
                                {course.title}
                              </h4>
                              <span className="text-xs text-stone-500 block font-mono">
                                Code: {course.courseCode}
                              </span>
                            </div>
                          </div>

                          {isCompleted ? (
                            <span className="px-2.5 py-1 text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full shrink-0 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] uppercase font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-full shrink-0">
                              In Progress
                            </span>
                          )}
                        </div>

                        {/* Progress Bar (Requirement 7 & 8) */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-600 font-medium">Course Progress</span>
                            <span className="font-bold text-[#58111A]">{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#58111A] to-[#C5A059] h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-stone-400">
                            <span>{enrollment.completedLessons.length} lessons marked complete</span>
                            <span>{course.totalLessons} total lessons</span>
                          </div>
                        </div>

                        {/* Quiz Status */}
                        {enrollment.quizAttempts && enrollment.quizAttempts.length > 0 && (
                          <div className="p-3 bg-stone-50 rounded-xl text-xs flex items-center justify-between border border-stone-100">
                            <span className="text-stone-600">Latest Quiz Score:</span>
                            <span className={`font-semibold ${enrollment.quizAttempts[enrollment.quizAttempts.length - 1].passed ? 'text-emerald-700' : 'text-red-700'}`}>
                              {enrollment.quizAttempts[enrollment.quizAttempts.length - 1].score}% — {enrollment.quizAttempts[enrollment.quizAttempts.length - 1].passed ? 'PASSED' : 'NOT PASSED'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Action footer */}
                      <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
                        {isCompleted && enrollment.certificateId ? (
                          <button
                            onClick={() => onNavigate(`/certificate/${enrollment.certificateId}`)}
                            className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>View Certificate</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-500">
                            Complete all lessons &amp; quiz for certificate
                          </span>
                        )}

                        <button
                          onClick={() => onNavigate(`/student/player/${course.slug}`)}
                          className="px-5 py-2.5 bg-[#58111A] hover:bg-[#6D1621] text-white text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{isCompleted ? 'Review Course' : 'Continue Course'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY CERTIFICATES (Requirement 10 & 11) */}
        {activeTab === 'certificates' && (
          <div className="mt-8 space-y-6">
            {certificates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-sm">
                <Award className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif text-xl text-stone-800">No Certificates Earned Yet</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  Certificates are automatically awarded when you complete 100% of required lessons and achieve a 70%+ score on the course assessment quiz.
                </p>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="px-6 py-2.5 bg-[#58111A] text-white text-xs uppercase tracking-wider font-semibold rounded-xl"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white rounded-2xl border-2 border-[#C5A059]/40 shadow-md p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] bg-[#58111A] px-2.5 py-1 rounded">
                          AK COUTURE Verified
                        </span>
                        <span className="font-mono text-xs font-semibold text-stone-600">
                          {cert.certificateId}
                        </span>
                      </div>

                      <h4 className="font-serif text-xl font-medium text-stone-900">
                        {cert.courseName}
                      </h4>

                      <div className="space-y-1 text-xs text-stone-600">
                        <p><strong>Student:</strong> {cert.studentName}</p>
                        <p><strong>Course Code:</strong> {cert.courseCode}</p>
                        <p><strong>Completion Date:</strong> {cert.completionDate}</p>
                        <p><strong>Authorized Instructor:</strong> {cert.instructorName}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => onNavigate(`/verify/${cert.certificateId}`)}
                        className="text-xs text-[#58111A] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Check Public Verification</span>
                      </button>

                      <button
                        onClick={() => onNavigate(`/certificate/${cert.certificateId}`)}
                        className="px-4 py-2 bg-[#58111A] hover:bg-[#6D1621] text-white text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm"
                      >
                        View &amp; Print
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STUDENT PROFILE */}
        {activeTab === 'profile' && (
          <div className="mt-8 max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif text-xl text-stone-900">Student Profile Information</h3>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Full Name</span>
                <span className="font-semibold text-stone-900">{student.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Email Address</span>
                <span className="font-semibold text-stone-900">{student.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Registered Phone</span>
                <span className="font-semibold text-stone-900">{student.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Account Created</span>
                <span className="font-semibold text-stone-900">
                  {new Date(student.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
              <strong>Academic Note:</strong> Your certificate will be issued with your exact registered student name: <strong>"{student.name}"</strong>. Please ensure the spelling matches your official government identification documents.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
