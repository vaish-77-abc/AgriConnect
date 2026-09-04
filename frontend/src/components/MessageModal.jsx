import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, X, MessageSquare, Phone, User, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MessageModal({ isOpen, onClose, otherUser, jobId, jobTitle }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!otherUser?.id || !jobId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/messages/${jobId}/${otherUser.id}`);
      setMessages(res.data || []);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && otherUser && jobId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, otherUser, jobId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res = await api.post('/api/messages', {
        receiver_id: otherUser.id,
        job_id: jobId,
        content: messageText,
      });
      setMessages((prev) => [...prev, res.data]);
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      console.error('Failed to send message:', err);
      setInputText(messageText); // restore on fail
    } finally {
      setSending(false);
    }
  };

  if (!isOpen || !otherUser) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[540px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-emerald-500 flex items-center justify-center font-bold text-sm">
              {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                {otherUser.name}
                <span className="text-[10px] font-medium bg-emerald-700/80 px-2 py-0.5 rounded-full capitalize">
                  {otherUser.role}
                </span>
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5 truncate max-w-[220px]">
                Job: {jobTitle || 'Farm Work'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {otherUser.phone && (
              <a
                href={`tel:${otherUser.phone}`}
                className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
                title={`Call ${otherUser.phone}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message body */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
          {loading && messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
              <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-xs">{t('messages.noMessages')}</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.sender_id === user?.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    <div
                      className={`text-[10px] mt-1 text-right ${
                        isMine ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('messages.typeMessage')}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-slate-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors shadow-sm"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
