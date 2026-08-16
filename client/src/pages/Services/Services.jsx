import React from 'react';
import {
  Coffee,
  Waves,
  Dumbbell,
  Car,
  BedDouble,
  Shield,
  Sparkles,
  Calendar,
} from '../../components/common/icons';
import PageHeader from '../../components/common/PageHeader';
import { Link } from 'react-router-dom';

const Services = () => {
  const serviceList = [
    {
      icon: Coffee,
      title: 'Michelin-Caliber Fine Dining',
      subtitle: 'Culinary Artistry by Master Chefs',
      desc: 'Three premier on-site restaurants showcasing seafood delicacies, aged steaks, organic farm-to-table tasting menus, and a wine cellar with over 2,000 vintage labels.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
      hours: '6:30 AM – 11:30 PM Daily',
    },
    {
      icon: Waves,
      title: 'Serenity Spa & Thalassotherapy',
      subtitle: 'Holistic Regeneration & Natural Rituals',
      desc: 'Indulge in volcanic hot stone therapy, marine collagen facials, private aromatherapy steam chambers, and therapeutic Himalayan salt relaxation lounges.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop',
      hours: '8:00 AM – 9:00 PM Daily',
    },
    {
      icon: Waves,
      title: 'Infinity Ocean Pools & Cabanas',
      subtitle: 'Temperature-Controlled Coastal Lounging',
      desc: 'Bask in heated infinity pools with swim-up cocktail bars, private daybed cabanas with dedicated butler beverage service, and panoramic sunset viewpoints.',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop',
      hours: '7:00 AM – 10:00 PM Daily',
    },
    {
      icon: Calendar,
      title: 'Conferences, Galas & Grand Weddings',
      subtitle: 'Bespoke Event Coordination & Banquet Halls',
      desc: 'Over 15,000 sq ft of elegant indoor and outdoor oceanfront event venues featuring ultra-high definition AV technology, custom staging, and dedicated event planners.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop',
      hours: 'By Advance Reservation',
    },
    {
      icon: Car,
      title: 'Private Chauffeur & Yacht Charters',
      subtitle: 'Luxury Transfers & Coastal Cruises',
      desc: 'Airport limousine pickup, private luxury sedan rentals, and bespoke sunset yacht charters around Paradise Bay with champagne service.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop',
      hours: '24/7 Availability on Request',
    },
    {
      icon: Dumbbell,
      title: 'Fitness Center & Private Yoga',
      subtitle: 'Health & Athletic Performance',
      desc: 'Equipped with the newest Technogym cardio and strength circuits, Peloton bikes, ocean-view yoga pavilions, and private personal trainers.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop',
      hours: 'Open 24 Hours with Keycard',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="page-container space-y-12">
        <PageHeader
          title="Resort Services & Amenities"
          subtitle="Immerse yourself in exceptional gastronomic creations, restorative spa treatments, and personalized concierge experiences."
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-300"
            >
              <div className="h-52 overflow-hidden relative bg-slate-900">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-400 p-2 rounded-xl">
                  <service.icon size={20} />
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
                    {service.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{service.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{service.hours}</span>
                  <Link
                    to="/contact"
                    className="text-amber-600 font-bold hover:text-amber-700 hover:underline"
                  >
                    Inquire Concierge &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Concierge Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block">
              Personalized Assistance
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif">Have a Custom Request?</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Our 24/7 Chief Concierge team is at your service for private helicopter charters, romantic seaside dinners, and personalized excursions.
            </p>
          </div>
          <Link
            to="/contact"
            className="btn-accent shrink-0 px-8 py-3.5 text-xs font-bold uppercase tracking-wider"
          >
            Contact Concierge Desk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
