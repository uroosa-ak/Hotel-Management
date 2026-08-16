import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  MessageSquare,
  ChevronDown,
} from '../../components/common/icons';
import PageHeader from '../../components/common/PageHeader';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 600);
  };

  const faqs = [
    {
      q: 'What are your standard check-in and check-out times?',
      a: 'Check-in begins at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out can be requested based on availability.',
    },
    {
      q: 'Do you offer airport transfer and transportation?',
      a: 'Yes, we provide luxury airport limousine and shuttle transfer services upon request. Please notify our concierge 24 hours prior to arrival.',
    },
    {
      q: 'Is parking available on property?',
      a: 'Complimentary valet and guarded underground parking are provided for all registered hotel guests with EV charging facilities.',
    },
    {
      q: 'What is your reservation cancellation policy?',
      a: 'Flexible reservations can be cancelled free of charge up to 48 hours before check-in date. Specialty suites may have tailored policies.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="page-container space-y-12">
        <PageHeader
          title="Contact & Concierge Desk"
          subtitle="We are here to assist you with reservations, private inquiries, events, and customized experiences."
        />

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Our Location</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                100 Ocean Promenade, Paradise Bay, NY 10001
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Direct Phone</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Reservations: +1 (555) 888-9900<br />
                Front Desk: +1 (555) 888-9901
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Email Inquiries</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                reservations@grandhotel.com<br />
                concierge@grandhotel.com
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Service Hours</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Front Desk: 24/7 Daily<br />
                Concierge: 7:00 AM – 11:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid: Form & FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 font-serif mb-1">
                Send Us a Direct Message
              </h3>
              <p className="text-xs text-slate-500">
                Please fill out the form below and our team will get back to you within a few hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="inline-flex p-3 bg-emerald-100 text-emerald-700 rounded-full">
                  <CheckCircle size={28} />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-600">
                  Thank you for reaching out. A guest relations officer has received your inquiry.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary text-xs mt-2"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="input-field"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="input-field"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Inquiry Topic *
                    </label>
                    <select
                      required
                      className="input-field"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="">Select a Topic</option>
                      <option value="Reservations">Room Reservations</option>
                      <option value="Dining">Restaurant & Dining</option>
                      <option value="Events">Weddings & Private Events</option>
                      <option value="Spa">Spa & Wellness Rituals</option>
                      <option value="Concierge">Bespoke Concierge Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you?"
                    className="input-field resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent w-full py-3.5 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-amber-600/20"
                >
                  {submitting ? 'Transmitting Message...' : 'Send Message to Concierge'}
                </button>
              </form>
            )}
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 font-serif mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 hover:text-amber-600 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openFaq === idx ? 'rotate-180 text-amber-600' : 'text-slate-400'
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Location banner */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative h-56 bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop"
                alt="Paradise Bay Beach"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-amber-400 text-[10px] uppercase font-bold tracking-widest">
                  Paradise Bay Waterfront
                </span>
                <h4 className="text-lg font-bold font-serif">100 Ocean Promenade</h4>
                <p className="text-xs text-slate-300">Just 20 minutes from International Airport (JFK)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
