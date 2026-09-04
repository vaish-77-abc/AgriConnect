import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Briefcase, 
  ChevronRight, 
  Clock, 
  Navigation,
  CheckCircle2
} from 'lucide-react';

export default function JobCard({ job, onApply, isApplied, isFarmerView, onViewApplications }) {
  const { t } = useTranslation();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">● {t('jobs.open')}</span>;
      case 'worker_selected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">● {t('jobs.workerSelected')}</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">● {t('jobs.inProgress')}</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">✓ {t('jobs.completed')}</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">✕ {t('jobs.cancelled')}</span>;
      default:
        return null;
    }
  };

  const getWorkTypeColor = (type) => {
    switch (type) {
      case 'harvesting': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'planting': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'irrigation': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'tractor': return 'bg-purple-50 text-purple-800 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group hover:border-emerald-300 relative overflow-hidden">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>

      <div>
        {/* Header: Work Type Badge & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getWorkTypeColor(job.work_type)}`}>
            {job.work_type ? job.work_type.replace('_', ' ') : 'General Labor'}
          </span>
          {getStatusBadge(job.status)}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
          {job.title}
        </h3>

        {/* Farmer Name / Location */}
        <div className="mt-2 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-700">{job.location_name || 'Rural Farm'}</span>
            {job.distance_km !== undefined && job.distance_km !== null && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                <Navigation className="w-2.5 h-2.5" />
                {typeof job.distance_km === 'number' ? job.distance_km.toFixed(1) : job.distance_km} km
              </span>
            )}
          </div>

          {job.farmer && (
            <div className="text-[11px] text-slate-500">
              {t('jobs.postedBy')}: <span className="font-medium text-slate-700">{job.farmer.name || 'Farmer'}</span>
            </div>
          )}
        </div>

        {/* Description snippet */}
        {job.description && (
          <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            {job.description}
          </p>
        )}

        {/* Grid Stats: Wage, Workers, Dates */}
        <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/80">
            <div className="text-[10px] text-emerald-800 font-medium">{t('jobs.wage')}</div>
            <div className="text-sm font-bold text-emerald-900 flex items-center">
              <span>₹{job.wage}</span>
              <span className="text-[10px] text-emerald-700 font-normal ml-1">
                /{job.wage_type === 'hourly' ? 'hr' : 'day'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">{t('jobs.workersNeeded')}</div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{job.workers_needed || 1} required</span>
            </div>
          </div>
        </div>

        {/* Date line */}
        {(job.start_date || job.end_date) && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {formatDate(job.start_date)} {job.end_date ? `to ${formatDate(job.end_date)}` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {isFarmerView ? (
          <button
            onClick={() => onViewApplications && onViewApplications(job)}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Users className="w-4 h-4" />
            <span>{t('jobs.viewApplications')}</span>
            {job.applications_count !== undefined && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                {job.applications_count}
              </span>
            )}
          </button>
        ) : (
          <>
            {isApplied ? (
              <div className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('jobs.applied')}</span>
              </div>
            ) : (
              <button
                onClick={() => onApply && onApply(job)}
                disabled={job.status !== 'open'}
                className={`w-full flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  job.status === 'open'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{t('jobs.applyNow')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
