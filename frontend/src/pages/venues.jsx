import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import VenueCard from '../components/VenueCard';
import { venuesApi } from '../lib/api';

const Venues = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await venuesApi.list();
        setVenues(res?.data || []);
      } catch (e) {
        setError(e?.message || 'Failed to load venues');
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filterCategories = ['All', 'Classroom', 'Lab', 'Auditorium', 'Lecture Theater', 'Tutorial Room'];

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const name = venue?.name || '';
      const type = venue?.type;

      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Classroom' && type === 'classroom') ||
        (activeFilter === 'Lab' && type === 'lab') ||
        (activeFilter === 'Auditorium' && type === 'auditorium') ||
        (activeFilter === 'Lecture Theater' && type === 'lecture-theater') ||
        (activeFilter === 'Tutorial Room' && type === 'tutorial-room');

      return matchesSearch && matchesFilter;
    });
  }, [venues, searchQuery, activeFilter]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      <Sidebar activePage="venues" />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-5 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-700">Venues</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Explore and check availability of campus halls, labs, and classrooms.</p>
          </div>

          {/* Search */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3.5 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search venues by name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Filter Tabs - Swipeable on mobile */}
          <div className="mb-5 sm:mb-8">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1.5 -mx-1 px-1">
              {filterCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 sm:px-6 py-2 rounded-full transition duration-200 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 active:scale-95 ${
                    activeFilter === category
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Venue Cards Grid */}
          {error ? (
            <div className="mb-6 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm sm:text-base">Loading venues…</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredVenues.map(venue => (
                <VenueCard
                  key={venue._id}
                  name={venue.name}
                  capacity={venue.capacity}
                  status={venue.status}
                  type={venue.type}
                />
              ))}
            </div>
          )}

          {/* No results message */}
          {!loading && filteredVenues.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm sm:text-base">No venues found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Venues;
