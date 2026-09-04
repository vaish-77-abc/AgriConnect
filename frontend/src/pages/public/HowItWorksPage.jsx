import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  UserPlus, 
  FileText, 
  Users, 
  PhoneCall, 
  Check, 
  Star, 
  Search, 
  Send,
  Sparkles
} from 'lucide-react';

export default function HowItWorksPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('farmer');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Top Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Step-by-Step Guide</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How AgriConnect Works
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Learn how quick and intuitive it is to hire farm workers or find daily agricultural employment.
        </p>
      </div>

      {/* Role Toggle Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-2">
          <button
            onClick={() => setActiveTab('farmer')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'farmer'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span>👨‍🌾 For Farmers (Employers)</span>
          </button>
          <button
            onClick={() => setActiveTab('worker')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'worker'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span>👷 For Workers (Laborers)</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Farmer */}
      {activeTab === 'farmer' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Post Job in 60 Seconds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specify what operation you need done (e.g. Wheat Harvesting, Drip Setup), location, start dates, workers count, and fair daily wage.
              </p>
              <div className="pt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Instant GPS location tagging
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Review Applications</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nearby workers view your job and apply. Inspect their skills, past farm experience, and ratings from other local farmers before accepting.
              </p>
              <div className="pt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> One-click accept / reject
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Work, Pay & Rate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Call or chat directly with selected workers to coordinate arrival. After work is finished, mark job as completed and leave a verified review.
              </p>
              <div className="pt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 100% direct settlement
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/register?role=farmer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all"
            >
              <span>Register as Farmer & Post Job</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab Content: Worker */}
      {activeTab === 'worker' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Create Worker Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add your village location, specialized farm skills (Harvesting, Tractor Operation, Irrigation), and standard daily wage preference.
              </p>
              <div className="pt-2 text-xs text-amber-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Takes only 2 minutes
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Search Nearby Farm Jobs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter jobs by distance (e.g. within 10 km), wage rate, and work type. Hit "Apply" on matching jobs without paying any commission.
              </p>
              <div className="pt-2 text-xs text-amber-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Live distance in km
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Get Hired & Build Ratings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get notified when the farmer accepts you. Receive fair, transparent pay directly on the farm and accumulate 5-star ratings for regular work.
              </p>
              <div className="pt-2 text-xs text-amber-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Build permanent reputation
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/register?role=worker"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all"
            >
              <span>Register as Worker & Find Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
