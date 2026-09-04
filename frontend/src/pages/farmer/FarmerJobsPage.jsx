import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  PlusCircle, 
  Briefcase, 
  Users, 
  MapPin, 
  Calendar, 
  Loader2, 
  ChevronRight,
  MoreVertical,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare
} from 'lucide-react';
import api from '../../services/api';
import JobCard from '../../components/JobCard';

export default function FarmerJobsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/jobs/my-jobs');
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to load farmer jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      setUpdatingId(jobId);
      await api.put(`/api/jobs/${jobId}/status`, { status: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update job status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (statusFilter === 'all') return true;
    return j.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{t('nav.myJobs')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage all your posted farm employment openings</p>
        </div>

        <Link
          to="/farmer/post-job"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('jobs.postNewJob')}</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Jobs' },
          { id: 'open', label: t('jobs.open') },
          { id: 'worker_selected', label: t('jobs.workerSelected') },
          { id: 'in_progress', label: t('jobs.inProgress') },
          { id: 'completed', label: t('jobs.completed') },
          { id: 'cancelled', label: t('jobs.cancelled') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === tab.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
          Loading your farm postings...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">No jobs found in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try choosing a different status tab or create a new job posting.
          </p>
          <Link
            to="/farmer/post-job"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('jobs.postNewJob')}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="flex flex-col justify-between">
              <JobCard
                job={job}
                isFarmerView={true}
                onViewApplications={(j) => navigate(`/farmer/jobs/${j.id}/applications`)}
              />

              {/* Status updater dropdown below card */}
              <div className="mt-2 bg-slate-100/80 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">{t('jobs.status')}:</span>
                <select
                  disabled={updatingId === job.id}
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  className="bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="open">🟢 {t('jobs.open')}</option>
                  <option value="worker_selected">🔵 {t('jobs.workerSelected')}</option>
                  <option value="in_progress">🟡 {t('jobs.inProgress')}</option>
                  <option value="completed">✅ {t('jobs.completed')}</option>
                  <option value="cancelled">❌ {t('jobs.cancelled')}</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
