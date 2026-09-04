import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', role: 'farmer' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Support & Help</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Kisan Helpline & Contact Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Need assistance posting a job, registering as a laborer, or navigating the platform? Our rural support team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info card */}
        <div className="bg-emerald-900 text-white p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Direct Assistance Channels</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800">
                <Phone className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-emerald-300 font-semibold">Toll-Free Kisan Line</div>
                  <div className="text-lg font-bold text-white">1800-AGRI-CONNECT</div>
                  <div className="text-[11px] text-emerald-300">Mon - Sat: 6:00 AM - 8:00 PM (IST)</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800">
                <Mail className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-emerald-300 font-semibold">Email Helpdesk</div>
                  <div className="text-sm font-bold text-white">support@agriconnect.org</div>
                  <div className="text-[11px] text-emerald-300">Responses within 24 hours</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800">
                <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-emerald-300 font-semibold">Rural Tech Innovation Hubs</div>
                  <div className="text-xs text-white leading-relaxed">
                    Pune Agricultural Center, Maharashtra<br />
                    Indore Krishi Kendra, Madhya Pradesh
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-emerald-300/80 pt-4 border-t border-emerald-800">
            Available in English, Hindi (हिंदी), and Marathi (मराठी).
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-600">
                Our support representative will call or message your phone number shortly.
              </p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', message: '', role: 'farmer' }); }}
                className="mt-2 text-xs font-semibold text-emerald-700 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Send an Enquiry</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">You are a:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                >
                  <option value="farmer">👨‍🌾 Farmer (Need Workers)</option>
                  <option value="worker">👷 Agricultural Worker (Need Work)</option>
                  <option value="other">General Community / Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">How can we help?</label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your question or issue here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Submit Helpline Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
