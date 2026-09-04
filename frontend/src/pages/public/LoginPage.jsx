import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, LogIn, Lock, Mail, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || null;

  const formatErrorMessage = (data) => {
    if (!data) return 'Invalid email or password. Please verify your credentials.';
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map((e) => e.msg || e.message || JSON.stringify(e)).join(', ');
    }
    return data.message || 'Invalid email or password. Please verify your credentials.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email.trim().toLowerCase(), password);
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'farmer') {
        navigate('/farmer/dashboard', { replace: true });
      } else {
        navigate('/worker/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(formatErrorMessage(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const fillDemoFarmer = () => {
    setEmail('farmer.ramesh@agriconnect.com');
    setPassword('farmer123');
  };

  const fillDemoWorker = () => {
    setEmail('worker.santosh@agriconnect.com');
    setPassword('worker123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-green-500 to-amber-500"></div>

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">{t('auth.loginTitle')}</h2>
          <p className="text-xs text-slate-500">{t('auth.loginSubtitle')}</p>
        </div>

        {/* Demo Fast Fill Buttons for convenient testing */}
        <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/70 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Quick Demo Auto-Fill:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoFarmer}
              className="py-1.5 px-2 bg-white text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 shadow-2xs transition-colors text-center"
            >
              👨‍🌾 {t('auth.demoFarmer')}
            </button>
            <button
              type="button"
              onClick={fillDemoWorker}
              className="py-1.5 px-2 bg-white text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 shadow-2xs transition-colors text-center"
            >
              👷 {t('auth.demoWorker')}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t('auth.signInBtn')}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{t('auth.noAccount')} </span>
          <Link to="/register" className="font-bold text-emerald-700 hover:underline">
            {t('nav.register')}
          </Link>
        </div>
      </div>
    </div>
  );
}
