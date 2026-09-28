import React, { useState } from 'react';
import {
  registerStudent,
  loginStudent,
  getCurrentStudent,
} from '../../lib/courseDb';
import { GraduationCap, ArrowRight, ShieldCheck, Mail, Lock, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

interface StudentAuthPageProps {
  onNavigate: (path: string) => void;
  defaultTab?: 'login' | 'register';
  redirectCourseSlug?: string;
  action?: string;
}

export const StudentAuthPage: React.FC<StudentAuthPageProps> = ({
  onNavigate,
  defaultTab = 'register',
  redirectCourseSlug,
  action,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'register') {
      if (!name.trim() || !email.trim() || !phone.trim() || !password) {
        setErrorMsg('Please complete all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters.');
        return;
      }

      setLoading(true);
      const res = registerStudent({ name, email, phone, password });
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed.');
        return;
      }

      if (redirectCourseSlug) {
        if (action === 'enroll_free') {
          onNavigate(`/checkout/${redirectCourseSlug}`);
        } else {
          onNavigate(`/courses/${redirectCourseSlug}`);
        }
      } else {
        onNavigate('/student/dashboard');
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter your email and password.');
        return;
      }

      setLoading(true);
      const res = loginStudent(email, password);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.message || 'Login failed.');
        return;
      }

      if (redirectCourseSlug) {
        onNavigate(`/courses/${redirectCourseSlug}`);
      } else {
        onNavigate('/student/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#2B060B] text-white p-6 text-center space-y-2 border-b border-[#C5A059]/40">
          <div className="inline-flex p-3 rounded-full bg-white/10 text-[#C5A059] mb-1">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-light">AK COUTURE Fashion Academy</h2>
          <p className="text-xs text-stone-300 font-light">
            {activeTab === 'register'
              ? 'Create your Student Account to access courses & certificates'
              : 'Sign in to access your enrolled courses and assessments'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 text-xs font-semibold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3.5 text-center transition-colors cursor-pointer ${
              activeTab === 'register'
                ? 'border-b-2 border-[#58111A] text-[#58111A] bg-stone-50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            New Student Register
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3.5 text-center transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'border-b-2 border-[#58111A] text-[#58111A] bg-stone-50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Student Login
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaspreet Kaur"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#58111A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#58111A]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#58111A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#58111A]"
              />
            </div>
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#58111A]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#58111A] hover:bg-[#6D1621] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Processing...' : activeTab === 'register' ? 'Register & Start Learning' : 'Log In to Dashboard'}
          </button>

          {activeTab === 'login' && (
            <div className="text-center pt-2">
              <span className="text-xs text-stone-500">Demo student account: </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('student@akcoutcher.com');
                  setPassword('password123');
                }}
                className="text-xs text-[#58111A] font-medium underline"
              >
                Auto-fill Demo Credentials
              </button>
            </div>
          )}
        </form>

        {/* Footer info */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 text-center text-[11px] text-stone-500">
          Enrolled students receive unlimited access to course videos and personalized certificates.
        </div>
      </div>
    </div>
  );
};
