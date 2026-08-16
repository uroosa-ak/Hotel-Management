import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Maximize, Star, BedDouble, ChevronRight } from '../common/icons';
import StatusBadge from '../common/StatusBadge';

const RoomCard = ({ room }) => {
  const imageUrl =
    room.images?.[0] ||
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop';

  return (
    <div className="card overflow-hidden group flex flex-col h-full hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
      {/* Image container */}
      <div className="relative h-60 overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={room.isAvailable ? 'available' : 'unavailable'} />
        </div>

        {/* Rating Badge */}
        {room.rating && (
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span>{room.rating.toFixed(1)}</span>
            {room.reviewsCount > 0 && (
              <span className="text-slate-300 text-[10px]">({room.reviewsCount})</span>
            )}
          </div>
        )}

        {/* Room Type Pill */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 px-2.5 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider">
          {room.type}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
              {room.name}
            </h3>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-bold text-amber-600">${room.pricePerNight}</span>
            <span className="text-xs text-slate-500 font-normal">/ night</span>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2">
            {room.description}
          </p>

          {/* Room Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-slate-400" />
              <span>Up to {room.capacity} Guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize size={14} className="text-slate-400" />
              <span>{room.size || 35} m²</span>
            </div>
            {room.bedType && (
              <div className="flex items-center gap-1.5 col-span-2">
                <BedDouble size={14} className="text-slate-400" />
                <span>{room.bedType} Bed</span>
              </div>
            )}
          </div>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {room.amenities?.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
              >
                {amenity}
              </span>
            ))}
            {room.amenities && room.amenities.length > 3 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/rooms/${room._id}`}
          className="btn-secondary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white transition-all"
        >
          <span>View Room Details</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;