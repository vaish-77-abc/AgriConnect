import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  PlusCircle, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  MapPin, 
  IndianRupee,
  MessageSquare,
  Star,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import JobCard from '../../components/JobCard';

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/jobs/my-jobs');
        setJobs(res.data || []);
      } catch (err) {
        console.error('Failed to fetch farmer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Calculate metrics
  const activeJobsCount = jobs.filter((j) => j.status === 'open' || j.status === 'in_progress' || j.status === 'worker_selected').length;
  const completedJobsCount = jobs.filter((j) => j.status === 'completed').length;
  const totalApplicants = jobs.reduce((acc, curr) => acc + (curr.applications_count || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            👨‍🌾 {t('dashboard.farmerWelcome')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
            Manage your farm job postings, review applicant worker profiles, and hire labor quickly.
          </p>
        </div>

        <Link
          to="/farmer/post-job"
          className="z-10 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t('jobs.postNewJob')}</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{activeJobsCount}</div>
            <div className="text-xs text-slate-500 font-medium">{t('dashboard.activeJobs')}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalApplicants}</div>
            <div className="text-xs text-slate-500 font-medium">{t('dashboard.totalApplicants')}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{completedJobsCount}</div>
            <div className="text-xs text-slate-500 font-medium">{t('dashboard.completedJobs')}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {user?.rating ? user.rating.toFixed(1) : '5.0'} / 5
            </div>
            <div className="text-xs text-slate-500 font-medium">{t('dashboard.avgRating')}</div>
          </div>
        </div>
      </div>

      {/* Main Content: Recent Jobs Posted */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t('dashboard.recentJobs')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Your currently listed farm requirements</p>
          </div>
          <Link
            to="/farmer/my-jobs"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            {t('dashboard.viewAll')} ({jobs.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center text-xs text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
            Loading your farm jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">{t('dashboard.noJobs')}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Post your harvesting, sowing, irrigation, or labor needs and receive applications from nearby skilled workers.
            </p>
            <Link
              to="/farmer/post-job"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('jobs.postNewJob')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 6).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isFarmerView={true}
                onViewApplications={(j) => navigate(`/farmer/jobs/${j.id}/applications`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
