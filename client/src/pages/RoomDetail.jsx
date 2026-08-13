import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Maximize, BedDouble, Eye, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import roomService from '../../services/roomService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await roomService.getById(id);
        setRoom(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!room) return <div className="page-container text-center">Room not found</div>;

  const mainImage = room.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop';

  return (
    <div className="page-container">
      <Link to="/rooms" className="inline-flex items-center gap-2 text-muted hover:text-primary mb-6">
        <ArrowLeft size={18} /> Back to Rooms
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl overflow-hidden h-80 lg:h-96">
            <img src={mainImage} alt={room.name} className="w-full h-full object-cover" />
          </div>
          {room.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {room.images.slice(1, 5).map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden h-20 lg:h-24">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-primary">{room.name}</h1>
                <p className="text-muted">Room {room.roomNumber} &bull; {room.type}</p>
              </div>
              <StatusBadge status={room.isAvailable ? 'available' : 'unavailable'} />
            </div>
            <p className="text-secondary leading-relaxed mb-6">{room.description}</p>

            <h3 className="font-semibold text-primary mb-3">Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {room.amenities?.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-secondary">
                  <Check size={16} className="text-accent" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-accent">${room.pricePerNight}</span>
              <span className="text-muted">/ night</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-secondary">
                <Users size={18} className="text-muted" />
                <span>Up to {room.capacity} guests</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary">
                <Maximize size={18} className="text-muted" />
                <span>{room.size || '--'} m²</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary">
                <BedDouble size={18} className="text-muted" />
                <span>{room.bedType} Bed</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary">
                <Eye size={18} className="text-muted" />
                <span>{room.view} View</span>
              </div>
            </div>

            {room.isAvailable ? (
              isAuthenticated ? (
                <button
                  onClick={() => navigate(`/booking/${room._id}`)}
                  className="btn-primary w-full py-3 text-lg"
                >
                  Book This Room
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted text-center">Please log in to make a reservation</p>
                  <Link to="/login" className="btn-secondary w-full block text-center py-3">Login to Book</Link>
                </div>
              )
            ) : (
              <div className="text-center py-3 bg-gray-100 rounded-lg text-muted font-medium">
                Currently Unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;