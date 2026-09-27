import React, { useState } from 'react';
import { AdminUser } from '../../lib/db';
import { useToast } from '../../components/common/Toast';
import { Shield, Key, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSupabase } from '../../lib/supabase';

interface AdminProfilePageProps {
  currentAdmin: AdminUser;
  onLogout: () => void;
}

export const AdminProfilePage: React.FC<AdminProfilePageProps> = ({ currentAdmin, onLogout }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          throw error;
        }
      }
      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="border-b border-stone-800 pb-5">
        <h1 className="font-serif text-3xl text-white font-medium">Admin Security & Credentials</h1>
        <p className="text-xs text-stone-400 mt-1">
          Manage your atelier authentication credentials and administrator profile.
        </p>
      </div>

      {/* Profile info */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
          <User className="w-5 h-5 text-[#C5A059]" />
          <h2 className="font-serif text-xl text-white">Administrator Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-stone-500 uppercase font-semibold block mb-1">Full Name</span>
            <p className="font-medium text-white text-sm">{currentAdmin.name}</p>
          </div>
          <div>
            <span className="text-stone-500 uppercase font-semibold block mb-1">Email Address</span>
            <p className="font-mono text-white text-sm">{currentAdmin.email}</p>
          </div>
          <div>
            <span className="text-stone-500 uppercase font-semibold block mb-1">Security Role</span>
            <p className="font-medium text-[#C5A059] uppercase">{currentAdmin.role}</p>
          </div>
          <div>
            <span className="text-stone-500 uppercase font-semibold block mb-1">Session</span>
            <p className="text-emerald-400 font-medium">Active Secure Session</p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
          <Key className="w-5 h-5 text-[#C5A059]" />
          <h2 className="font-serif text-xl text-white">Update Administrator Password</h2>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold uppercase tracking-wider mb-1">
              New Password (minimum 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 rounded-lg shadow"
            >
              {loading ? 'Updating Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Logout */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg text-white">Sign Out</h3>
          <p className="text-xs text-stone-400">End your active administrative session on this device.</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="px-5 py-2 text-xs font-semibold text-red-300 hover:text-white bg-red-950/60 hover:bg-red-900 border border-red-800/80 rounded-lg transition-colors"
        >
          Sign Out of Admin
        </button>
      </div>
    </div>
  );
};
