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
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="manage-bookings" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-purple-700 mb-2">Manage Bookings</h1>
            <p className="text-gray-600">Review and approve venue booking requests from users.</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by venue, user, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filterCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveFilter(category.value)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                    activeFilter === category.value
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-purple-50'
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
              <p className="text-gray-500">Loading bookings...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="text-purple-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {booking.title || 'Booking Request'}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User size={16} />
                            {booking.user?.name || 'Unknown User'}
                          </span>
                          <span>•</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Venue</p>
                        <p className="font-semibold text-gray-900">{booking.venue?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(booking.date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Time</p>
                        <p className="font-semibold text-gray-900">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Purpose</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPurposeColor(booking.purpose)}`}>
                          {booking.purpose?.charAt(0).toUpperCase() + booking.purpose?.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {booking.notes && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
                      </div>
                    )}

                    <div className="text-sm text-gray-500">
                      Expected Attendees: <span className="font-medium text-gray-700">{booking.attendees || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(booking._id)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-medium disabled:opacity-50"
                      >
                        <Check size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(booking._id)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium disabled:opacity-50"
                      >
                        <X size={18} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredBookings.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Clock className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No bookings found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
