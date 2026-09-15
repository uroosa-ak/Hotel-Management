import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo';
import { Mail, Phone, MapPin, Award, Shield, Clock, Sparkles } from '../common/icons';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto border-t border-slate-900 overflow-hidden font-sans">
      {/* Top Banner Highlights */}
      <div className="border-b border-slate-900 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 shadow-xs">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-white font-serif font-bold text-sm tracking-wide">World Luxury Hotel 2025</h4>
              <p className="text-xs text-slate-400 mt-0.5">Awarded by International Hospitality Excellence</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 shadow-xs">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl shrink-0">
              <Shield size={24} />
            </div>
            <div>
              <h4 className="text-white font-serif font-bold text-sm tracking-wide">Best Price Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">Book directly with zero hidden booking fees</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 shadow-xs">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="text-white font-serif font-bold text-sm tracking-wide">24/7 Bespoke Concierge</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated personal assistance round the clock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Bio */}
          <div className="space-y-5">
            <BrandLogo variant="dark" size="lg" />
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Experience the pinnacle of luxury, oceanfront tranquility, Michelin-star culinary arts, and tailored hospitality designed for discerning guests.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Sparkles size={14} />
              <span>5-Star Premium Luxury Resort & Spa</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-amber-400 font-serif font-bold text-xs uppercase tracking-widest mb-5 border-b border-amber-500/20 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500/50">&rsaquo;</span> Home Page
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500/50">&rsaquo;</span> Suites & Accommodations
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500/50">&rsaquo;</span> Fine Dining & Spa Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500/50">&rsaquo;</span> About Our Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500/50">&rsaquo;</span> Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Guest Services */}
          <div>
            <h4 className="text-amber-400 font-serif font-bold text-xs uppercase tracking-widest mb-5 border-b border-amber-500/20 pb-2">
              Guest Services
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/my-bookings" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500/50">&rsaquo;</span> Manage Reservations
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500/50">&rsaquo;</span> Guest Portal Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500/50">&rsaquo;</span> Register Guest Account
                </Link>
              </li>
              <li className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-900">
                <span>Check-in Time:</span>
                <span className="text-slate-300 font-medium">3:00 PM</span>
              </li>
              <li className="text-xs text-slate-500 flex items-center justify-between">
                <span>Check-out Time:</span>
                <span className="text-slate-300 font-medium">11:00 AM</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-amber-400 font-serif font-bold text-xs uppercase tracking-widest mb-5 border-b border-amber-500/20 pb-2">
              Concierge & Location
            </h4>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg shrink-0 mt-0.5 text-amber-400">
                  <MapPin size={16} />
                </div>
                <span className="text-slate-300">Paradise Bay Waterfront, Boulevard Avenue 100, FL</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg shrink-0 text-amber-400">
                  <Phone size={16} />
                </div>
                <span className="text-slate-300">+1 (800) 555-STAY</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg shrink-0 text-amber-400">
                  <Mail size={16} />
                </div>
                <span className="text-slate-300 font-mono text-xs">waqaskamboh269@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} LuxuryStay Hospitality & Resort Group. All rights reserved.
          </p>
          <div className="flex gap-6 font-medium">
            <span className="hover:text-amber-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-amber-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-amber-400 transition-colors cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
