import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Mail, Phone, MapPin, Award, Shield, Clock } from '../common/icons';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto border-t border-slate-900">
      {/* Top Banner highlights */}
      <div className="border-b border-slate-900 bg-slate-900/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Award size={22} />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Best Luxury Hotel 2025</h4>
              <p className="text-xs text-slate-400">Awarded by World Hospitality Council</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Shield size={22} />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Guaranteed Best Rates</h4>
              <p className="text-xs text-slate-400">Book direct for the lowest prices</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24/7 Concierge Support</h4>
              <p className="text-xs text-slate-400">Personalized attention around the clock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Hotel Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <BedDouble className="text-amber-400" size={24} />
              </div>
              <div>
                <span className="text-lg font-bold tracking-wider text-white uppercase font-serif">
                  LuxuryStay
                </span>
                <span className="block text-[9px] tracking-widest text-amber-400 uppercase font-semibold">
                  Hospitality
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Immerse yourself in world-class opulence, seaside tranquility, Michelin-grade gastronomy, and bespoke luxury suites designed for an unforgettable stay.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wide uppercase text-xs text-amber-400">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-amber-400 transition-colors">
                  Suites & Rooms
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition-colors">
                  Amenities & Spa
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Get In Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Guest Services */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wide uppercase text-xs text-amber-400">
              Guest Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/my-bookings" className="hover:text-amber-400 transition-colors">
                  Manage Reservation
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors">
                  Guest Portal Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-amber-400 transition-colors">
                  Join Loyalty Rewards
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Check-in: 3:00 PM</span>
              </li>
              <li>
                <span className="text-slate-500">Check-out: 11:00 AM</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wide uppercase text-xs text-amber-400">
              Contact & Location
            </h4>
            <div className="space-y-3.5 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span>100 Ocean Promenade, Paradise Bay, NY 10001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-amber-400 shrink-0" />
                <span>+1 (555) 888-9900</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-amber-400 shrink-0" />
                <span>reservations@grandhotel.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Grand Hotel & Resort Management. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
