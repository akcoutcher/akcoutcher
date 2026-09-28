import React from 'react';
import { Course } from '../../types/courses';
import { Clock, BookOpen, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCouture } from '../../context/CoutureContext';

interface CourseCardProps {
  course: Course;
  onNavigate: (path: string) => void;
  onEnroll?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onNavigate, onEnroll }) => {
  const { formatPrice } = useCouture();

  const isFree = course.type === 'free' || course.price === 0;
  const hasDiscount = course.discountPrice && course.discountPrice < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.price - course.discountPrice!) / course.price) * 100)
    : 0;

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course);
    } else {
      if (isFree) {
        onNavigate(`/student/auth?course=${course.slug}&action=enroll_free`);
      } else {
        onNavigate(`/checkout/${course.slug}`);
      }
    }
  };

  return (
    <div
      onClick={() => onNavigate(`/courses/${course.slug}`)}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer relative"
    >
      {/* Course Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for subtle high-end finish */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Type & Bestseller Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          {isFree ? (
            <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-emerald-600 text-white rounded-full shadow-sm flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              100% Free Course
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-[#58111A] text-[#C5A059] border border-[#C5A059]/40 rounded-full shadow-sm">
              Professional Diploma
            </span>
          )}

          {course.isBestseller && (
            <span className="px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-[#C5A059] text-stone-950 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
        </div>

        {/* Level Tag in bottom right corner of image */}
        <div className="absolute bottom-2.5 right-3 text-white text-[11px] font-medium px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded">
          {course.level}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 uppercase tracking-widest font-medium">
            <span>{course.category}</span>
            <span className="text-[#C5A059] font-mono font-normal">{course.courseCode}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-900 group-hover:text-[#58111A] transition-colors line-clamp-2">
            {course.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-light">
            {course.shortDescription || course.description}
          </p>
        </div>

        {/* Meta Stats: Duration & Lessons */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{course.totalLessons} Lessons</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          {/* Price display */}
          <div>
            {isFree ? (
              <div className="flex items-center gap-1 text-emerald-700 font-bold text-base">
                <span>Free Access</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg sm:text-xl font-semibold text-[#58111A]">
                  {formatPrice(hasDiscount ? course.discountPrice! : course.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xs text-stone-400 line-through">
                      {formatPrice(course.price)}
                    </span>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleEnrollClick}
              className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all shadow-xs cursor-pointer active:scale-95 ${
                isFree
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  : 'bg-[#58111A] hover:bg-[#6D1621] text-white'
              }`}
            >
              {isFree ? 'Enroll Free' : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
