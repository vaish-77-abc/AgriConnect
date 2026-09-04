import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  Menu, 
  X, 
  User, 
  LogOut, 
  PlusCircle, 
  Search, 
  Briefcase, 
  LayoutDashboard, 
  MessageSquare, 
  FileText,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, isFarmer, isWorker, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 glass-nav shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 flex items-center gap-1">
                Agri<span className="text-emerald-600">Connect</span>
              </span>
              <span className="block text-[10px] font-bold text-amber-600 tracking-wider uppercase -mt-1">
                Kisan Employment
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.home')}
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/how-it-works') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.howItWorks')}
            </Link>

            {/* Public or Role-based exploration */}
            {!isAuthenticated && (
              <Link
                to="/find-jobs"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/find-jobs') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {t('nav.findJobs')}
              </Link>
            )}

            {/* Farmer Specific Links */}
            {isAuthenticated && isFarmer && (
              <>
                <Link
                  to="/farmer/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/farmer/dashboard') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('nav.dashboard')}
                </Link>

                <Link
                  to="/farmer/my-jobs"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/farmer/my-jobs') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  {t('nav.myJobs')}
                </Link>

                <Link
                  to="/farmer/post-job"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  {t('nav.postJob')}
                </Link>
              </>
            )}

            {/* Worker Specific Links */}
            {isAuthenticated && isWorker && (
              <>
                <Link
                  to="/worker/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/worker/dashboard') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('nav.dashboard')}
                </Link>

                <Link
                  to="/worker/find-jobs"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/worker/find-jobs') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  {t('nav.findJobs')}
                </Link>

                <Link
                  to="/worker/my-applications"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/worker/my-applications') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {t('nav.myApplications')}
                </Link>
              </>
            )}

            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.about')}
            </Link>
          </div>

          {/* Desktop Right Controls: Language, Notifications, User / Login */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />

            {isAuthenticated ? (
              <>
                <NotificationDropdown />

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100/70 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block leading-tight">
                        {user?.name}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">
                        {isFarmer ? '👨‍🌾 ' + t('nav.farmer') : '👷 ' + t('nav.worker')}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black/5 border border-slate-100 py-1.5 z-50"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <Link
                        to={isFarmer ? '/farmer/profile' : '/worker/profile'}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <User className="w-4 h-4" />
                        {t('nav.profile')}
                      </Link>

                      <Link
                        to="/messages"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {t('nav.messages')}
                      </Link>

                      <hr className="my-1 border-slate-100" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all hover:shadow-md"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector variant="pill" />
            {isAuthenticated && <NotificationDropdown />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {isAuthenticated && (
            <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800">{user?.name}</div>
                  <div className="text-xs text-emerald-700 font-medium">
                    {isFarmer ? '👨‍🌾 ' + t('nav.farmer') : '👷 ' + t('nav.worker')}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                {t('nav.logout')}
              </button>
            </div>
          )}

          <div className="flex flex-col space-y-1 text-base font-medium text-slate-700">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
            >
              {t('nav.home')}
            </Link>

            {isAuthenticated && isFarmer && (
              <>
                <Link
                  to="/farmer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/farmer/post-job"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-semibold flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  {t('nav.postJob')}
                </Link>
                <Link
                  to="/farmer/my-jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  {t('nav.myJobs')}
                </Link>
                <Link
                  to="/farmer/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {t('nav.profile')}
                </Link>
              </>
            )}

            {isAuthenticated && isWorker && (
              <>
                <Link
                  to="/worker/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/worker/find-jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-semibold flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  {t('nav.findJobs')}
                </Link>
                <Link
                  to="/worker/my-applications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {t('nav.myApplications')}
                </Link>
                <Link
                  to="/worker/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {t('nav.profile')}
                </Link>
              </>
            )}

            <Link
              to="/find-jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
            >
              {t('nav.findJobs')}
            </Link>

            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
            >
              {t('nav.howItWorks')}
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
            >
              {t('nav.about')}
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
            >
              {t('nav.contact')}
            </Link>
          </div>

          {!isAuthenticated && (
            <div className="pt-4 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-emerald-600 text-emerald-800 font-bold"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
