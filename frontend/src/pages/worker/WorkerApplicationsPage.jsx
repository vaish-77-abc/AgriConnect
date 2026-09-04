import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Star, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ChevronRight,
  User
} from 'lucide-react';
import api from '../../services/api';
import MessageModal from '../../components/MessageModal';
import ReviewModal from '../../components/ReviewModal';

export default function WorkerApplicationsPage() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/applications/my-applications');
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to load worker applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openChat = (farmerUser, job) => {
    setSelectedFarmer(farmerUser);
    setSelectedJob(job);
    setChatModalOpen(true);
  };

  const openReview = (farmerUser, job) => {
    setSelectedFarmer(farmerUser);
    setSelectedJob(job);
    setReviewModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3 h-3" /> {t('applications.pending')}</span>;
      case 'accepted':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> {t('applications.accepted')}</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200"><XCircle className="w-3 h-3" /> {t('applications.rejected')}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{t('applications.myApplicationsTitle')}</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Track status of jobs you applied for and contact farmers</p>
      </div>

      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
          Loading your applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <FileText className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">{t('applications.noApplications')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't applied to any farm jobs yet. Browse open listings to find work!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.job;
            const farmer = job?.farmer;

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-emerald-300 transition-colors"
              >
                {/* Job details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {job?.work_type}
                    </span>
                    {getStatusBadge(app.status)}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{job?.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {job?.location_name}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-900">
                      <IndianRupee className="w-3.5 h-3.5" />
                      ₹{job?.wage} /{job?.wage_type === 'hourly' ? 'hr' : 'day'}
                    </span>
                    {farmer && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <User className="w-3.5 h-3.5" />
                        Farmer: <span className="font-semibold text-slate-700">{farmer.name}</span>
                      </span>
                    )}
                  </div>

                  {app.note && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                      <span className="font-semibold text-slate-700">Your note: </span>"{app.note}"
                    </div>
                  )}
                </div>

                {/* Actions & Contact */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  {farmer?.phone && app.status === 'accepted' && (
                    <a
                      href={`tel:${farmer.phone}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      title="Call Farmer"
                    >
                      <Phone className="w-4 h-4 text-emerald-700" />
                      <span>Call {farmer.phone}</span>
                    </a>
                  )}

                  {farmer && (
                    <button
                      type="button"
                      onClick={() => openChat(farmer, job)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat Farmer</span>
                    </button>
                  )}

                  {app.status === 'accepted' && (
                    <button
                      type="button"
                      onClick={() => openReview(farmer, job)}
                      className="px-3.5 py-2 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>Rate Farmer</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Modal */}
      {chatModalOpen && selectedFarmer && selectedJob && (
        <MessageModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          otherUser={selectedFarmer}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
        />
      )}

      {/* Review Modal */}
      {reviewModalOpen && selectedFarmer && selectedJob && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          revieweeUser={selectedFarmer}
          jobId={selectedJob.id}
          onSuccess={() => alert('Farmer review submitted successfully!')}
        />
      )}
    </div>
  );
}
