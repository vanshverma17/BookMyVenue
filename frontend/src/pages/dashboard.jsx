import { useState, useEffect } from 'react';
import { Calendar, Building2, Clock, Bell, MapPin, AlertCircle, RefreshCw, User, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { bookingsApi } from '../lib/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      todayBookings: 0,
      availableVenues: 0,
      totalVenues: 0,
      pendingApprovals: 0
    },
    upcomingSchedule: [],
    todayEvents: [],
    recentBookings: []
  });

  const fetchDashboardData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');

      const res = await bookingsApi.getStats();
      if (res?.success && res?.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError(err?.message || 'Failed to load dashboard data from server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Today's Bookings",
      value: dashboardData.stats?.todayBookings ?? 0,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      icon: Calendar,
      desc: isStudent ? 'Approved events today' : 'Scheduled sessions for today'
    },
    {
      title: 'Available Venues',
      value: dashboardData.stats?.availableVenues ?? 0,
      color: 'bg-gradient-to-r from-teal-500 to-teal-600',
      icon: Building2,
      desc: `Out of ${dashboardData.stats?.totalVenues ?? 0} total venues`
    },
    {
      title: isAdmin ? 'Pending Approvals' : 'My Pending Requests',
      value: dashboardData.stats?.pendingApprovals ?? 0,
      color: 'bg-gradient-to-r from-orange-500 to-amber-600',
      icon: Clock,
      desc: isAdmin ? 'Awaiting your review' : 'Under admin review'
    }
  ];

  const notices = [
    {
      id: 1,
      title: 'Exam Schedule & Venue Allocation',
      message: 'Mid-term examination hall allocations have been updated in the portal.',
      time: 'Today',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Library Extended Hours',
      message: 'Central Library study halls remain open until 10:00 PM on weekdays.',
      time: 'Yesterday',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Campus Seminar & Workshops',
      message: 'Check upcoming guest lectures and lab workshops scheduled this week.',
      time: '2 days ago',
      priority: 'low'
    }
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeRange = (startStr, endStr) => {
    if (!startStr) return 'N/A';
    const start = new Date(startStr);
    const end = endStr ? new Date(endStr) : null;
    if (isNaN(start.getTime())) return 'N/A';

    const startFormatted = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (!end || isNaN(end.getTime())) return startFormatted;

    const endFormatted = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${startFormatted} - ${endFormatted}`;
  };

  const getEventStatus = (startStr, endStr) => {
    const now = new Date();
    const start = new Date(startStr);
    const end = new Date(endStr);

    if (now >= start && now <= end) {
      return { label: 'Ongoing', style: 'bg-green-100 text-green-700 font-semibold' };
    } else if (now < start) {
      return { label: 'Upcoming', style: 'bg-blue-100 text-blue-700 font-semibold' };
    } else {
      return { label: 'Completed', style: 'bg-gray-100 text-gray-600 font-semibold' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { text: 'Approved', style: 'text-green-600 bg-green-50 border border-green-200' };
      case 'pending':
        return { text: 'Pending', style: 'text-amber-600 bg-amber-50 border border-amber-200' };
      case 'rejected':
        return { text: 'Rejected', style: 'text-red-600 bg-red-50 border border-red-200' };
      case 'cancelled':
        return { text: 'Cancelled', style: 'text-gray-600 bg-gray-50 border border-gray-200' };
      default:
        return { text: status || 'Unknown', style: 'text-purple-600 bg-purple-50 border border-purple-200' };
    }
  };

  const currentMonthYear = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
      <Sidebar activePage="dashboard" />

      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto h-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 mb-1">
              Hello, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              {isStudent
                ? 'Stay updated with live notices, today events, and campus venues.'
                : 'Welcome to your real-time venue and booking management dashboard.'}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-1.5 sm:gap-2 bg-white text-purple-700 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl shadow-sm border border-purple-100 hover:bg-purple-50 transition text-xs sm:text-sm font-medium disabled:opacity-50 active:scale-95"
              title="Refresh dashboard data"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            {!isStudent && (
              <button
                onClick={() => navigate('/book-venue')}
                className="flex items-center gap-1.5 sm:gap-2 bg-purple-600 text-white px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl shadow-md hover:bg-purple-700 transition text-xs sm:text-sm font-medium active:scale-95"
              >
                <Calendar size={15} />
                <span>Book Venue</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchDashboardData()}
              className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm animate-pulse h-28 sm:h-32 flex items-center justify-between">
                <div className="space-y-2.5 flex-1">
                  <div className="h-3.5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-7 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Cards - shown for staff and admin */}
        {!loading && !isStudent && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.color} rounded-2xl p-4 sm:p-5 text-white shadow-lg transition-transform hover:-translate-y-0.5 duration-200`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/90 text-xs sm:text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">{stat.value}</p>
                    <p className="text-white/75 text-[11px] sm:text-xs mt-1.5">{stat.desc}</p>
                  </div>
                  <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl backdrop-blur-sm">
                    <stat.icon size={24} className="sm:w-7 sm:h-7" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Student View */}
        {isStudent ? (
          <>
            {/* Quick overview cards for student */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-xs sm:text-sm font-medium mb-1">Today's Campus Events</p>
                    <p className="text-2xl sm:text-3xl font-bold">{dashboardData.todayEvents?.length ?? 0}</p>
                    <p className="text-white/75 text-[11px] sm:text-xs mt-1">Happening in campus halls and labs</p>
                  </div>
                  <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl">
                    <Calendar size={24} className="sm:w-7 sm:h-7" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-xs sm:text-sm font-medium mb-1">Available Campus Venues</p>
                    <p className="text-2xl sm:text-3xl font-bold">{dashboardData.stats?.availableVenues ?? 0}</p>
                    <p className="text-white/75 text-[11px] sm:text-xs mt-1">Ready for bookings & classes</p>
                  </div>
                  <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl">
                    <Building2 size={24} className="sm:w-7 sm:h-7" />
                  </div>
                </div>
              </div>
            )}

            {/* Important Notices */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-purple-50 mb-5 sm:mb-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Bell className="text-purple-600" size={20} />
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Important Notices</h2>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className={`p-3 sm:p-3.5 rounded-xl border-l-4 transition hover:shadow-sm ${
                      notice.priority === 'high'
                        ? 'bg-red-50/70 border-red-500'
                        : notice.priority === 'medium'
                        ? 'bg-amber-50/70 border-amber-500'
                        : 'bg-blue-50/70 border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">{notice.title}</h3>
                        <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">{notice.message}</p>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-gray-500 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full border border-gray-100 flex-shrink-0">
                        {notice.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Today */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-purple-50 mb-5 sm:mb-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-purple-600" size={20} />
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">Events Today</h2>
                </div>
                <span className="text-xs text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full font-medium">
                  {dashboardData.todayEvents?.length ?? 0} Events
                </span>
              </div>

              {dashboardData.todayEvents && dashboardData.todayEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {dashboardData.todayEvents.map((event) => {
                    const statusObj = getEventStatus(event.startTime, event.endTime);
                    return (
                      <div key={event._id} className="p-3.5 sm:p-4 bg-purple-50/60 rounded-xl border border-purple-100 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-semibold text-purple-900 text-xs sm:text-sm leading-tight flex-1">
                              {event.title}
                            </h3>
                            <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full ${statusObj.style}`}>
                              {statusObj.label}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-gray-600 mb-2.5 sm:mb-3">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={13} className="text-purple-500 flex-shrink-0" />
                              <span className="font-medium text-gray-800 truncate">{event.venue?.name || 'Venue'}</span>
                              {event.venue?.location?.building && (
                                <span className="text-gray-500 text-[11px]">({event.venue.location.building})</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={13} className="text-purple-500 flex-shrink-0" />
                              <span className="text-[11px] sm:text-xs">{formatTimeRange(event.startTime, event.endTime)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 pt-2 border-t border-purple-100 truncate">
                          By {event.user?.name || 'Department'} {event.user?.department ? `• ${event.user.department}` : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-xl">
                  <Calendar className="mx-auto text-gray-400 mb-2" size={28} />
                  <p className="text-gray-500 text-xs sm:text-sm">No events or classes scheduled for today.</p>
                </div>
              )}

              <button
                onClick={() => navigate('/venues')}
                className="w-full mt-3.5 sm:mt-4 bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 active:scale-98 transition text-xs sm:text-sm font-medium shadow-sm"
              >
                Browse Campus Venues
              </button>
            </div>
          </>
        ) : (
          /* Staff & Admin View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Upcoming Schedule */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-purple-50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Upcoming Schedule</h2>
                    <p className="text-gray-400 text-[11px] sm:text-xs">{currentMonthYear}</p>
                  </div>
                  <span className="text-xs text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full font-medium">
                    {dashboardData.upcomingSchedule?.length ?? 0} Upcoming
                  </span>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {dashboardData.upcomingSchedule && dashboardData.upcomingSchedule.length > 0 ? (
                    dashboardData.upcomingSchedule.map((item) => {
                      const badge = getStatusBadge(item.status);
                      return (
                        <div key={item._id} className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-purple-50/60 hover:bg-purple-50 rounded-xl border border-purple-100 transition">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 text-purple-600">
                            <Calendar size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-purple-950 text-xs sm:text-sm truncate">{item.title}</h3>
                            <p className="text-xs text-gray-600 truncate">
                              {item.venue?.name || 'Venue'} {item.venue?.type ? `• ${item.venue.type}` : ''}
                            </p>
                            <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
                              {item.venue?.location?.building ? `${item.venue.location.building}` : ''}
                              {item.venue?.location?.floor ? `, ${item.venue.location.floor}` : ''}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 pl-1">
                            <span className={`inline-block text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium mb-1 ${badge.style}`}>
                              {badge.text}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-gray-600 font-medium">
                              {formatDate(item.startTime)}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-gray-500">
                              {formatTimeRange(item.startTime, item.endTime)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <Calendar className="mx-auto text-gray-400 mb-2" size={28} />
                      <p className="text-gray-500 text-xs sm:text-sm">No upcoming bookings found.</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate(isAdmin ? '/manage-bookings' : '/my-bookings')}
                className="w-full mt-3.5 sm:mt-4 bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 active:scale-98 transition text-xs sm:text-sm font-medium shadow-sm"
              >
                View Full Schedule
              </button>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-purple-50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Recent Bookings</h2>
                    <p className="text-gray-400 text-[11px] sm:text-xs">Latest booking requests</p>
                  </div>
                  <button
                    onClick={() => navigate(isAdmin ? '/manage-bookings' : '/my-bookings')}
                    className="text-purple-600 text-xs font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto -mx-1 sm:mx-0">
                  <table className="w-full text-left min-w-[280px]">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        <th className="py-2 px-2">Venue / Title</th>
                        <th className="py-2 px-2">Date & Time</th>
                        <th className="py-2 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {dashboardData.recentBookings && dashboardData.recentBookings.length > 0 ? (
                        dashboardData.recentBookings.map((booking) => {
                          const badge = getStatusBadge(booking.status);
                          return (
                            <tr key={booking._id} className="hover:bg-purple-50/40 transition">
                              <td className="py-2.5 px-2">
                                <p className="font-semibold text-gray-900 truncate max-w-[110px] sm:max-w-[150px]">
                                  {booking.venue?.name || 'Venue'}
                                </p>
                                <p className="text-[10px] sm:text-[11px] text-gray-500 truncate max-w-[110px] sm:max-w-[150px]">
                                  {booking.title}
                                </p>
                              </td>
                              <td className="py-2.5 px-2 text-gray-600">
                                <p className="font-medium text-gray-800 text-[11px] sm:text-xs">{formatDate(booking.startTime || booking.date)}</p>
                                <p className="text-[10px] sm:text-[11px] text-gray-500">{formatTimeRange(booking.startTime, booking.endTime)}</p>
                              </td>
                              <td className="py-2.5 px-2 text-right">
                                <span className={`inline-block text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium ${badge.style}`}>
                                  {badge.text}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="3" className="py-6 sm:py-8 text-center text-gray-400 text-xs sm:text-sm">
                            No recent bookings found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-4 pt-2">
                <button
                  onClick={() => navigate('/book-venue')}
                  className="bg-purple-500 hover:bg-purple-600 active:scale-98 text-white py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm font-medium shadow-sm"
                >
                  <Calendar size={15} />
                  <span>Book a Venue</span>
                </button>
                <button
                  onClick={() => navigate(isAdmin ? '/manage-venues' : '/venues')}
                  className="bg-purple-700 hover:bg-purple-800 active:scale-98 text-white py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm font-medium shadow-sm"
                >
                  <Building2 size={15} />
                  <span>{isAdmin ? 'Manage Venues' : 'View Venues'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;