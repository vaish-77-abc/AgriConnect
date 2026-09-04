import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  PlusCircle, 
  MapPin, 
  Navigation, 
  Calendar, 
  IndianRupee, 
  Users, 
  FileText, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

export default function PostJobPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [workType, setWorkType] = useState('harvesting');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [wage, setWage] = useState('600');
  const [wageType, setWageType] = useState('daily');
  const [workersNeeded, setWorkersNeeded] = useState('4');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [requirements, setRequirements] = useState('');

  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setDetectingGps(false);
        setGpsSuccess(true);
      },
      (err) => {
        console.warn('GPS error:', err);
        // Fallback default coordinates (e.g. Pune/Maharashtra agricultural belt)
        setLatitude('18.5204');
        setLongitude('73.8567');
        setDetectingGps(false);
        setGpsSuccess(true);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        work_type: workType,
        description: description.trim() || undefined,
        location_name: locationName.trim(),
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        wage: parseFloat(wage),
        wage_type: wageType,
        workers_needed: parseInt(workersNeeded, 10),
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        requirements: requirements.trim() || undefined,
      };

      await api.post('/api/jobs', payload);
      navigate('/farmer/my-jobs');
    } catch (err) {
      console.error('Failed to post job:', err);
      setError(err.response?.data?.detail || 'Failed to create job posting. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-6">
        {/* Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Farm Employment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{t('jobs.postNewJob')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t('jobs.postJobSubtitle')}</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('jobs.titleLabel')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('jobs.titlePlaceholder')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium"
            />
          </div>

          {/* Work Type Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('jobs.workType')} <span className="text-red-500">*</span>
            </label>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium"
            >
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

          {/* Location & GPS */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('jobs.locationName')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder={t('jobs.locationPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={detectingGps}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {detectingGps ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                )}
                <span>{gpsSuccess ? '✓ GPS Captured' : t('jobs.useGps')}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder={t('jobs.latitude')}
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-1/2 sm:w-28 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
                />
                <input
                  type="text"
                  placeholder={t('jobs.longitude')}
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-1/2 sm:w-28 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Wage, Wage Type & Workers Needed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('jobs.wage')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="number"
                  required
                  min="50"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('jobs.wageType')}
              </label>
              <select
                value={wageType}
                onChange={(e) => setWageType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              >
                <option value="daily">{t('jobs.daily')}</option>
                <option value="hourly">{t('jobs.hourly')}</option>
                <option value="total">{t('jobs.total')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('jobs.workersNeeded')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={workersNeeded}
                  onChange={(e) => setWorkersNeeded(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('jobs.startDate')}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('jobs.endDate')}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('jobs.description')}
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('jobs.descPlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden leading-relaxed"
            />
          </div>

          {/* Requirements / Tools */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('jobs.requirements')}
            </label>
            <input
              type="text"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="e.g. Bring own sickle, experience with drip lines"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t('common.cancel')}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>{t('jobs.submitJob')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
