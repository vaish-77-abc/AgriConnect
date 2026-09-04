import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  MapPin, 
  Phone, 
  Check, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Star, 
  Briefcase,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function WorkerProfilePage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [locationName, setLocationName] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/users/profile');
        const data = res.data;
        setName(data.name || '');
        setPhone(data.phone || '');
        if (data.worker_profile) {
          setSkills(data.worker_profile.skills || '');
          setExperienceYears(data.worker_profile.experience_years ? String(data.worker_profile.experience_years) : '');
          setHourlyRate(data.worker_profile.hourly_rate ? String(data.worker_profile.hourly_rate) : '');
          setLocationName(data.worker_profile.location_name || '');
          setBio(data.worker_profile.bio || '');
        }
      } catch (err) {
        console.error('Failed to load worker profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Update basic user info
      await api.put('/api/users/profile', {
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      updateUser({ name: name.trim(), phone: phone.trim() });

      // 2. Update worker profile
      await api.post('/api/users/worker-profile', {
        skills: skills.trim() || undefined,
        experience_years: experienceYears ? parseInt(experienceYears, 10) : undefined,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        location_name: locationName.trim() || undefined,
        bio: bio.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update worker profile:', err);
      setError(err.response?.data?.detail || 'Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-6">
        {/* Header & Avatar */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {name ? name.charAt(0).toUpperCase() : 'W'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{name || 'Worker Profile'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                👷 Agricultural Worker
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>Trust Rating: {user?.rating ? user.rating.toFixed(1) : '5.0'} / 5</span>
            </div>
          </div>
        </div>

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('profile.savedSuccess')}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('auth.fullName')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('auth.phone')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-amber-950 mb-3">{t('profile.workerProfile')}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('profile.skills')}</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder={t('profile.skillsPlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('profile.experienceYears')}</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('profile.hourlyRate')}</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="e.g. 600"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Village / Town Location</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Shirur, Pune"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('profile.bio')}</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t('profile.bioPlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{t('profile.saveProfile')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
