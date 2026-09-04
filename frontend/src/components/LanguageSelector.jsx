import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { changeLanguage } from '../i18n';

const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
];

export default function LanguageSelector({ variant = 'default' }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          variant === 'pill'
            ? 'bg-emerald-100/80 text-emerald-900 hover:bg-emerald-200 border border-emerald-300/60'
            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs'
        }`}
      >
        <Globe className="w-4 h-4 text-emerald-600" />
        <span className="font-semibold text-xs tracking-wider">{currentLang.flag} {currentLang.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 border border-slate-100 py-1.5 z-50 focus:outline-hidden">
          <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                i18n.language === lang.code
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.native}</span>
                <span className="text-xs text-slate-400">({lang.name})</span>
              </div>
              {i18n.language === lang.code && <Check className="w-4 h-4 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
