import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const BookingCard = ({ booking, onCancel, showActions = true }) => {
  const room = booking.room;
  const imageUrl = room?.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&auto=format&fit=crop';

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
          <img src={imageUrl} alt={room?.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-5 flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-primary text-lg">{room?.name}</h3>
              <p className="text-sm text-muted">Room {room?.roomNumber} &bull; {room?.type}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={booking.status} />
              <StatusBadge status={booking.paymentStatus} />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-muted">
              <Calendar size={16} />
              <div>
                <p className="text-xs text-gray-400">Check-in</p>
                <p className="font-medium text-primary">{formatDate(booking.checkIn)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Calendar size={16} />
              <div>
                <p className="text-xs text-gray-400">Check-out</p>
                <p className="font-medium text-primary">{formatDate(booking.checkOut)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Users size={16} />
              <div>
                <p className="text-xs text-gray-400">Guests</p>
                <p className="font-medium text-primary">{booking.guests}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-primary font-bold">
              <DollarSign size={18} className="text-accent" />
              {booking.totalAmount}
            </div>
            {showActions && booking.status !== 'cancelled' && booking.status !== 'checked_out' && (
              <button
                onClick={() => onCancel?.(booking._id)}
                className="text-sm text-danger hover:underline"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;