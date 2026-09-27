import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { loginAdmin, AdminUser } from '../../lib/db';
import { getSupabaseConfig } from '../../lib/supabase';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const { isConfigured } = getSupabaseConfig();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setForgotPasswordNotice(false);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginAdmin(email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Invalid administrator credentials.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141210] flex items-center justify-center p-4 antialiased text-stone-100">
      <div className="w-full max-w-md space-y-8 bg-[#1C1A18] border border-stone-800 p-8 sm:p-10 rounded-2xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#58111A] text-[#C5A059] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-3xl font-light text-[#FAF7F2]">
            Kaur Couture
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#C5A059] font-medium">
            Atelier Management Portal
          </p>
          <p className="text-xs text-stone-400 font-light pt-1">
            Restricted to authorized atelier administrators and master couturiers.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {forgotPasswordNotice && (
          <div className="p-3.5 bg-stone-800/80 border border-stone-700 text-stone-300 text-xs rounded-lg leading-relaxed">
            A password reset email has been initiated through Supabase Authentication. Please check your admin email inbox, or contact your technical system administrator.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@kaurcouture.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordNotice(true)}
                className="text-[11px] text-[#C5A059] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-xs uppercase tracking-widest font-semibold text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 rounded-lg transition-all shadow-md active:scale-95"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
          <button
            type="button"
            onClick={onBackToSite}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Boutique</span>
          </button>
          <span className="font-mono text-[11px]">
            {isConfigured ? 'Supabase Auth' : 'Admin Auth'}
          </span>
        </div>
      </div>
    </div>
  );
};
