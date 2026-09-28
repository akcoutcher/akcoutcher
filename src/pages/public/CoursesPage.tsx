import React, { useState, useMemo } from 'react';
import { Course, CourseLevel } from '../../types/courses';
import {
  getCourses,
  getCourseCategories,
  getCurrentStudent,
} from '../../lib/courseDb';
import { CourseCard } from '../../components/courses/CourseCard';
import {
  Search,
  Filter,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  Users,
  ChevronDown,
  Star,
  GraduationCap,
  Play,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  PhoneCall,
  Scissors
} from 'lucide-react';

interface CoursesPageProps {
  onNavigate: (path: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate }) => {
  const [courses] = useState<Course[]>(() => getCourses());
  const [categories] = useState(() => getCourseCategories());
  const currentStudent = getCurrentStudent();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price-low' | 'price-high'>('popular');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => c.status === 'published')
      .filter((c) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.courseCode.toLowerCase().includes(q)
        );
      })
      .filter((c) => {
        if (selectedCategory === 'all') return true;
        return c.category === selectedCategory;
      })
      .filter((c) => {
        if (selectedLevel === 'all') return true;
        return c.level === selectedLevel || c.level === 'All Levels';
      })
      .filter((c) => {
        if (selectedType === 'all') return true;
        return c.type === selectedType;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'popular') return (b.studentsCount || 0) - (a.studentsCount || 0);
        if (sortBy === 'price-low') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        if (sortBy === 'price-high') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        return 0;
      });
  }, [courses, searchQuery, selectedCategory, selectedLevel, selectedType, sortBy]);

  const freeCourses = useMemo(() => courses.filter((c) => c.type === 'free' && c.status === 'published'), [courses]);
  const paidCourses = useMemo(() => courses.filter((c) => c.type === 'paid' && c.status === 'published'), [courses]);

  const generalFaqs = [
    {
      q: 'Are the free courses really 100% free with no hidden charges?',
      a: 'Yes, all 6 free introductory courses provide full lifetime access to video lessons and study materials once you create a student profile.',
    },
    {
      q: 'Will I receive an official certificate after completing a course?',
      a: 'Yes! Upon completing all lessons and passing the final online assessment with 70%+ score, an official Certificate of Course Completion with a verifiable QR code is issued.',
    },
    {
      q: 'What equipment do I need to start learning fashion designing?',
      a: 'For illustration and theory, just basic drawing paper and pencils. For pattern making and garment stitching, a measuring tape, tailor chalk, and access to any domestic sewing machine are recommended.',
    },
    {
      q: 'Can I study at my own pace from home?',
      a: 'Absolutely. All video lessons, reading modules, and assessments are self-paced and accessible 24/7 on desktop, tablet, or smartphone.',
    },
    {
      q: 'Is instructor guidance provided by Anmol Kaur?',
      a: 'Enrolled students in our diploma and master programs receive direct evaluation feedback and WhatsApp support from Anmol Kaur’s atelier team in Punjab.',
    },
  ];

  const studentReviews = [
    {
      name: 'Harpreet Kaur',
      city: 'Jalandhar, Punjab',
      course: 'Pattern Making & Garment Construction',
      rating: 5,
      review: 'Learning from Anmol Ma’am transformed how I cut Patiala suits and kalidar lehengas. The calculation formula for kali flare is worth ten times the course fee!',
    },
    {
      name: 'Pooja Sharma',
      city: 'Delhi NCR',
      course: 'Complete Fashion Designing Course',
      rating: 5,
      review: 'I opened my own bespoke boutique after finishing this certification. The modules on client measurement cards and fabric sourcing were game changers.',
    },
    {
      name: 'Gurleen Sandhu',
      city: 'Vancouver, Canada',
      course: 'Boutique & Fashion Business',
      rating: 5,
      review: 'Taking online classes from an authentic Punjab atelier gave me real cultural insight into luxury zardozi work and overseas NRI customer management.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2B060B] via-[#430D15] to-[#1F0407] text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#C5A059]/30">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#C5A059]/40 text-[#C5A059] text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AK COUTCHER • Skill Development Academy</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight text-balance">
              Fashion Designing <br className="hidden sm:inline" />
              <span className="text-[#C5A059] font-normal italic">Training &amp; Courses</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Learn Fashion Designing from Basics to Advanced Level with AK COUTCHER. Master haute couture drafting, fashion illustration, precision pattern making, and boutique business strategies directly from master couturiers.
            </p>

            {/* Hero Quick Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-left">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs">
                <span className="block font-serif text-xl sm:text-2xl text-[#C5A059] font-bold">12+</span>
                <span className="text-[11px] text-stone-300 uppercase tracking-wider">Expert Courses</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs">
                <span className="block font-serif text-xl sm:text-2xl text-emerald-400 font-bold">6 Free</span>
                <span className="text-[11px] text-stone-300 uppercase tracking-wider">Foundations</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs col-span-2 sm:col-span-1">
                <span className="block font-serif text-xl sm:text-2xl text-[#C5A059] font-bold">Verifiable</span>
                <span className="text-[11px] text-stone-300 uppercase tracking-wider">Certificates</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="#free-courses"
                className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs uppercase tracking-widest font-semibold transition-all shadow-lg text-center active:scale-95"
              >
                Browse Free Courses
              </a>
              <a
                href="#all-courses"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all shadow-lg text-center active:scale-95"
              >
                Explore All Programs
              </a>
              {currentStudent ? (
                <button
                  onClick={() => onNavigate('/student/dashboard')}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs uppercase tracking-wider font-semibold border border-white/20 transition-all text-center"
                >
                  My Student Dashboard →
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('/student/auth?tab=register')}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs uppercase tracking-wider font-semibold border border-white/20 transition-all text-center"
                >
                  Student Register / Login
                </button>
              )}
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A059]/40 bg-stone-950">
              <img
                src="/src/assets/images/punjabi_designer_portrait_1790501188325.jpg"
                alt="AK Coutcher Training Academy"
                className="w-full h-80 sm:h-96 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 space-y-2 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] bg-[#58111A] px-2.5 py-1 rounded">
                  Led by Master Couturier
                </span>
                <h3 className="font-serif text-2xl font-medium">Anmol Kaur</h3>
                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  Creative Director with decades of master cutting, royal trousseau architecture, and Punjabi craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COURSE CATEGORIES GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Specialized Disciplines
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A]">
            Curated Course Categories
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Explore diverse modules from hand sketching to industrial garment construction and boutique entrepreneurship.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(isSelected ? 'all' : cat.name);
                  const el = document.getElementById('all-courses');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'bg-[#58111A] text-white border-[#C5A059] shadow-md'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-[#C5A059] hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Scissors className={`w-4 h-4 ${isSelected ? 'text-[#C5A059]' : 'text-[#58111A]'}`} />
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                    0{cat.order}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-medium line-clamp-1 leading-snug">
                    {cat.name}
                  </h4>
                  <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {cat.description || 'Specialized syllabus'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FREE COURSES SECTION (Requirement 3) */}
      <section id="free-courses" className="py-16 bg-[#F4ECE1] border-y border-[#E2D4C3] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-emerald-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Free Access
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A]">
                FREE FASHION DESIGNING COURSES
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl font-light">
                Kickstart your fashion designing journey without paying a single rupee. Register an account and access all 6 foundational courses immediately.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedType('free');
                const el = document.getElementById('all-courses');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs uppercase font-semibold text-[#58111A] hover:underline flex items-center gap-1 self-start md:self-auto cursor-pointer"
            >
              <span>View All 6 Free Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {freeCourses.slice(0, 6).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PAID COURSES SECTION (Requirement 4) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              Professional Certification
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A]">
              PREMIUM FASHION DESIGNING COURSES
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl font-light">
              Master-grade diploma programs with in-depth technical blueprints, personal mentor evaluations, and verifiable course completion credentials.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedType('paid');
              const el = document.getElementById('all-courses');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs uppercase font-semibold text-[#58111A] hover:underline flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <span>View All Premium Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paidCourses.slice(0, 6).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* 5. SEARCH & FILTER SECTION (ALL COURSES) */}
      <section id="all-courses" className="py-16 bg-white border-t border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900">
              Browse &amp; Search All Courses
            </h3>
            <p className="text-xs text-stone-500">
              Use filters below to pinpoint the perfect learning path for your career goals.
            </p>
          </div>

          {/* Search Bar & Multi-Filters */}
          <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
            {/* Top row: Search input & Sort */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Fashion Designing Courses, pattern making, illustration..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#58111A] text-stone-900"
                />
              </div>

              {/* Sort by */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-stone-500 whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#58111A] text-stone-800 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-200 text-xs">
              {/* Type: All / Free / Paid */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-stone-400 uppercase tracking-wider text-[10px] font-semibold mr-1">Type:</span>
                {(['all', 'free', 'paid'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-1.5 rounded-lg uppercase tracking-wider font-semibold text-[11px] transition-colors cursor-pointer ${
                      selectedType === t
                        ? 'bg-[#58111A] text-white'
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {t === 'all' ? 'All Types' : t === 'free' ? 'Free Only' : 'Premium Only'}
                  </button>
                ))}
              </div>

              {/* Level: Beginner / Intermediate / Advanced */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-stone-400 uppercase tracking-wider text-[10px] font-semibold mr-1">Level:</span>
                {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                      selectedLevel === lvl
                        ? 'bg-[#C5A059] text-stone-950 font-bold'
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {lvl === 'all' ? 'All Levels' : lvl}
                  </button>
                ))}
              </div>

              {/* Reset filter button */}
              {(selectedCategory !== 'all' || selectedLevel !== 'all' || selectedType !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setSelectedType('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-red-700 hover:underline font-semibold cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Filtered Results Grid */}
          <div className="space-y-4">
            <div className="text-xs text-stone-500 font-medium">
              Showing <strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'course' : 'courses'}
            </div>

            {filteredCourses.length === 0 ? (
              <div className="p-16 text-center bg-stone-50 border border-dashed border-stone-300 rounded-2xl space-y-3">
                <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
                <h4 className="font-serif text-xl text-stone-700">No Courses Match Your Filter</h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Try clearing your search query or selecting a different course level or category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setSelectedType('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#58111A] text-white text-xs uppercase tracking-wider font-semibold rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. STUDENT REVIEWS / TESTIMONIALS SECTION */}
      <section className="py-20 bg-[#FAF7F2] px-4 sm:px-6 lg:px-8 border-t border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Patron &amp; Student Feedback
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A]">
              What Our Academy Alumni Say
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              Real testimonials from students who transformed their craft into thriving fashion businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studentReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C5A059]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed font-light">
                    "{rev.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <h5 className="font-serif text-base font-medium text-stone-900">{rev.name}</h5>
                    <span className="text-[11px] text-stone-500">{rev.city}</span>
                  </div>
                  <span className="text-[10px] text-[#58111A] bg-[#58111A]/10 px-2 py-1 rounded font-medium max-w-[120px] truncate">
                    {rev.course}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-20 bg-white border-t border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              Everything you need to know about our training system, certification, and learning access.
            </p>
          </div>

          <div className="space-y-4">
            {generalFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-stone-200 rounded-xl overflow-hidden bg-[#FAF7F2] transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-medium text-stone-900 hover:text-[#58111A] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed font-light border-t border-stone-200 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION & CERTIFICATE VERIFICATION BANNER */}
      <section className="bg-gradient-to-r from-[#200508] via-[#3E0911] to-[#200508] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-[#C5A059]/40">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
              Official Credential Verification
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-white font-light">
              Have an Issued Certificate?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Employers and clients can verify the authenticity of any AK COUTCHER Certificate of Course Completion online in real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={() => onNavigate('/verify')}
              className="flex items-center gap-2 px-7 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 text-xs uppercase tracking-widest font-semibold rounded-xl shadow-xl cursor-pointer active:scale-95 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify a Certificate</span>
            </button>
            <button
              onClick={() => onNavigate('/student/auth?tab=register')}
              className="flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest font-semibold rounded-xl border border-white/20 cursor-pointer active:scale-95 transition"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Create Student Account</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
