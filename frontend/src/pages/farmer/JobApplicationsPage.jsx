import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  ArrowLeft, 
  Check, 
  X, 
  MessageSquare, 
  Phone, 
  Star, 
  Briefcase, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  Calendar,
  IndianRupee,
  MapPin
} from 'lucide-react';
import api from '../../services/api';
import MessageModal from '../../components/MessageModal';
import ReviewModal from '../../components/ReviewModal';

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modals state
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeWorker, setActiveWorker] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/api/jobs/${jobId}`),
        api.get(`/api/applications/job/${jobId}`),
      ]);
      setJob(jobRes.data);
      setApplications(appsRes.data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const handleApplicationAction = async (appId, action) => {
    try {
      setActionLoadingId(appId);
      await api.put(`/api/applications/${appId}/action`, { action });
      await fetchData(); // reload updated list
    } catch (err) {
      console.error('Action failed:', err);
      alert(err.response?.data?.detail || 'Failed to update application');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openChat = (workerUser) => {
    setActiveWorker(workerUser);
    setChatModalOpen(true);
  };

  const openReview = (workerUser) => {
    setActiveWorker(workerUser);
    setReviewModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">⏳ {t('applications.pending')}</span>;
      case 'accepted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ {t('applications.accepted')}</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">✕ {t('applications.rejected')}</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
        Loading applicants...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Job Summary */}
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')} to My Jobs</span>
        </button>

        {job && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {job.work_type}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {job.location_name}
                </span>
                <span className="flex items-center gap-1 font-bold text-emerald-800">
                  <IndianRupee className="w-3.5 h-3.5" />
                  ₹{job.wage} /{job.wage_type === 'hourly' ? 'hr' : 'day'}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {job.workers_needed} required
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 text-center">
              <div className="text-lg font-black text-emerald-900">{applications.length}</div>
              <div className="text-[10px] font-bold text-emerald-700 uppercase">Applicants</div>
            </div>
          </div>
        )}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">{t('applications.title')}</h2>

        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">{t('applications.noApplications')}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Nearby workers will be notified about your job posting. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const worker = app.worker;
              const profile = worker?.worker_profile;
              const isActionLoading = actionLoadingId === app.id;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-emerald-300 transition-colors"
                >
                  {/* Worker Information */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-bold flex items-center justify-center text-base shrink-0 shadow-xs">
                      {worker?.name ? worker.name.charAt(0).toUpperCase() : 'W'}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{worker?.name}</h3>
                        {getStatusBadge(app.status)}
                      </div>

                      {/* Rating & Phone */}
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          {worker?.rating ? worker.rating.toFixed(1) : '5.0'} / 5
                        </span>
                        {worker?.phone && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Phone className="w-3.5 h-3.5" />
                            {worker.phone}
                          </span>
                        )}
                      </div>

                      {/* Skills & Experience */}
                      {profile && (
                        <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                          {profile.skills && (
                            <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                              🌾 {profile.skills}
                            </span>
                          )}
                          {profile.experience_years !== undefined && (
                            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md font-medium">
                              {profile.experience_years} yrs exp
                            </span>
                          )}
                          {profile.hourly_rate && (
                            <span className="bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-md font-medium">
                              ₹{profile.hourly_rate}/day expected
                            </span>
                          )}
                        </div>
                      )}

                      {app.note && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                          "{app.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {/* Chat button */}
                    <button
                      type="button"
                      onClick={() => openChat(worker)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{t('applications.messageWorker')}</span>
                    </button>

                    {/* Accept / Reject if pending */}
                    {app.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleApplicationAction(app.id, 'reject')}
                          className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>{t('applications.reject')}</span>
                        </button>

                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleApplicationAction(app.id, 'accept')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                        >
                          {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          <span>{t('applications.accept')}</span>
                        </button>
                      </>
                    )}

                    {/* Leave Review if accepted and completed */}
                    {app.status === 'accepted' && (
                      <button
                        type="button"
                        onClick={() => openReview(worker)}
                        className="px-3.5 py-2 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{t('reviews.leaveReview')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {chatModalOpen && activeWorker && (
        <MessageModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          otherUser={activeWorker}
          jobId={jobId}
          jobTitle={job?.title}
        />
      )}

      {/* Review Modal */}
      {reviewModalOpen && activeWorker && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          revieweeUser={activeWorker}
          jobId={jobId}
          onSuccess={() => alert('Review submitted successfully!')}
        />
      )}
    </div>
  );
}
