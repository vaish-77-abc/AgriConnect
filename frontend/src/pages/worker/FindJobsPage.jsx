import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  MapPin, 
  Navigation, 
  IndianRupee, 
  Briefcase, 
  CheckCircle2, 
  Loader2, 
  X, 
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import JobCard from '../../components/JobCard';

export default function FindJobsPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isWorker } = useAuth();
  const [searchParams] = useSearchParams();

  // Search & Filter State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [workType, setWorkType] = useState(searchParams.get('type') || '');
  const [minWage, setMinWage] = useState('');
  const [radiusKm, setRadiusKm] = useState('50');
  const [userLat, setUserLat] = useState('');
  const [userLng, setUserLng] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);

  // Data & Modal State
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Apply Modal
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [applyNote, setApplyNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (workType) params.append('work_type', workType);
      if (minWage) params.append('min_wage', minWage);
      if (userLat && userLng) {
        params.append('latitude', userLat);
        params.append('longitude', userLng);
        if (radiusKm) params.append('radius_km', radiusKm);
      }

      const res = await api.get(`/api/jobs?${params.toString()}`);
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    if (!isAuthenticated || !isWorker) return;
    try {
      const res = await api.get('/api/applications/my-applications');
      setMyApplications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, [workType]);

  const handleGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude.toFixed(6));
        setUserLng(pos.coords.longitude.toFixed(6));
        setDetectingGps(false);
        // Automatically re-fetch with GPS coords
        setTimeout(fetchJobs, 100);
      },
      (err) => {
        console.warn('GPS error:', err);
        // Fallback default coordinates (Pune agriculture belt)
        setUserLat('18.5204');
        setUserLng('73.8567');
        setDetectingGps(false);
        setTimeout(fetchJobs, 100);
      },
      { timeout: 8000 }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const openApplyModal = (job) => {
    setApplyModalJob(job);
    setApplyNote('');
    setApplyError('');
    setApplySuccess(false);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!applyModalJob) return;

    setApplying(true);
    setApplyError('');

    try {
      await api.post('/api/applications', {
        job_id: applyModalJob.id,
        note: applyNote.trim() || undefined,
      });
      setApplySuccess(true);
      await fetchMyApplications();
      setTimeout(() => {
        setApplyModalJob(null);
      }, 1500);
    } catch (err) {
      console.error('Application submit error:', err);
      setApplyError(err.response?.data?.detail || 'Failed to submit application. You may have already applied.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Agricultural Job Marketplace
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          {t('jobs.findWorkTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Browse daily and seasonal agricultural labor openings with verified wages and distance calculation.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t('jobs.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Work Category */}
          <div>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
            >
              <option value="">{t('jobs.filterWorkType')}</option>
              <option value="harvesting">🌾 {t('categories.harvesting')}</option>
              <option value="planting">🌱 {t('categories.planting')}</option>
              <option value="irrigation">💧 {t('categories.irrigation')}</option>
              <option value="tractor">🚜 {t('categories.tractor')}</option>
              <option value="weeding">🌿 {t('categories.weeding')}</option>
              <option value="pesticide">🧪 {t('categories.pesticide')}</option>
              <option value="tilling">⛏️ {t('categories.tilling')}</option>
              <option value="other">🧑‍🌾 {t('categories.other')}</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Jobs</span>
          </button>
        </form>

        {/* Location & Wage Filters Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGpsLocation}
              disabled={detectingGps}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-colors ${
                userLat
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {detectingGps ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>{userLat ? 'GPS Active (Showing Distance)' : 'Use GPS Near Me'}</span>
            </button>

            {userLat && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">{t('jobs.filterRadius')}</span>
                <select
                  value={radiusKm}
                  onChange={(e) => {
                    setRadiusKm(e.target.value);
                    setTimeout(fetchJobs, 50);
                  }}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="10">Within 10 km</option>
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km</option>
                  <option value="100">Within 100 km</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">{t('jobs.filterWage')}</span>
            <input
              type="number"
              placeholder="e.g. 500"
              value={minWage}
              onChange={(e) => setMinWage(e.target.value)}
              className="w-24 px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-slate-50 font-bold"
            />
            <button
              type="button"
              onClick={fetchJobs}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-bold text-slate-700"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Listing */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
          Finding matching farm jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">{t('jobs.noJobsFound')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try expanding your search distance or removing category filters to see more listings.
          </p>
          <button
            onClick={() => {
              setKeyword('');
              setWorkType('');
              setMinWage('');
              setUserLat('');
              setUserLng('');
              fetchJobs();
            }}
            className="px-4 py-2 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-200"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const hasApplied = myApplications.some((a) => a.job_id === job.id);
            return (
              <JobCard
                key={job.id}
                job={job}
                isApplied={hasApplied}
                onApply={() => openApplyModal(job)}
              />
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setApplyModalJob(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Submit Application</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{applyModalJob.title}</p>
            </div>

            {/* Job Summary Banner */}
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 text-xs space-y-1 mb-4">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <span>Wage: ₹{applyModalJob.wage} / {applyModalJob.wage_type === 'hourly' ? 'hour' : 'day'}</span>
                <span>{applyModalJob.workers_needed} Workers Needed</span>
              </div>
              <div className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                {applyModalJob.location_name}
              </div>
            </div>

            {applySuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Application Sent!</h4>
                <p className="text-xs text-slate-500">
                  The farmer has been notified. You can track status under "My Applications".
                </p>
              </div>
            ) : (
              <form onSubmit={submitApplication} className="space-y-4">
                {applyError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{applyError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message / Note to Farmer (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={applyNote}
                    onChange={(e) => setApplyNote(e.target.value)}
                    placeholder="e.g. I have 4 years experience in wheat harvesting and can start on Monday..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalJob(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    {applying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
