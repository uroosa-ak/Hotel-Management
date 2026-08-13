import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BedDouble, Wifi, Coffee, Car, Dumbbell, Waves, ChevronRight, Star, Shield, Clock, Award } from 'lucide-react';
import roomService from '../../services/roomService';
import RoomCard from '../../components/rooms/RoomCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ checkIn: '', checkOut: '', guests: '2', type: '' });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAll({ available: 'true' });
        setRooms(data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const facilities = [
    { icon: Wifi, title: 'Free Wi-Fi', desc: 'High-speed internet throughout the property' },
    { icon: Car, title: 'Free Parking', desc: 'Secure on-site parking for all guests' },
    { icon: Dumbbell, title: 'Fitness Center', desc: 'State-of-the-art gym equipment' },
    { icon: Waves, title: 'Swimming Pool', desc: 'Heated indoor and outdoor pools' },
    { icon: Coffee, title: 'Restaurant & Bar', desc: 'Fine dining and casual drinks' },
    { icon: BedDouble, title: 'Room Service', desc: '24/7 in-room dining available' },
  ];

  const whyUs = [
    { icon: Shield, title: 'Secure Booking', desc: 'Encrypted payments and data protection' },
    { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
    { icon: Award, title: 'Best Price Guarantee', desc: 'Find a lower price, we will match it' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop"
            alt="Hotel"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">Experience Luxury Like Never Before</h1>
          <p className="text-lg lg:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Discover world-class hospitality, elegant rooms, and unforgettable moments at Grand Hotel.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-xl p-4 max-w-4xl mx-auto shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted mb-1 text-left">Check-in</label>
                <input
                  type="date"
                  className="input-field text-primary"
                  value={search.checkIn}
                  onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1 text-left">Check-out</label>
                <input
                  type="date"
                  className="input-field text-primary"
                  value={search.checkOut}
                  onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1 text-left">Guests</label>
                <select
                  className="input-field text-primary"
                  value={search.guests}
                  onChange={(e) => setSearch({ ...search, guests: e.target.value })}
                >
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1 text-left">Room Type</label>
                <select
                  className="input-field text-primary"
                  value={search.type}
                  onChange={(e) => setSearch({ ...search, type: e.target.value })}
                >
                  <option value="">All Types</option>
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
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                  <Search size={18} /> Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">Featured Rooms</h2>
              <p className="text-muted mt-1">Handpicked accommodations for your perfect stay</p>
            </div>
            <Link to="/rooms" className="text-accent font-medium flex items-center gap-1 hover:underline">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          {loading ? <LoadingSpinner /> : rooms.length === 0 ? (
            <EmptyState message="No rooms available at the moment" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.map((room) => <RoomCard key={room._id} room={room} />)}
            </div>
          )}
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-primary">Hotel Facilities</h2>
            <p className="text-muted mt-2">Everything you need for a comfortable stay</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-xl hover:bg-background transition-colors">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <f.icon size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{f.title}</h3>
                  <p className="text-sm text-muted mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold">Why Choose Grand Hotel</h2>
            <p className="text-gray-400 mt-2">We go above and beyond for our guests</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUs.map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="inline-flex p-4 bg-accent/20 rounded-full mb-4">
                  <item.icon size={32} className="text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready for Your Stay?</h2>
          <p className="text-muted mb-8">Book now and enjoy exclusive member benefits and the best available rates.</p>
          <Link to="/rooms" className="btn-primary inline-block text-lg px-8 py-3">Browse All Rooms</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;