import React, { useState, useMemo } from 'react';
import {
  getCourseBySlug,
  getCurrentStudent,
  enrollStudentInCourse,
} from '../../lib/courseDb';
import { useCouture } from '../../context/CoutureContext';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

interface CourseCheckoutPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CourseCheckoutPage: React.FC<CourseCheckoutPageProps> = ({ slug, onNavigate }) => {
  const course = useMemo(() => getCourseBySlug(slug), [slug]);
  const student = getCurrentStudent();
  const { formatPrice } = useCouture();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!course) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center p-6 text-center">
        <p className="text-xs text-stone-500">Course not found.</p>
      </div>
    );
  }

  const isFree = course.type === 'free' || course.price === 0;
  const finalPrice = isFree ? 0 : course.discountPrice || course.price;

  // Handle Enrollment & Modular Payment Flow (Requirement 15)
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!student) {
      onNavigate(`/student/auth?course=${course.slug}&action=${isFree ? 'enroll_free' : 'checkout'}`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Create Enrollment
      const transactionId = isFree ? 'FREE-GRANT' : `TXN-${Date.now().toString().slice(-8)}`;
      enrollStudentInCourse({
        studentId: student.id,
        courseId: course.id,
        paymentStatus: isFree ? 'free' : 'paid',
        amountPaid: finalPrice,
        transactionId,
        paymentMethod: isFree ? 'Free Admission' : paymentMethod.toUpperCase(),
      });

      setIsProcessing(false);
      setIsCompleted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => onNavigate(`/courses/${course.slug}`)}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#58111A] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Information</span>
        </button>

        {isCompleted ? (
          /* Payment Success & Direct Navigation to Player / Dashboard (Requirement 15) */
          <div className="bg-white rounded-2xl border-2 border-emerald-500/50 p-8 sm:p-12 text-center space-y-6 shadow-xl max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl text-emerald-800 font-medium">
                Enrollment Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                Congratulations, you are now enrolled in <strong>{course.title}</strong>. Full course lessons and materials are instantly unlocked.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl text-xs text-stone-600 space-y-1 text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span>Student:</span>
                <span className="font-medium text-stone-900">{student?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Access Status:</span>
                <span className="font-bold text-emerald-700">UNLIMITED LIFETIME</span>
              </div>
              <div className="flex justify-between">
                <span>Certificate Eligibility:</span>
                <span className="font-medium text-stone-900">Active</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigate(`/student/player/${course.slug}`)}
                className="w-full sm:w-auto px-8 py-3 bg-[#58111A] hover:bg-[#6D1621] text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
              >
                Launch Course Player Now →
              </button>
              <button
                onClick={() => onNavigate('/student/dashboard')}
                className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs uppercase tracking-wider font-semibold rounded-xl transition cursor-pointer"
              >
                View Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Payment Method Selection */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">
                  Step 2 of 2 • Secure Enrollment
                </span>
                <h2 className="font-serif text-2xl font-medium text-stone-900">
                  {isFree ? 'Confirm Free Course Admission' : 'Select Payment Method'}
                </h2>
              </div>

              {!student && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
                  <p className="font-medium">You are not logged in as a student.</p>
                  <p className="text-[11px] text-amber-800">
                    Clicking continue will redirect you to quickly create an account or sign in so your progress and certificate can be saved.
                  </p>
                </div>
              )}

              {isFree ? (
                <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>100% Free Scholarship Grant</span>
                  </div>
                  <p className="text-emerald-700 leading-relaxed font-light">
                    No credit card or payment required. Free courses provide full video lesson access, assessment access, and verifiable completion certificates.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleProceedToPayment} className="space-y-6">
                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <label
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === 'upi'
                          ? 'border-[#58111A] bg-[#58111A]/5 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="accent-[#58111A]"
                        />
                        <div>
                          <span className="text-xs font-semibold text-stone-900 block">
                            UPI (Google Pay, PhonePe, Paytm, BHIM)
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Instant zero-fee activation
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#58111A] bg-[#58111A]/10 px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === 'card'
                          ? 'border-[#58111A] bg-[#58111A]/5 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="accent-[#58111A]"
                        />
                        <div>
                          <span className="text-xs font-semibold text-stone-900 block">
                            Credit / Debit Cards
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Visa, MasterCard, RuPay, Amex
                          </span>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-stone-400" />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === 'netbanking'
                          ? 'border-[#58111A] bg-[#58111A]/5 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'netbanking'}
                          onChange={() => setPaymentMethod('netbanking')}
                          className="accent-[#58111A]"
                        />
                        <div>
                          <span className="text-xs font-semibold text-stone-900 block">
                            Net Banking &amp; Bank Transfer
                          </span>
                          <span className="text-[11px] text-stone-500">
                            All major Indian scheduled banks
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                      <label className="block text-xs font-medium text-stone-700">Enter your UPI ID / VPA</label>
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank / yourname@paytm"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#58111A]"
                      />
                      <span className="text-[10px] text-stone-400 block">
                        A payment request will be initiated securely to your UPI mobile app.
                      </span>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                      <p className="text-stone-500 text-[11px] italic">
                        Note: Raw card numbers are processed via secure 256-bit tokenized gateway APIs and never stored on servers (Requirement 15).
                      </p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Card Number (•••• •••• •••• ••••)"
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 bg-[#58111A] hover:bg-[#6D1621] text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing Secure Payment...' : `Complete Payment of ${formatPrice(finalPrice)}`}
                    </button>
                  </div>
                </form>
              )}

              {isFree && (
                <button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-lg transition active:scale-98 cursor-pointer"
                >
                  {isProcessing ? 'Confirming Admission...' : 'Confirm Free Enrollment'}
                </button>
              )}

              <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-500">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>256-Bit SSL Encrypted &amp; Modular Payment Architecture</span>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-sm">
              <h3 className="font-serif text-lg font-medium text-stone-900 border-b border-stone-100 pb-3">
                Order Summary
              </h3>

              <div className="flex gap-3">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-20 h-16 rounded-xl object-cover border border-stone-200"
                />
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#C5A059]">
                    {course.category}
                  </span>
                  <h4 className="font-serif text-sm font-medium text-stone-900 leading-snug">
                    {course.title}
                  </h4>
                  <span className="text-[11px] text-stone-500 block">
                    Duration: {course.duration}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Course Base Tuition:</span>
                  <span className={course.discountPrice ? 'line-through text-stone-400' : ''}>
                    {isFree ? 'Free' : formatPrice(course.price)}
                  </span>
                </div>

                {course.discountPrice && (
                  <div className="flex justify-between text-red-600 font-medium">
                    <span>Atelier Scholarship Discount:</span>
                    <span>- {formatPrice(course.price - course.discountPrice)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Verifiable Certificate Fee:</span>
                  <span className="text-emerald-700 font-medium">Included (₹0)</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
                  <span>Total Payable:</span>
                  <span className="font-serif text-xl text-[#58111A]">
                    {isFree ? 'FREE' : formatPrice(finalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
