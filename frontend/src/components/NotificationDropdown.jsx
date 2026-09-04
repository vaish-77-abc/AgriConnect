import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, Clock, AlertCircle, Briefcase, MessageSquare, Star } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'application_received':
      case 'application_accepted':
      case 'application_rejected':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'new_review':
        return <Star className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 border border-slate-100 z-50 overflow-hidden">
          <div className="p-3.5 bg-gradient-to-r from-emerald-800 to-green-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <h3 className="font-semibold text-sm">{t('nav.notifications')}</h3>
              {unreadCount > 0 && (
                <span className="bg-emerald-600/60 px-2 py-0.5 rounded-full text-xs font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-100 hover:text-white flex items-center gap-1 hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    n.is_read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/50 hover:bg-emerald-50'
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-lg bg-white shadow-xs border border-slate-100 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold ${n.is_read ? 'text-slate-700' : 'text-emerald-950'}`}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(n.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
