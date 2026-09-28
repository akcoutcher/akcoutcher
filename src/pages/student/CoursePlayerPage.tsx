import React, { useState, useEffect, useMemo } from 'react';
import { Course, CourseModule, CourseLesson, CourseQuiz, CourseEnrollment } from '../../types/courses';
import {
  getCourseBySlug,
  getCourseModules,
  getCurrentStudent,
  getEnrollment,
  updateLessonProgress,
  getCourseQuiz,
  recordQuizAttempt,
  issueCertificate,
} from '../../lib/courseDb';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  Award,
  ChevronDown,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';

interface CoursePlayerPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CoursePlayerPage: React.FC<CoursePlayerPageProps> = ({ slug, onNavigate }) => {
  const student = getCurrentStudent();
  const course = useMemo(() => getCourseBySlug(slug), [slug]);
  const modules = useMemo(() => (course ? getCourseModules(course.id) : []), [course]);

  // Quiz data
  const quiz = useMemo(() => (course ? getCourseQuiz(course.id) : null), [course]);

  // Enrollment state
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);

  // Active viewing mode: 'lesson' | 'quiz' | 'completion'
  const [activeView, setActiveView] = useState<'lesson' | 'quiz' | 'completion'>('lesson');

  // Currently selected lesson
  const allLessons = useMemo(() => {
    return modules.flatMap((m) => m.lessons);
  }, [modules]);

  const [currentLessonId, setCurrentLessonId] = useState<string>('');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string | number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [awardedCertId, setAwardedCertId] = useState<string>('');

  useEffect(() => {
    if (!student) {
      onNavigate(`/student/auth?course=${slug}`);
      return;
    }
    if (course) {
      const enr = getEnrollment(student.id, course.id);
      if (!enr) {
        // If not enrolled yet, prompt enrollment / checkout
        onNavigate(`/courses/${course.slug}`);
        return;
      }
      setEnrollment(enr);

      // Default to first incomplete lesson or first lesson
      if (allLessons.length > 0) {
        const firstIncomplete = allLessons.find((l) => !enr.completedLessons.includes(l.id));
        setCurrentLessonId(firstIncomplete ? firstIncomplete.id : allLessons[0].id);
      }
    }
  }, [student, course, slug, allLessons]);

  if (!course || !student || !enrollment) {
    return (
      <div className="min-h-screen bg-[#1C1917] text-white flex items-center justify-center p-6">
        <p className="text-xs text-stone-400">Loading learning environment...</p>
      </div>
    );
  }

  const currentLesson: CourseLesson | undefined = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const isCurrentCompleted = currentLesson ? enrollment.completedLessons.includes(currentLesson.id) : false;

  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const hasPrev = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;

  // Toggle lesson complete
  const handleToggleComplete = () => {
    if (!currentLesson) return;
    const nextState = !isCurrentCompleted;
    const updated = updateLessonProgress(student.id, course.id, currentLesson.id, nextState);
    if (updated) {
      setEnrollment(updated);
    }
  };

  const handleNextLesson = () => {
    if (hasNext) {
      // Auto-mark current as complete if not yet done
      if (!isCurrentCompleted && currentLesson) {
        const updated = updateLessonProgress(student.id, course.id, currentLesson.id, true);
        if (updated) setEnrollment(updated);
      }
      setCurrentLessonId(allLessons[currentLessonIndex + 1].id);
      setActiveView('lesson');
    } else {
      // Reached the end of lessons -> open Quiz
      setActiveView('quiz');
    }
  };

  const handlePrevLesson = () => {
    if (hasPrev) {
      setCurrentLessonId(allLessons[currentLessonIndex - 1].id);
      setActiveView('lesson');
    }
  };

  // Quiz submission logic
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    let correctCount = 0;
    quiz.questions.forEach((q) => {
      const studentAns = selectedAnswers[q.id];
      if (String(studentAns).toLowerCase().trim() === String(q.correctAnswer).toLowerCase().trim()) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = calculatedScore >= (quiz.passingPercentage || 70);

    setQuizScore(calculatedScore);
    setQuizPassed(passed);
    setQuizSubmitted(true);

    // Save attempt in database
    const result = recordQuizAttempt({
      studentId: student.id,
      courseId: course.id,
      quizId: quiz.id,
      score: calculatedScore,
      passed,
    });

    setEnrollment(result.enrollment);
    if (result.certificate) {
      setAwardedCertId(result.certificate.certificateId);
    } else if (result.enrollment.certificateId) {
      setAwardedCertId(result.enrollment.certificateId);
    }

    if (passed) {
      setActiveView('completion');
    }
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#FAF7F2] flex flex-col">
      {/* Top Learning Bar */}
      <header className="h-16 bg-[#1A1816] border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/student/dashboard')}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="h-4 w-px bg-stone-700 hidden sm:block" />
          <div>
            <h2 className="text-xs sm:text-sm font-serif font-medium text-stone-200 line-clamp-1">
              {course.title}
            </h2>
            <span className="text-[10px] text-[#C5A059] font-mono">
              {course.courseCode} • {course.level}
            </span>
          </div>
        </div>

        {/* Course Progress Bar (Requirement 8) */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
              Course Progress
            </span>
            <span className="text-xs font-mono font-bold text-[#C5A059]">
              {enrollment.progress}% Complete
            </span>
          </div>
          <div className="w-24 sm:w-32 bg-stone-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#C5A059] h-2 rounded-full transition-all duration-300"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
          {enrollment.certificateId && (
            <button
              onClick={() => onNavigate(`/certificate/${enrollment.certificateId}`)}
              className="px-2.5 py-1 bg-[#C5A059] text-stone-950 text-[10px] uppercase font-bold rounded flex items-center gap-1"
            >
              <Award className="w-3 h-3" />
              <span>Certificate</span>
            </button>
          )}
        </div>
      </header>

      {/* Main 2-Column Course Interface */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Module & Lesson Navigation (Requirement 8) */}
        <aside className="w-full lg:w-80 xl:w-96 bg-[#1A1816] border-r border-stone-800 flex flex-col order-2 lg:order-1 overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-64px)]">
          <div className="p-4 border-b border-stone-800 bg-[#141210]/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                Curriculum Syllabus
              </span>
            </div>
            <span className="text-[10px] text-stone-500 font-mono">
              {enrollment.completedLessons.length}/{allLessons.length} Completed
            </span>
          </div>

          {/* Module List */}
          <div className="divide-y divide-stone-800/80">
            {modules.map((module, mIdx) => (
              <div key={module.id} className="py-2">
                <div className="px-4 py-2 text-[11px] font-medium text-stone-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Module {mIdx + 1}: {module.title.replace(/^Module \d+:\s*/, '')}</span>
                  <span className="text-[10px] font-mono text-stone-600">{module.lessons.length}</span>
                </div>

                <div className="space-y-0.5 px-2">
                  {module.lessons.map((lesson) => {
                    const isDone = enrollment.completedLessons.includes(lesson.id);
                    const isActive = currentLessonId === lesson.id && activeView === 'lesson';

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setCurrentLessonId(lesson.id);
                          setActiveView('lesson');
                        }}
                        className={`w-full px-3 py-2.5 rounded-lg text-left text-xs transition flex items-center justify-between gap-2.5 cursor-pointer ${
                          isActive
                            ? 'bg-[#58111A] text-white font-medium shadow-xs'
                            : 'text-stone-300 hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C5A059]' : 'text-stone-600'}`} />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-500 shrink-0">
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Assessment Tab in Syllabus */}
            {quiz && (
              <div className="p-3">
                <button
                  onClick={() => setActiveView('quiz')}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                    activeView === 'quiz' || activeView === 'completion'
                      ? 'bg-[#C5A059] text-stone-950 font-bold border-[#C5A059]'
                      : 'border-stone-700 bg-stone-800/40 text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4" />
                    <div>
                      <span className="text-xs uppercase tracking-wider block">Final Assessment Quiz</span>
                      <span className="text-[10px] opacity-80">
                        {quiz.questions.length} Questions • Passing: {quiz.passingPercentage}%
                      </span>
                    </div>
                  </div>
                  {enrollment.completionStatus === 'completed' && (
                    <Award className="w-4 h-4 text-emerald-900" />
                  )}
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: Video / Lesson Content Player & Assessments (Requirement 8, 9, 10) */}
        <main className="flex-1 flex flex-col bg-[#141210] order-1 lg:order-2 overflow-y-auto">
          {/* VIEW 1: LESSON PLAYER */}
          {activeView === 'lesson' && currentLesson && (
            <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 sm:p-8 space-y-6">
              {/* Video Player or Interactive Visual Player */}
              <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-stone-800 shadow-2xl relative">
                {currentLesson.videoUrl && currentLesson.videoUrl.includes('youtube.com') ? (
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  /* High-end Atelier Lesson Video Placeholder Interface */
                  <div className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-br from-stone-950 via-[#2B060B] to-stone-950 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#C5A059] flex items-center justify-center text-stone-950 shadow-2xl mb-4 animate-pulse">
                      <Play className="w-7 h-7 fill-stone-950 ml-1" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">
                      AK COUTURE Masterclass Player
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mt-1">
                      {currentLesson.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-2 max-w-md">
                      Instructor: Anmol Kaur • Duration: {currentLesson.duration}
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Details & Content */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                  <div>
                    <span className="text-xs text-[#C5A059] uppercase tracking-wider font-semibold">
                      Lesson {currentLessonIndex + 1} of {allLessons.length}
                    </span>
                    <h1 className="font-serif text-2xl sm:text-3xl text-white font-medium">
                      {currentLesson.title}
                    </h1>
                  </div>

                  {/* Mark as Complete Trigger (Requirement 8) */}
                  <button
                    onClick={handleToggleComplete}
                    className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition flex items-center gap-2 cursor-pointer shadow-md ${
                      isCurrentCompleted
                        ? 'bg-emerald-700/80 text-white hover:bg-emerald-600'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCurrentCompleted ? 'Marked Complete ✓' : 'Mark as Complete'}</span>
                  </button>
                </div>

                {/* Lesson Reading Material / Content Notes */}
                <div className="bg-[#1C1A18] p-6 rounded-2xl border border-stone-800 space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                  <h4 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>Lesson Synopsis &amp; Key Takeaways</span>
                  </h4>
                  <div className="whitespace-pre-line text-stone-300">
                    {currentLesson.content || currentLesson.description}
                  </div>
                </div>
              </div>

              {/* Below Lesson: Navigation Controls (Requirement 8) */}
              <div className="pt-6 border-t border-stone-800 flex items-center justify-between gap-4">
                <button
                  onClick={handlePrevLesson}
                  disabled={!hasPrev}
                  className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Lesson</span>
                </button>

                <button
                  onClick={handleNextLesson}
                  className="px-6 py-2.5 bg-[#58111A] hover:bg-[#6D1621] text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95"
                >
                  <span>{hasNext ? 'Next Lesson' : 'Take Final Assessment'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: QUIZ & ASSESSMENT SYSTEM (Requirement 9) */}
          {activeView === 'quiz' && quiz && (
            <div className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-8 space-y-6">
              <div className="bg-[#1C1A18] p-6 sm:p-8 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-[#C5A059]">
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-xs uppercase font-bold tracking-widest">
                    Assessment Examination
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
                  {quiz.title}
                </h2>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {quiz.description || 'Answer all questions to test your subject proficiency.'} Passing score requirement: <strong>{quiz.passingPercentage}%</strong>.
                </p>
              </div>

              {/* Quiz Submission Form */}
              <form onSubmit={handleQuizSubmit} className="space-y-6">
                {quiz.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-[#1C1A18] p-6 rounded-2xl border border-stone-800 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-serif text-sm sm:text-base font-medium text-stone-100">
                        {idx + 1}. {q.question}
                      </span>
                      <span className="text-[10px] font-mono text-[#C5A059] bg-white/5 px-2 py-0.5 rounded">
                        {q.marks} Marks
                      </span>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 pt-2">
                      {q.options && q.options.map((opt, optIdx) => {
                        const isChecked =
                          q.type === 'multiple_choice'
                            ? selectedAnswers[q.id] === optIdx
                            : selectedAnswers[q.id] === opt;

                        return (
                          <label
                            key={optIdx}
                            className={`p-3.5 rounded-xl border text-xs flex items-center gap-3 transition cursor-pointer ${
                              isChecked
                                ? 'bg-[#58111A]/60 border-[#C5A059] text-white'
                                : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              checked={isChecked}
                              onChange={() => {
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: q.type === 'multiple_choice' ? optIdx : opt,
                                }));
                              }}
                              className="accent-[#C5A059]"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveView('lesson')}
                    className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-xs uppercase tracking-wider rounded-xl transition"
                  >
                    Back to Lessons
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 text-xs uppercase tracking-widest font-bold rounded-xl shadow-xl transition active:scale-95 cursor-pointer"
                  >
                    Submit Final Assessment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW 3: FINAL COURSE COMPLETION (Requirement 10) */}
          {activeView === 'completion' && (
            <div className="flex-1 max-w-2xl mx-auto w-full p-6 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#58111A] to-[#C5A059] flex items-center justify-center text-white shadow-2xl animate-bounce">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">
                  Assessment Result: {quizScore}% — PASSED
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
                  Congratulations!
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-md mx-auto">
                  You have successfully completed this course and fulfilled all academic requirements for <strong>{course.title}</strong>.
                </p>
              </div>

              {/* View Certificate CTA Button (Requirement 10) */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onNavigate(`/certificate/${awardedCertId || enrollment.certificateId}`)}
                  className="px-8 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 text-xs uppercase tracking-widest font-bold rounded-xl shadow-xl transition active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>VIEW CERTIFICATE</span>
                </button>

                <button
                  onClick={() => onNavigate('/student/dashboard')}
                  className="px-6 py-3.5 bg-stone-800 hover:bg-stone-700 text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
