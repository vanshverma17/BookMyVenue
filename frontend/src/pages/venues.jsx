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
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="venues" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-purple-700">Venues</h1>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex gap-3">
              {filterCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-6 py-2 rounded-full transition duration-200 font-medium ${
                    activeFilter === category
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Venue Cards Grid */}
          {error ? (
            <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading venues…</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No venues found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Venues;
