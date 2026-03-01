import { Calendar, Building2, Clock, Bell, MapPin } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  // Sample data
  const stats = [
    { title: "Today's Bookings", value: 5, color: 'bg-purple-400', icon: Calendar },
    { title: 'Available Venues', value: 12, color: 'bg-teal-400', icon: Building2 },
    { title: 'Pending Approvals', value: 3, color: 'bg-orange-400', icon: Clock }
  ];

  const upcomingSchedule = [
    { id: 1, title: 'Biology Periview', type: 'Room • 203', location: 'F001M 2023', time: '10:00 AM - 1:00 AM', status: 'This to Review', statusColor: 'text-orange-500' },
    { id: 2, title: 'Glense Acomper', type: 'Guest Lecture', location: 'Auditorium', time: '3:00 PM - 5:00 PM', statusColor: 'text-green-500' },
    { id: 3, title: 'Math= Arrhest..', type: 'Math Workshop', location: 'Seminar Hall', time: '9:00 AM - 1:00 AM', statusColor: 'text-green-500' }
  ];

  const recentBookings = [
    { venue: 'Room 305', date: 'Apr 22, 2024', status: 'Approved', statusColor: 'text-green-500' },
    { venue: 'Seminar Hall', date: 'Apr 21, 2024', status: 'Pending', statusColor: 'text-yellow-500' },
    { venue: 'Auditorium', date: 'Apr 20, 2024', status: 'Pending', statusColor: 'text-blue-400' },
    { venue: 'Library', date: 'Apr 19, 2024', status: 'Approved', statusColor: 'text-green-500' }
  ];

  // Student-specific data
  const notices = [
    { id: 1, title: 'Exam Schedule Released', message: 'Mid-term examination schedule has been posted. Check your portal for details.', time: '2 hours ago', priority: 'high' },
    { id: 2, title: 'Library Hours Extended', message: 'Library will remain open until 10 PM during exam week.', time: '5 hours ago', priority: 'medium' },
    { id: 3, title: 'Sports Day Registration', message: 'Register for annual sports day events before April 25th.', time: '1 day ago', priority: 'low' }
  ];

  const todayEvents = [
    { id: 1, title: 'Guest Lecture: AI & Machine Learning', venue: 'Auditorium', time: '10:00 AM - 12:00 PM', organizer: 'Computer Science Dept', status: 'Ongoing' },
    { id: 2, title: 'Workshop: Web Development', venue: 'Lab 203', time: '2:00 PM - 5:00 PM', organizer: 'Tech Club', status: 'Upcoming' },
    { id: 3, title: 'Cultural Committee Meeting', venue: 'Seminar Hall', time: '4:00 PM - 5:30 PM', organizer: 'Cultural Committee', status: 'Upcoming' }
  ];

  // removed student-only `myBookings` (not used in UI)

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
      <Sidebar activePage="dashboard" />

      <div className="flex-1 p-4 overflow-y-auto h-full">
        <div className="mb-4">
          <div>
            <h1 className="text-4xl font-bold text-purple-600 mb-2">Hello, {user?.name || 'User'}!</h1>
            <p className="text-gray-600">{isStudent ? 'Stay updated with notices, events, and your bookings.' : 'Welcome to your venue management dashboard.'}</p>
          </div>
        </div>

        {/* Stats Cards - shown only for non-student roles */}
        {!isStudent && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className={`${stat.color} rounded-2xl p-4 text-white shadow-lg`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white/90 font-medium mb-2">{stat.title}</p>
                    <p className="text-4xl font-bold">{stat.value}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <stat.icon size={32} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isStudent ? (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-purple-600">Important Notices</h2>
              </div>
              <div className="space-y-3">
                {notices.map((notice) => (
                  <div key={notice.id} className={`p-3 rounded-lg border-l-4 ${notice.priority === 'high' ? 'bg-red-50 border-red-500' : notice.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' : 'bg-blue-50 border-blue-500'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{notice.title}</h3>
                        <p className="text-sm text-gray-600">{notice.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">{notice.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="text-purple-600" size={24} />
                  <h2 className="text-xl font-bold text-purple-600">Events Today</h2>
                </div>

                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-purple-700 flex-1">{event.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${event.status === 'Ongoing' ? 'bg-green-200 text-green-700' : 'bg-blue-200 text-blue-700'}`}>{event.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <MapPin size={16} />
                        <span className="font-medium">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Clock size={16} />
                        <span>{event.time}</span>
                      </div>
                      <p className="text-xs text-gray-500">By {event.organizer}</p>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">View All Events</button>
              </div>
            
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <h2 className="text-xl font-bold text-purple-600 mb-4">Upcoming Schedule</h2>
                <p className="text-gray-500 text-sm mb-4">April 2024</p>

                <div className="space-y-3">
                  {upcomingSchedule.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="text-purple-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-purple-700">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.type}</p>
                        <p className="text-xs text-gray-500">{item.location}</p>
                      </div>
                      <div className="text-right">
                        {item.status && <p className="text-xs text-orange-500 mb-1">{item.status}</p>}
                        <p className="text-xs text-gray-600">{item.time}</p>
                        <p className={`text-xs font-semibold ${item.statusColor}`}>0.0 PPM</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">View Schedule</button>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-purple-600">Recent Bookings</h2>
                  <a href="#" className="text-purple-600 text-sm hover:underline">View All »</a>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-sm text-gray-500 font-medium">Venue</th>
                        <th className="text-left py-3 text-sm text-gray-500 font-medium">Date</th>
                        <th className="text-left py-3 text-sm text-gray-500 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3 text-gray-800">{booking.venue}</td>
                          <td className="py-3 text-gray-600">{booking.date}</td>
                          <td className={`py-3 font-medium ${booking.statusColor}`}>{booking.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button className="bg-purple-500 text-white py-2 px-3 rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2">
                    <Calendar size={20} />
                    <span>Book a Venue</span>
                  </button>
                  <button className="bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2">
                    <Building2 size={20} />
                    <span>Manage Venues</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;