import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BedDouble,
  Wifi,
  Coffee,
  Car,
  Dumbbell,
  Waves,
  ChevronRight,
  Star,
  Shield,
  Clock,
  Award,
  Sparkles,
} from '../../components/common/icons';
import roomService from '../../services/roomService';
import RoomCard from '../../components/rooms/RoomCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    type: '',
  });

  useEffect(() => {
    let isMounted = true;
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAll({ available: 'true' });
        if (isMounted) {
          setRooms(Array.isArray(data) ? data.slice(0, 4) : []);
        }
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRooms();
    return () => {
      isMounted = false;
    };
  }, []);

  const facilities = [
    {
      icon: Wifi,
      title: 'High-Speed Wi-Fi',
      desc: 'Complimentary ultra-fast optical fiber connectivity throughout the entire resort grounds.',
    },
    {
      icon: Car,
      title: 'Valet & Secure Parking',
      desc: '24-hour underground guarded parking with complimentary EV fast charging stations.',
    },
    {
      icon: Dumbbell,
      title: 'Fitness & Wellness Studio',
      desc: 'Technogym state-of-the-art equipment, private yoga sessions, and steam wellness rooms.',
    },
    {
      icon: Waves,
      title: 'Infinity Heated Pools',
      desc: 'Temperature-regulated outdoor oceanfront pool and soothing heated indoor jacuzzi pool.',
    },
    {
      icon: Coffee,
      title: 'Michelin Star Dining',
      desc: 'Exquisite culinary dining, sunset cocktail terrace, and gourmet continental breakfasts.',
    },
    {
      icon: BedDouble,
      title: '24/7 Butler & Room Service',
      desc: 'Dedicated bespoke room service and personalized itinerary planning for every guest.',
    },
  ];

  const whyUs = [
    {
      icon: Shield,
      title: 'Guaranteed Secure Booking',
      desc: 'End-to-end encrypted reservations with flexible, risk-free cancellation policies.',
    },
    {
      icon: Clock,
      title: '24/7 Dedicated Concierge',
      desc: 'World-class hospitality team ready to fulfill any custom request during your stay.',
    },
    {
      icon: Award,
      title: 'Direct Best Rate Guarantee',
      desc: 'Book directly through our portal to unlock complimentary upgrades and the best rates.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-24 sm:py-32 lg:py-40 overflow-hidden">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&auto=format&fit=crop"
            alt="Grand Hotel Oceanfront"
            className="w-full h-full object-cover opacity-35 scale-105 transform motion-safe:animate-pulse duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            <span>Unmatched Seaside Luxury</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight font-serif">
            Experience Serenity, Luxury & Elegance
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Indulge in panoramic ocean views, world-class dining, and personalized hospitality at Grand Hotel Resort & Spa.
          </p>

          {/* Integrated Search Filter Bar */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 max-w-5xl mx-auto shadow-2xl border border-white/20 text-slate-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 text-left uppercase tracking-wider">
                  Check-In
                </label>
                <input
                  type="date"
                  className="input-field bg-slate-50 border-slate-200"
                  value={search.checkIn}
                  onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 text-left uppercase tracking-wider">
                  Check-Out
                </label>
                <input
                  type="date"
                  className="input-field bg-slate-50 border-slate-200"
                  value={search.checkOut}
                  onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 text-left uppercase tracking-wider">
                  Guests
                </label>
                <select
                  className="input-field bg-slate-50 border-slate-200"
                  value={search.guests}
                  onChange={(e) => setSearch({ ...search, guests: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 text-left uppercase tracking-wider">
                  Room Tier
                </label>
                <select
                  className="input-field bg-slate-50 border-slate-200"
                  value={search.type}
                  onChange={(e) => setSearch({ ...search, type: e.target.value })}
                >
                  <option value="">All Categories</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential">Presidential</option>
                  <option value="Family">Family</option>
                </select>
              </div>

              <div className="flex items-end">
                <Link
                  to={`/rooms?checkIn=${search.checkIn}&checkOut=${search.checkOut}&guests=${search.guests}&type=${search.type}`}
                  className="btn-accent w-full flex items-center justify-center gap-2 py-3 shadow-lg shadow-amber-600/30 text-sm font-semibold"
                >
                  <Search size={18} />
                  <span>Check Rates</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Luxury Suites Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                <span>Selected Accommodations</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-serif">
                Featured Suites & Rooms
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-xl">
                Impeccably tailored rooms designed for ultimate serenity, modern convenience, and supreme luxury.
              </p>
            </div>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline"
            >
              <span>Explore All Rooms</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" text="Loading featured rooms..." />
          ) : rooms.length === 0 ? (
            <EmptyState message="No rooms available at the moment" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hotel Facilities & Amenities */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest block mb-2">
              World-Class Amenities
            </span>
            <h2 className="text-3xl font-bold text-slate-900 font-serif">
              Crafted for Your Pure Comfort
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              From our oceanfront spa pavilions to private dining lounges, discover everything designed to elevate your stay.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-amber-500/5 hover:border-amber-500/20 transition-all duration-300 group"
              >
                <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shrink-0">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Grand Hotel */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
              Our Commitment
            </span>
            <h2 className="text-3xl font-bold text-white font-serif">
              Why Discerning Guests Choose Us
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              A bespoke retreat where world-class service meets effortless coastal luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUs.map((item, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-800 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="inline-flex p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mb-6">
                  <item.icon size={32} />
                </div>
                <h3 className="font-bold text-lg text-white mb-2 font-serif">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-gradient-to-br from-amber-600 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-amber-200 text-xs font-bold uppercase tracking-widest block mb-2">
            Limited Time Offers
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-4">
            Plan Your Unforgettable Escape Today
          </h2>
          <p className="text-amber-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Reserve directly to enjoy complimentary daily breakfast, early check-in, and exclusive spa resort credits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/rooms"
              className="bg-slate-950 hover:bg-slate-900 text-white font-semibold px-8 py-3.5 rounded-xl shadow-xl transition-all"
            >
              Browse All Suites
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
