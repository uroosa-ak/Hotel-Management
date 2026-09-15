import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/template/PageHero';
import roomService from '../../services/roomService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, BedDouble, Star, Shield, ArrowRight } from '../../components/common/icons';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    let active = true;
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAll();
        if (active) {
          setRooms(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch rooms from MongoDB', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchRooms();
    return () => {
      active = false;
    };
  }, []);

  const roomTypes = ['all', 'deluxe', 'suite', 'single', 'double'];

  const filteredRooms = rooms.filter((r) => {
    if (filterType === 'all') return true;
    const t = (r.roomType || r.type || '').toLowerCase();
    return t.includes(filterType);
  });

  return (
    <div className="rooms-catalog-page" style={{ fontFamily: "'Jost', sans-serif" }}>
      <PageHero
        title="Luxury Suites & Accommodations"
        subtitle="Experience bespoke hospitality with panoramic vistas, curated fine art, and intuitive room amenities."
      />

      <section className="motela-section bg-[#fbf9f6] py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {roomTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-[#c19c77] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {type === 'all' ? 'All Suites' : type}
              </button>
            ))}
          </div>

          {/* Dynamic Rooms Grid */}
          {loading ? (
            <LoadingSpinner size="lg" text="Loading live suites from inventory..." />
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs">
              <BedDouble size={48} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-xl font-bold text-slate-800 font-serif">No Accommodations Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No rooms currently match the selected filter. Try selecting another category or check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => {
                const imageSrc =
                  room.images?.[0] || room.image || '/images/rooms/room-01.jpg';
                const price = room.price || room.basePricePerNight || 200;
                const capacity = room.capacity || room.maxOccupancy?.adults || 2;

                return (
                  <div
                    key={room._id}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-64 overflow-hidden bg-slate-100">
                        <img
                          src={imageSrc}
                          alt={room.name || `Suite ${room.roomNumber}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-xs text-white px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide font-mono shadow-md">
                          Suite #{room.roomNumber}
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs text-slate-900 px-3 py-1 rounded-full text-xs font-bold font-serif shadow-md">
                          ${price} <span className="text-[10px] text-slate-500 font-normal font-sans">/ night</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                          <span className="text-[#c19c77]">{room.roomType || 'Deluxe'}</span>
                          <span>Floor {room.floor || 1}</span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 font-serif group-hover:text-[#c19c77] transition-colors">
                          <Link to={`/rooms/${room._id}`}>
                            {room.name || `Deluxe Suite ${room.roomNumber}`}
                          </Link>
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {room.description || 'Impeccably appointed accommodations with premium amenities.'}
                        </p>

                        {/* Badges */}
                        <div className="flex items-center gap-4 pt-2 text-xs text-slate-600 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-[#c19c77]" />
                            <span>Up to {capacity} Guests</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BedDouble size={14} className="text-[#c19c77]" />
                            <span>{room.bedType || 'King Bed'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                      <Link
                        to={`/rooms/${room._id}`}
                        className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 hover:border-[#c19c77] text-slate-700 hover:text-[#c19c77] text-xs font-semibold uppercase tracking-wider transition-all"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/booking/${room._id}`}
                        className="flex-1 text-center py-2.5 rounded-xl bg-[#c19c77] hover:bg-[#b08b66] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <span>Book Now</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Rooms;
