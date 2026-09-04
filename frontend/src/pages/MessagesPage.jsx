import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MessageSquare, 
  Send, 
  User, 
  Phone, 
  Loader2, 
  Briefcase, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function MessagesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      setLoadingConvos(true);
      const res = await api.get('/api/messages/conversations');
      setConversations(res.data || []);
      if (res.data?.length > 0 && !selectedConvo) {
        setSelectedConvo(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConvos(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedConvo) return;
    try {
      setLoadingMessages(true);
      const res = await api.get(`/api/messages/${selectedConvo.job_id}/${selectedConvo.other_user.id}`);
      setMessages(res.data || []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConvo) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 8000);
      return () => clearInterval(interval);
    }
  }, [selectedConvo]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending || !selectedConvo) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res = await api.post('/api/messages', {
        receiver_id: selectedConvo.other_user.id,
        job_id: selectedConvo.job_id,
        content: text,
      });
      setMessages((prev) => [...prev, res.data]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (err) {
      console.error('Failed to send:', err);
      setInputText(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[600px] h-[75vh]">
        {/* Left Side: Conversations List */}
        <div className="border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              <span>{t('nav.messages')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Direct chat on your farm jobs</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConvos ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p>No active conversations yet.</p>
                <p className="text-[11px] text-slate-400">Chat with farmers or workers by clicking "Chat" on any job application.</p>
              </div>
            ) : (
              conversations.map((c, idx) => {
                const isSelected = selectedConvo?.job_id === c.job_id && selectedConvo?.other_user?.id === c.other_user?.id;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedConvo(c)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-100/70 border-l-4 border-emerald-700' : 'bg-white hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {c.other_user?.name ? c.other_user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {c.other_user?.name}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-emerald-800 truncate mt-0.5">
                          {c.job?.title || 'Farm Job'}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {c.last_message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Window */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {selectedConvo ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-emerald-800 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 border border-emerald-500 flex items-center justify-center font-bold text-sm">
                    {selectedConvo.other_user?.name ? selectedConvo.other_user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                      {selectedConvo.other_user?.name}
                      <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-full capitalize">
                        {selectedConvo.other_user?.role}
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      Job: {selectedConvo.job?.title}
                    </p>
                  </div>
                </div>

                {selectedConvo.other_user?.phone && (
                  <a
                    href={`tel:${selectedConvo.other_user.phone}`}
                    className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
                {loadingMessages && messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading conversation...
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
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                            isMine
                              ? 'bg-emerald-700 text-white rounded-tr-none'
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

              {/* Input Footer */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('messages.typeMessage')}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-50 transition-colors shadow-sm"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <h3 className="text-sm font-bold text-slate-700">Select a conversation</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Pick a conversation from the left to view messages and coordinate with your farm crew.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
