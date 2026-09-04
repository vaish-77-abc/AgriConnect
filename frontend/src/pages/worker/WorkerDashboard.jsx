import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Star, 
  MapPin, 
  IndianRupee, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import JobCard from '../../components/JobCard';

export default function WorkerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkerData = async () => {
    try {
      setLoading(true);
      const [appsRes, jobsRes] = await Promise.all([
        api.get('/api/applications/my-applications'),
        api.get('/api/jobs?limit=4'),
      ]);
      setApplications(appsRes.data || []);
      setRecommendedJobs(jobsRes.data || []);
    } catch (err) {
      console.error('Failed to load worker dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerData();
  }, []);

  const appliedCount = applications.length;
  const acceptedCount = applications.filter((a) => a.status === 'accepted').length;
  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
            👷 {t('dashboard.workerWelcome')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Namaste, {user?.name || 'Worker'}!
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            Find nearby farm work with fair daily wages and build your verified agricultural reputation.
          </p>
        </div>

        <Link
          to="/worker/find-jobs"
          className="z-10 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <Search className="w-5 h-5 text-emerald-700" />
          <span>{t('nav.findJobs')}</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{appliedCount}</div>
            <div className="text-xs text-slate-500 font-medium">{t('dashboard.appliedJobs')}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{acceptedCount}</div>
            <div className="text-xs text-slate-500 font-medium">{t('dashboard.acceptedJobs')}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{pendingCount}</div>
            <div className="text-xs text-slate-500 font-medium">Pending Review</div>
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

      {/* Recommended Jobs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t('dashboard.recommendedJobs')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore immediate openings matching your location and skills</p>
          </div>
          <Link
            to="/worker/find-jobs"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            {t('dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center text-xs text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
            Loading recommended jobs...
          </div>
        ) : recommendedJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
            <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No active job listings right now</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              New farm jobs are posted daily across seasons. Check back soon or search by district.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => {
              const hasApplied = applications.some((a) => a.job_id === job.id);
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  isApplied={hasApplied}
                  onApply={() => navigate(`/worker/find-jobs?apply=${job.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* My Applications Quick Peek */}
      {applications.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">{t('dashboard.recentApplications')}</h3>
            <Link to="/worker/my-applications" className="text-xs font-bold text-emerald-700 hover:underline">
              View All Applications ({applications.length}) →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.slice(0, 4).map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">{app.job?.title || 'Farm Job'}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{app.job?.location_name || 'Farm'}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-800">₹{app.job?.wage}/day</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                    app.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : app.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
