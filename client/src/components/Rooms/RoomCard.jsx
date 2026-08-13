import { Link } from 'react-router-dom';
import { Users, Maximize, Star } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const RoomCard = ({ room }) => {
  const imageUrl = room.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&auto=format&fit=crop';

  return (
    <div className="card overflow-hidden group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={room.isAvailable ? 'available' : 'unavailable'} />
        </div>
        {room.rating > 0 && (
          <div className="absolute top-3 left-3 bg-primary/80 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm">
            <Star size={14} className="text-accent fill-accent" />
            {room.rating}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-primary">{room.name}</h3>
          <span className="text-accent font-bold">${room.pricePerNight}<span className="text-sm text-muted font-normal">/night</span></span>
        </div>
        <p className="text-muted text-sm mb-4 line-clamp-2">{room.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted mb-4">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{room.capacity} Guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={16} />
            <span>{room.size || '--'} m²</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities?.slice(0, 3).map((amenity, i) => (
            <span key={i} className="text-xs bg-gray-100 text-secondary px-2 py-1 rounded-md">{amenity}</span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="text-xs text-muted px-2 py-1">+{room.amenities.length - 3} more</span>
          )}
        </div>
        <Link
          to={`/rooms/${room._id}`}
          className="block text-center btn-secondary text-sm py-2.5"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;