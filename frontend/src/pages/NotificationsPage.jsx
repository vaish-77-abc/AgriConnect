import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bell, 
  CheckCheck, 
  Check, 
  Clock, 
  Briefcase, 
  MessageSquare, 
  Star, 
  AlertCircle 
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'application_received':
      case 'application_accepted':
      case 'application_rejected':
        return <Briefcase className="w-5 h-5 text-emerald-600" />;
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'new_review':
        return <Star className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{t('nav.notifications')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Stay updated on job applications, hiring decisions, and messages</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors self-start sm:self-auto border border-emerald-200"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Bell className="w-12 h-12 mx-auto text-slate-300 opacity-60" />
            <h3 className="text-sm font-bold text-slate-700">No notifications found</h3>
            <p className="text-xs text-slate-500">You're all caught up with your updates!</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={`p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                n.is_read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/60 hover:bg-emerald-50'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-white shadow-xs border border-slate-100 shrink-0">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold ${n.is_read ? 'text-slate-800' : 'text-emerald-950'}`}>
                    {n.title}
                  </h4>
                  {!n.is_read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {n.message}
                </p>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(n.created_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
