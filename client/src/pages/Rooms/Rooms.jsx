import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  BedDouble,
  SlidersHorizontal,
  X,
  Sparkles,
} from '../../components/common/icons';
import roomService from '../../services/roomService';
import RoomCard from '../../components/rooms/RoomCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL params if available
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [guestCount, setGuestCount] = useState(searchParams.get('guests') || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    let isMounted = true;
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAll();
        if (isMounted) {
          setRooms(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching rooms', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRooms();
    return () => {
      isMounted = false;
    };
  }, []);

  const roomTypes = ['All', 'Standard', 'Deluxe', 'Suite', 'Presidential', 'Family'];

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        // Type filter
        if (selectedType !== 'All' && room.type?.toLowerCase() !== selectedType.toLowerCase()) {
          return false;
        }
        // Guest filter
        if (guestCount !== 'All' && room.capacity < parseInt(guestCount, 10)) {
          return false;
        }
        // Price filter
        if (room.pricePerNight > maxPrice) {
          return false;
        }
        // Keyword query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = room.name?.toLowerCase().includes(q);
          const matchesDesc = room.description?.toLowerCase().includes(q);
          const matchesAmenity = room.amenities?.some((a) => a.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesAmenity) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
        if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // recommended / default
      });
  }, [rooms, selectedType, guestCount, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedType('All');
    setGuestCount('All');
    setSearchQuery('');
    setMaxPrice(1000);
    setSortBy('recommended');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="page-container">
        {/* Header */}
        <PageHeader
          title="Suites & Accommodations"
          subtitle="Explore our selection of handcrafted luxury suites, premium amenities, and oceanfront sanctuaries."
        />

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 mb-8 space-y-6">
          {/* Top Search bar & Sort */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by suite name, amenity (e.g. jacuzzi, ocean view)..."
                className="input-field pl-10 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Sort By:
              </span>
              <select
                className="input-field w-auto bg-slate-50 border-slate-200 py-2 text-xs font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Featured & Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs & Quick Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            {/* Room Type Buttons */}
            <div className="flex flex-wrap gap-2">
              {roomTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedType.toLowerCase() === type.toLowerCase()
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'All' ? 'All Accommodations' : type}
                </button>
              ))}
            </div>

            {/* Price slider & Guests */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Guests:</span>
                <select
                  className="input-field w-auto bg-slate-50 border-slate-200 py-1.5 px-3 text-xs"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                >
                  <option value="All">Any Guests</option>
                  <option value="1">1+ Guest</option>
                  <option value="2">2+ Guests</option>
                  <option value="3">3+ Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium">
                  Max: <strong className="text-amber-600">${maxPrice}</strong>
                </span>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-amber-600 cursor-pointer"
                />
              </div>

              {(selectedType !== 'All' ||
                guestCount !== 'All' ||
                searchQuery ||
                maxPrice < 1000) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 hover:underline font-medium cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredRooms.length}</strong> available
            suites
          </p>
        </div>

        {/* Room Grid */}
        {loading ? (
          <LoadingSpinner size="lg" text="Searching available accommodations..." />
        ) : filteredRooms.length === 0 ? (
          <EmptyState
            title="No Matching Rooms Found"
            message="We couldn't find any rooms matching your current filter criteria. Try adjusting the price range, guest count, or search term."
            action={
              <button onClick={resetFilters} className="btn-secondary text-xs">
                Reset All Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
