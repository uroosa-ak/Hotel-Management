import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Maximize,
  BedDouble,
  Eye,
  Check,
  ArrowLeft,
  Star,
  Shield,
  Clock,
  Sparkles,
} from '../../components/common/icons';
import { useAuth } from '../../context/AuthContext';
import roomService from '../../services/roomService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRoom = async () => {
      try {
        const data = await roomService.getById(id);
        if (isMounted && data) {
          setRoom(data);
          setActiveImage(data.images?.[0] || '');
        }
      } catch (err) {
        console.error('Error fetching room details', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRoom();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen text="Loading room details..." />;

  if (!room) {
    return (
      <div className="page-container text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Room Not Found</h2>
        <p className="text-slate-500 mb-6">The accommodation you requested does not exist or has been removed.</p>
        <Link to="/rooms" className="btn-primary text-sm">
          Browse All Rooms
        </Link>
      </div>
    );
  }

  const defaultImages = [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop',
  ];
  const gallery = room.images && room.images.length > 0 ? room.images : defaultImages;
  const currentImage = activeImage || gallery[0];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="page-container">
        {/* Back Link */}
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to All Accommodations</span>
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Images, Description & Amenities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Main Image */}
            <div className="rounded-2xl overflow-hidden h-80 sm:h-96 lg:h-[450px] shadow-lg relative bg-slate-900">
              <img
                src={currentImage}
                alt={room.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute top-4 right-4">
                <StatusBadge status={room.isAvailable ? 'available' : 'unavailable'} />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`rounded-xl overflow-hidden h-20 sm:h-24 transition-all cursor-pointer border-2 ${
                      currentImage === img
                        ? 'border-amber-500 scale-95 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Overview Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                      {room.type} Suite
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs text-slate-500">Suite #{room.roomNumber}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                    {room.name}
                  </h1>
                </div>

                {room.rating && (
                  <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-100 shrink-0">
                    <Star size={18} className="text-amber-500 fill-amber-500" />
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {room.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-500 block">Exceptional</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="py-6 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  About This Suite
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="pt-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Suite Amenities & Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.amenities?.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 font-medium"
                    >
                      <div className="p-1 bg-amber-500/10 text-amber-600 rounded-md">
                        <Check size={14} />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 sticky top-28">
              <div className="flex items-baseline justify-between pb-5 border-b border-slate-100">
                <div>
                  <span className="text-3xl sm:text-4xl font-bold text-amber-600 font-serif">
                    ${room.pricePerNight}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">/ night</span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  Best Rate Direct
                </span>
              </div>

              {/* Specs */}
              <div className="py-6 space-y-4 border-b border-slate-100 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-slate-400" /> Max Capacity
                  </span>
                  <span className="font-semibold text-slate-900">{room.capacity} Guests</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Maximize size={16} className="text-slate-400" /> Suite Dimension
                  </span>
                  <span className="font-semibold text-slate-900">{room.size || 40} m²</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <BedDouble size={16} className="text-slate-400" /> Bed Setup
                  </span>
                  <span className="font-semibold text-slate-900">{room.bedType || 'King Bed'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Eye size={16} className="text-slate-400" /> Suite Scenery
                  </span>
                  <span className="font-semibold text-slate-900">{room.view || 'Ocean View'}</span>
                </div>
              </div>

              {/* Booking Action */}
              <div className="pt-6 space-y-3">
                {room.isAvailable ? (
                  <button
                    onClick={() => navigate(`/booking/${room._id}`)}
                    className="btn-accent w-full py-3.5 text-sm font-bold shadow-lg shadow-amber-600/30 cursor-pointer"
                  >
                    Proceed to Reservation
                  </button>
                ) : (
                  <div className="text-center py-3 bg-slate-100 rounded-xl text-slate-500 font-semibold text-sm">
                    Currently Unavailable
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                  <Shield size={13} className="text-amber-500" />
                  <span>Free cancellation up to 48 hours before check-in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
