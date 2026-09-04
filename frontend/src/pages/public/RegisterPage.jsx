import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, UserPlus, Lock, Mail, Phone, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'worker' ? 'worker' : 'farmer';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const formatErrorMessage = (data) => {
    if (!data) return 'Failed to create account. Please check your details.';
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map((e) => e.msg || e.message || JSON.stringify(e)).join(', ');
    }
    return data.message || 'Failed to create account. Please check your details.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsAlreadyRegistered(false);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid complete email address (e.g. name@gmail.com).');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const newUser = await register({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        phone: phone.trim() || undefined,
        password: password,
        role: role,
      });

      if (newUser.role === 'farmer') {
        navigate('/farmer/dashboard', { replace: true });
      } else {
        navigate('/worker/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errMsg = formatErrorMessage(err.response?.data);
      if (errMsg.toLowerCase().includes('already registered')) {
        setIsAlreadyRegistered(true);
        setError('This email is already registered. You can directly log in with your password.');
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-green-500 to-amber-500"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">{t('auth.registerTitle')}</h2>
          <p className="text-xs text-slate-500">{t('auth.registerSubtitle')}</p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">{t('auth.selectRole')}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                role === 'farmer'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {role === 'farmer' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-3 right-3" />
              )}
              <div className="text-2xl mb-1">👨‍🌾</div>
              <div className="text-xs font-bold text-slate-900">{t('auth.farmerRole')}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Post jobs & hire farm workers</div>
            </button>

            <button
              type="button"
              onClick={() => setRole('worker')}
              className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                role === 'worker'
                  ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {role === 'worker' && (
                <CheckCircle2 className="w-4 h-4 text-amber-600 absolute top-3 right-3" />
              )}
              <div className="text-2xl mb-1">👷</div>
              <div className="text-xs font-bold text-slate-900">{t('auth.workerRole')}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Find farm work & earn daily wages</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex flex-col gap-1.5 text-xs text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
            {isAlreadyRegistered && (
              <Link
                to="/login"
                className="ml-6 inline-flex items-center text-xs font-bold text-emerald-700 hover:underline"
              >
                Go to Login Page →
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.fullName')}</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Balasaheb Shinde"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.phone')}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 ${
              role === 'farmer'
                ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{t('auth.createAccountBtn')}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{t('auth.haveAccount')} </span>
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            {t('nav.login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
