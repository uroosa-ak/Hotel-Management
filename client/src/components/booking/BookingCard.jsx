import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, BedDouble, ChevronRight } from '../common/icons';
import StatusBadge from '../common/StatusBadge';

const BookingCard = ({ booking, onCancel, showActions = true }) => {
  const room = booking.room;
  const imageUrl = room?.images?.[0] || '/images/rooms/room-01.jpg';

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="card overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Room image */}
        <div className="md:w-64 h-48 md:h-auto shrink-0 relative bg-slate-100">
          <img
            src={imageUrl}
            alt={room?.name || 'Hotel Room'}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded">
            Room {room?.roomNumber || '101'}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {room?.name || 'Deluxe Suite'}
                </h3>
                <p className="text-xs text-slate-500">{room?.type || 'Standard'} Category</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={booking.status} />
                <StatusBadge status={booking.paymentStatus} />
              </div>
            </div>

            {/* Dates and guests */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 my-2 border-y border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar size={16} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Check-In</p>
                  <p className="font-semibold text-slate-800">{formatDate(booking.checkIn)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Calendar size={16} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Check-Out</p>
                  <p className="font-semibold text-slate-800">{formatDate(booking.checkOut)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600 col-span-2 sm:col-span-1">
                <Users size={16} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">Guests</p>
                  <p className="font-semibold text-slate-800">{booking.guests} Guest(s)</p>
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                "{booking.specialRequests}"
              </p>
            )}
          </div>

          {/* Footer of card */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Price</span>
              <span className="text-xl font-bold text-amber-600">${booking.totalAmount}</span>
            </div>

            <div className="flex items-center gap-3">
              {room?._id && (
                <Link
                  to={`/rooms/${room._id}`}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                >
                  <span>Room info</span>
                  <ChevronRight size={14} />
                </Link>
              )}

              {showActions &&
                booking.status !== 'cancelled' &&
                booking.status !== 'checked-out' && (
                  <button
                    onClick={() => onCancel?.(booking._id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel Reservation
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;