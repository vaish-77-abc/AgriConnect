import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, Phone, Mail, MapPin, Heart, ShieldCheck, Award, Users } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-emerald-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  Agri<span className="text-emerald-400">Connect</span>
                </span>
                <span className="block text-[10px] font-bold text-amber-400 tracking-wider uppercase -mt-1">
                  Kisan Employment Network
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free & Direct</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Profiles</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-emerald-400">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/find-jobs" className="hover:text-emerald-400 transition-colors">
                  {t('nav.findJobs')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Work Categories */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-emerald-400">
              {t('categories.title')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>🌾 {t('categories.harvesting')}</li>
              <li>🌱 {t('categories.planting')}</li>
              <li>💧 {t('categories.irrigation')}</li>
              <li>🚜 {t('categories.tractor')}</li>
              <li>🌿 {t('categories.weeding')}</li>
            </ul>
          </div>

          {/* Helpline & Contact */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-emerald-400">
              {t('footer.contactInfo')}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl">
                <div className="text-xs text-emerald-400 font-semibold mb-1">Kisan Helpline (Toll-Free)</div>
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  1800-AGRI-CONNECT
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Mon - Sat: 6:00 AM to 8:00 PM</div>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>support@agriconnect.org</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Pune / Mumbai / New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t('footer.copyright')}</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for Indian Farmers & Agricultural Workers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
