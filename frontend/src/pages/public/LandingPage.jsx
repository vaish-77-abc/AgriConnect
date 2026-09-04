import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  IndianRupee,
  Navigation,
  Star,
  Quote
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import JobCard from '../../components/JobCard';

export default function LandingPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isFarmer, isWorker } = useAuth();
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        setLoadingJobs(true);
        const res = await api.get('/api/jobs?limit=3');
        setFeaturedJobs(res.data || []);
      } catch (err) {
        console.log('Error fetching preview jobs:', err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchRecentJobs();
  }, []);

  const handleNeedWorkers = () => {
    if (isAuthenticated) {
      if (isFarmer) navigate('/farmer/post-job');
      else navigate('/farmer/dashboard');
    } else {
      navigate('/register?role=farmer');
    }
  };

  const handleNeedWork = () => {
    if (isAuthenticated) {
      if (isWorker) navigate('/worker/find-jobs');
      else navigate('/find-jobs');
    } else {
      navigate('/register?role=worker');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ─── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pb-24 lg:pt-12">
        {/* Background decorative gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-400/40 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300/80 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              {t('hero.title').split(',')[0]}, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-green-600">
                {t('hero.title').split(',')[1] || 'Connecting Skilled Workers'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Dual CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleNeedWorkers}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-700/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>{t('hero.needWorkersBtn')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleNeedWork}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>{t('hero.needWorkBtn')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="text-lg sm:text-xl font-black text-emerald-800">5,000+</div>
                <div className="text-xs text-slate-500 font-medium">Verified Farmers</div>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="text-lg sm:text-xl font-black text-emerald-800">12,000+</div>
                <div className="text-xs text-slate-500 font-medium">Skilled Workers</div>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="text-lg sm:text-xl font-black text-emerald-800">25,000+</div>
                <div className="text-xs text-slate-500 font-medium">Days Worked</div>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="text-lg sm:text-xl font-black text-amber-600 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500" />
                  4.9 / 5
                </div>
                <div className="text-xs text-slate-500 font-medium">Trust Score</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── KEY PILLARS / FEATURES ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('features.title')}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-emerald-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">{t('features.f1Title')}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t('features.f1Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-emerald-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">{t('features.f2Title')}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t('features.f2Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-emerald-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">{t('features.f3Title')}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t('features.f3Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-emerald-300">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">{t('features.f4Title')}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t('features.f4Desc')}</p>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (SIDE BY SIDE) ───────────────────────────────────────── */}
      <section className="bg-emerald-900 text-white py-16 sm:py-20 rounded-3xl max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Simple & Transparent</span>
          <h2 className="text-2xl sm:text-4xl font-black mt-1">{t('howItWorks.title')}</h2>
          <p className="mt-2 text-sm text-emerald-200">{t('howItWorks.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Farmers side */}
          <div className="bg-emerald-950/70 p-6 sm:p-8 rounded-3xl border border-emerald-700/60 backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg">
                👨‍🌾
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{t('howItWorks.forFarmers')}</h3>
                <p className="text-xs text-emerald-300">Quickly hire reliable farm hands</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-sm text-white">{t('howItWorks.farmerStep1Title')}</h4>
                  <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{t('howItWorks.farmerStep1Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-sm text-white">{t('howItWorks.farmerStep2Title')}</h4>
                  <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{t('howItWorks.farmerStep2Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-sm text-white">{t('howItWorks.farmerStep3Title')}</h4>
                  <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{t('howItWorks.farmerStep3Desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workers side */}
          <div className="bg-emerald-950/70 p-6 sm:p-8 rounded-3xl border border-emerald-700/60 backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg">
                👷
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{t('howItWorks.forWorkers')}</h3>
                <p className="text-xs text-emerald-300">Find regular farm jobs near you</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-sm text-white">{t('howItWorks.workerStep1Title')}</h4>
                  <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{t('howItWorks.workerStep1Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-sm text-white">{t('howItWorks.workerStep2Title')}</h4>
                  <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{t('howItWorks.workerStep2Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-sm text-white">{t('howItWorks.workerStep3Title')}</h4>
                  <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{t('howItWorks.workerStep3Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── POPULAR CATEGORIES ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t('categories.title')}</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Direct labor matching across all farming operations</p>
          </div>
          <Link
            to="/find-jobs"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Explore All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { icon: '🌾', label: t('categories.harvesting'), type: 'harvesting', count: '45+ Openings' },
            { icon: '🌱', label: t('categories.planting'), type: 'planting', count: '30+ Openings' },
            { icon: '💧', label: t('categories.irrigation'), type: 'irrigation', count: '20+ Openings' },
            { icon: '🚜', label: t('categories.tractor'), type: 'tractor', count: '15+ Openings' },
            { icon: '🌿', label: t('categories.weeding'), type: 'weeding', count: '35+ Openings' },
            { icon: '🧪', label: t('categories.pesticide'), type: 'pesticide', count: '12+ Openings' },
            { icon: '⛏️', label: t('categories.tilling'), type: 'tilling', count: '18+ Openings' },
            { icon: '🧑‍🌾', label: t('categories.other'), type: 'other', count: '50+ Openings' },
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={`/find-jobs?type=${cat.type}`}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {cat.label}
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── LIVE RECENT JOBS PREVIEW ───────────────────────────────────────────── */}
      {featuredJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Live Openings</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">Recently Posted Farm Jobs</h2>
            </div>
            <Link
              to="/find-jobs"
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              View All Jobs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={() => handleNeedWork()}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS / TRUST ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Stories from the Field</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Trusted by Farmers & Laborers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative">
            <Quote className="w-8 h-8 text-emerald-200 absolute top-4 right-4" />
            <div className="flex items-center gap-1 text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "During our sugarcane harvest in Kolhapur, we couldn't find enough hands. Through AgriConnect, 6 experienced workers applied within 2 hours. Seamless work!"
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                RB
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Ramesh Patil</div>
                <div className="text-[10px] text-slate-500">Sugarcane Farmer, Maharashtra</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative">
            <Quote className="w-8 h-8 text-emerald-200 absolute top-4 right-4" />
            <div className="flex items-center gap-1 text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "I used to sit at the town junction hoping for daily labor work. Now I check AgriConnect on my phone every evening and have guaranteed work for the whole week."
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                SK
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Santosh Kumar</div>
                <div className="text-[10px] text-slate-500">Agricultural Worker, MP</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative">
            <Quote className="w-8 h-8 text-emerald-200 absolute top-4 right-4" />
            <div className="flex items-center gap-1 text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "The Marathi interface is so simple that my father can easily post our farm requirements. The zero-commission model is a huge blessing for small farmers."
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                AD
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Aniket Deshmukh</div>
                <div className="text-[10px] text-slate-500">Cotton Grower, Pune</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA BANNER ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black">{t('cta.title')}</h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleNeedWorkers}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors"
              >
                {t('cta.farmerAction')}
              </button>
              <button
                onClick={handleNeedWork}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm shadow-md hover:bg-amber-300 transition-colors"
              >
                {t('cta.workerAction')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
