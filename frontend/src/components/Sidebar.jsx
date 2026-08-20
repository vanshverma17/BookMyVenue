import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Building2, 
  CheckCircle, 
  LogOut, 
  LayoutDashboard, 
  ClipboardList, 
  Menu, 
  X,
  User as UserIcon
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/bookmyvenuelogo.png';

const Sidebar = ({ activePage = 'dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // Close mobile drawer when route changes (adjust state during render per React 19 best practices)
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileOpen(false);
  }


  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if user should see specific menu items
  const canBookVenue = user?.role === 'staff' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const navLinks = [
    {
      to: '/dashboard',
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      to: '/venues',
      id: 'venues',
      label: 'Venues',
      icon: Building2,
      show: true,
    },
    {
      to: '/book-venue',
      id: 'book-venue',
      label: 'Book Venue',
      icon: Calendar,
      show: canBookVenue,
    },
    {
      to: '/my-bookings',
      id: 'my-bookings',
      label: 'My Bookings',
      icon: CheckCircle,
      show: canBookVenue,
    },
  ];

  const adminLinks = [
    {
      to: '/manage-venues',
      id: 'manage-venues',
      label: 'Manage Venues',
      icon: Building2,
      show: isAdmin,
    },
    {
      to: '/manage-bookings',
      id: 'manage-bookings',
      label: 'Booking Requests',
      icon: ClipboardList,
      show: isAdmin,
    },
  ];

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md z-30 sticky top-0 flex-shrink-0 w-full">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="BookMyVenue Logo" className="h-9 w-auto" />
          <span className="text-lg font-bold tracking-tight text-white">BookMyVenue</span>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-purple-500/50 border border-purple-400/40 px-2.5 py-1 rounded-full">
              {user.role}
            </span>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-purple-500/40 hover:bg-purple-500 active:scale-95 transition-all text-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer & Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-gradient-to-b from-purple-700 via-purple-800 to-purple-900 text-white p-5 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-600/60">
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="BookMyVenue Logo" className="h-10 w-auto" />
                <span className="text-lg font-bold text-white">BookMyVenue</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition active:scale-95"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
              {navLinks.filter(item => item.show).map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition duration-200 ${
                      isActive 
                        ? 'bg-white text-purple-700 shadow-md font-semibold' 
                        : 'text-purple-100 hover:bg-purple-600/70 hover:text-white'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-purple-700' : 'text-purple-200'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isAdmin && (
                <div className="pt-4 mt-3 border-t border-purple-600/60">
                  <p className="text-purple-300 text-xs uppercase tracking-wider px-4 mb-2 font-semibold">
                    Admin Tools
                  </p>
                  <div className="space-y-1.5">
                    {adminLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = activePage === item.id;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition duration-200 ${
                            isActive 
                              ? 'bg-white text-purple-700 shadow-md font-semibold' 
                              : 'text-purple-100 hover:bg-purple-600/70 hover:text-white'
                          }`}
                        >
                          <Icon size={20} className={isActive ? 'text-purple-700' : 'text-purple-200'} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </nav>

            {/* Mobile User Profile & Logout */}
            <div className="mt-auto pt-4 border-t border-purple-600/60">
              {user && (
                <div className="p-3 mb-3 bg-purple-800/60 rounded-xl border border-purple-500/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/80 flex items-center justify-center font-bold text-white shadow-inner flex-shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{user.name || user.email}</p>
                    <p className="text-xs text-purple-300 capitalize">{user.role}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-purple-600/80 hover:bg-red-600 text-white w-full transition duration-200 font-medium shadow-sm active:scale-98"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Exact original desktop styling and layout */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-purple-600 to-purple-700 text-white p-4 flex-col h-full flex-shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="BookMyVenue Logo" className="h-12 w-auto" />
          <span className="text-xl font-bold text-white">BookMyVenue</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activePage === 'dashboard' ? 'bg-purple-500' : 'hover:bg-purple-500'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/venues" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activePage === 'venues' ? 'bg-purple-500' : 'hover:bg-purple-500'
            }`}
          >
            <Building2 size={20} />
            <span>Venues</span>
          </Link>
          
          {canBookVenue && (
            <>
              <Link 
                to="/book-venue" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activePage === 'book-venue' ? 'bg-purple-500' : 'hover:bg-purple-500'
                }`}
              >
                <Calendar size={20} />
                <span>Book Venue</span>
              </Link>
              <Link 
                to="/my-bookings" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activePage === 'my-bookings' ? 'bg-purple-500' : 'hover:bg-purple-500'
                }`}
              >
                <CheckCircle size={20} />
                <span>My Bookings</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <div className="pt-6">
              <p className="text-purple-300 text-sm uppercase tracking-wider px-4 mb-2">Admin</p>
              <Link 
                to="/manage-venues" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activePage === 'manage-venues' ? 'bg-purple-500' : 'hover:bg-purple-500'
                }`}
              >
                <Building2 size={20} />
                <span>Manage Venues</span>
              </Link>
              <Link 
                to="/manage-bookings" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activePage === 'manage-bookings' ? 'bg-purple-500' : 'hover:bg-purple-500'
                }`}
              >
                <ClipboardList size={20} />
                <span>Booking Requests</span>
              </Link>
            </div>
          )}
        </nav>

        {/* User Info & Logout Button */}
        <div className="mt-auto pt-4 border-t border-purple-500">
          {user && (
            <div className="px-4 py-2 mb-2">
              <p className="text-sm text-purple-200">Logged in as</p>
              <p className="text-white font-medium truncate">{user.email}</p>
              <p className="text-xs text-purple-300 capitalize">{user.role}</p>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-purple-500 text-white w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

