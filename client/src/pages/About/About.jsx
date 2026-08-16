import React from 'react';
import { Award, Shield, Users, Clock, BedDouble, Heart, Sparkles } from '../../components/common/icons';
import PageHeader from '../../components/common/PageHeader';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { label: 'Years of Hospitality', value: '35+' },
    { label: 'Luxury Suites', value: '180' },
    { label: 'Guest Satisfaction', value: '99.4%' },
    { label: 'International Awards', value: '42' },
  ];

  const team = [
    {
      name: 'Victoria Vance',
      role: 'General Manager & Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop',
    },
    {
      name: 'Chef Alessandro Rossi',
      role: 'Executive Michelin Chef',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop',
    },
    {
      name: 'Elena Rostova',
      role: 'Head of Wellness & Spa',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 space-y-16">
      <div className="page-container">
        <PageHeader
          title="Our Story & Heritage"
          subtitle="Discover the rich legacy, passionate craftsmanship, and vision behind Grand Hotel Resort & Spa."
        />

        {/* Hero story section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-5">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
              Established 1990
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif leading-tight">
              A Legacy of Uncompromising Hospitality & Coastal Splendor
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Founded over three decades ago along the scenic coastline, Grand Hotel was born from a desire to craft an oasis of serene luxury where every detail is tailored to perfection.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              From our architectural suites with panoramic seascape views to our world-renowned culinary sanctuaries and regenerative spa wellness rituals, we invite our guests into a realm of effortless elegance.
            </p>
            <div className="pt-2">
              <Link to="/rooms" className="btn-accent text-xs px-6 py-3">
                Experience Grand Hotel
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-96 lg:h-[450px]">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop"
              alt="Grand Hotel Heritage"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs text-amber-400 uppercase tracking-widest font-semibold">
                Paradise Bay Sanctuary
              </p>
              <p className="text-base font-serif font-bold">Over 3 Decades of Luxury Hospitality</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-bold text-amber-400 font-serif">{stat.value}</p>
              <p className="text-xs text-slate-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="pt-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
              Our Core Pillars
            </span>
            <h2 className="text-3xl font-bold text-slate-900 font-serif">What Defines Our Service</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl w-fit">
                <Heart size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Heartfelt Hospitality</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We believe true luxury is intimate and genuine. Our staff anticipates your needs to make you feel completely at home.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl w-fit">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Impeccable Standards</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                From Egyptian cotton linens to pristine oceanfront pools, perfection is our benchmark in everything we present.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl w-fit">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Eco & Sustainable Luxury</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We prioritize eco-conscious energy management, zero single-use plastics, and locally sourced organic ingredients.
              </p>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="pt-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
              Meet the Leadership
            </span>
            <h2 className="text-3xl font-bold text-slate-900 font-serif">
              The Curators Behind Your Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 text-center pb-6 group"
              >
                <div className="h-64 overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-serif">{member.name}</h3>
                <p className="text-xs text-amber-600 font-medium mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
