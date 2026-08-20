import { useState, useEffect } from 'react';
import { Search, Check, X, Clock, Calendar, MapPin, User, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { bookingsApi } from '../lib/api';

const ManageBookings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('pending');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsApi.list();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      setLoading(true);
      const response = await bookingsApi.updateStatus(bookingId, { status: 'approved' });
      
      if (response.success) {
        await fetchBookings();
      }
    } catch (err) {
      console.error('Error approving booking:', err);
      alert('Failed to approve booking');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      setLoading(true);
      const response = await bookingsApi.updateStatus(bookingId, { status: 'rejected' });
      
      if (response.success) {
        await fetchBookings();
      }
    } catch (err) {
      console.error('Error rejecting booking:', err);
      alert('Failed to reject booking');
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.venue?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || booking.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return styles[status] || styles.pending;
  };

  const getPurposeColor = (purpose) => {
    const colors = {
      class: 'bg-blue-100 text-blue-700',
      meeting: 'bg-purple-100 text-purple-700',
      seminar: 'bg-indigo-100 text-indigo-700',
      workshop: 'bg-pink-100 text-pink-700',
      exam: 'bg-orange-100 text-orange-700',
      event: 'bg-teal-100 text-teal-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[purpose] || colors.other;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      <Sidebar activePage="manage-bookings" />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-5 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 mb-1 sm:mb-2">Manage Bookings</h1>
            <p className="text-gray-600 text-xs sm:text-sm">Review and approve venue booking requests from users.</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-5 sm:mb-6 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by venue, user, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1.5 -mx-1 px-1">
              {filterCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveFilter(category.value)}
                  className={`px-4 sm:px-6 py-2 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-all flex-shrink-0 active:scale-95 ${
                    activeFilter === category.value
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-100'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && bookings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Loading bookings...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Bookings List */}
          <div className="space-y-3.5 sm:space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 text-purple-600">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 truncate">
                          {booking.title || 'Booking Request'}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm text-gray-600">
                          <span className="flex items-center gap-1 font-medium truncate">
                            <User size={14} className="text-purple-500 flex-shrink-0" />
                            {booking.user?.name || 'Unknown User'}
                          </span>
                          <span>•</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-3 sm:mb-4 bg-gray-50/60 p-3 rounded-xl">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Venue</p>
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{booking.venue?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Date</p>
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">{formatDate(booking.date)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Time</p>
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Purpose</p>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-medium ${getPurposeColor(booking.purpose)}`}>
                          {booking.purpose?.charAt(0).toUpperCase() + booking.purpose?.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {booking.notes && (
                      <div className="mb-3">
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Notes</p>
                        <p className="text-xs sm:text-sm text-gray-700 bg-purple-50/40 p-2.5 sm:p-3 rounded-xl border border-purple-50">{booking.notes}</p>
                      </div>
                    )}

                    <div className="text-xs sm:text-sm text-gray-500">
                      Expected Attendees: <span className="font-semibold text-gray-800">{booking.attendees || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === 'pending' && (
                    <div className="flex flex-row sm:flex-col lg:flex-row gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 sm:ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(booking._id)}
                        disabled={loading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 sm:py-2.5 rounded-xl transition font-medium text-xs sm:text-sm shadow-sm disabled:opacity-50"
                      >
                        <Check size={16} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(booking._id)}
                        disabled={loading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-4 py-2 sm:py-2.5 rounded-xl transition font-medium text-xs sm:text-sm shadow-sm disabled:opacity-50"
                      >
                        <X size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredBookings.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
              <Clock className="mx-auto text-gray-400 mb-3" size={40} />
              <p className="text-gray-500 text-sm sm:text-base">No bookings found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
