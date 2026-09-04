import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, ShieldCheck, Users, Heart, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Top Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Sprout className="w-3.5 h-3.5" />
          <span>Our Vision & Heritage</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Bridging the Rural Agricultural Labor Gap
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          AgriConnect is India’s dedicated digital employment platform built exclusively for farmers and agricultural laborers. We replace middleman exploitation with direct, transparent, and technology-driven connections.
        </p>
      </div>

      {/* The Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-red-50/60 p-8 rounded-3xl border border-red-100 space-y-3">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">The Rural Problem</span>
          <h3 className="text-xl font-bold text-slate-900">Critical Harvest Delays & Wage Cuts</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every season, millions of farmers face crop losses due to sudden labor shortages during harvesting and sowing. Meanwhile, skilled rural laborers struggle to find guaranteed daily work, often losing up to 30% of their earnings to local middlemen and contractors.
          </p>
        </div>

        <div className="bg-emerald-50/60 p-8 rounded-3xl border border-emerald-100 space-y-3">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">The AgriConnect Solution</span>
          <h3 className="text-xl font-bold text-slate-900">Direct, Zero-Commission Platform</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            AgriConnect empowers both parties with instant GPS radius discovery, direct in-app messaging/calling, 100% transparent daily wages, and a community reputation system ensuring high-quality work and fair, timely pay.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <h2 className="text-2xl font-black text-slate-900 text-center">Our Core Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Zero Middlemen</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never take a cut from the laborer’s hard-earned daily wages. What the farmer pays is what the worker receives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Rural-First Accessibility</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed for simple low-bandwidth smartphone operation in Marathi, Hindi, and English with clean visual cues.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Dignity & Trust</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Two-way ratings build a lifelong verifiable work reputation for laborers and a trustworthy profile for farm owners.
            </p>
          </div>
        </div>
      </div>

      {/* Join CTA */}
      <div className="bg-emerald-800 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h3 className="text-2xl font-bold">Join the AgriConnect Revolution</h3>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-lg mx-auto">
          Whether you have a 50-acre farm or are a skilled machinery operator, AgriConnect is built for you.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
