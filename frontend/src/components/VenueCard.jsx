import { Monitor, Users } from 'lucide-react';

const VenueCard = ({ name, capacity, status, type }) => {
  const statusColor = status === 'Available' ? 'text-green-500' : 'text-orange-500';
  const statusDot = status === 'Available' ? 'bg-green-500' : 'bg-orange-500';
  
  // Icon based on venue type
  const getVenueIllustration = () => {
    switch(type) {
      case 'classroom':
        return (
          <div className="relative h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-2">
                <div className="w-12 h-8 bg-purple-300 rounded-md shadow-lg"></div>
                <div className="w-12 h-8 bg-purple-200 rounded-md shadow-lg"></div>
                <div className="w-12 h-8 bg-purple-200 rounded-md shadow-lg"></div>
                <div className="w-12 h-8 bg-purple-300 rounded-md shadow-lg"></div>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex gap-1">
              <div className="w-3 h-3 bg-purple-800 rounded"></div>
              <div className="w-3 h-3 bg-purple-800 rounded"></div>
            </div>
          </div>
        );
      case 'lab':
        return (
          <div className="relative h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 mb-4">
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <Monitor className="text-purple-200" size={24} />
              <Monitor className="text-purple-200" size={24} />
              <Monitor className="text-purple-200" size={24} />
            </div>
            <div className="absolute bottom-2 right-2 flex gap-1">
              <div className="w-6 h-4 bg-purple-300 rounded"></div>
              <div className="w-4 h-6 bg-purple-200 rounded"></div>
            </div>
          </div>
        );
      case 'auditorium':
        return (
          <div className="relative h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 mb-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-12 bg-white rounded-md shadow-lg mb-2"></div>
              <div className="flex gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-purple-800 rounded-full"></div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-2 left-2 w-4 h-6 bg-purple-800 rounded-sm"></div>
            <div className="absolute bottom-2 right-2 w-4 h-6 bg-purple-800 rounded-sm"></div>
          </div>
        );
      case 'lecture-theater':
        return (
          <div className="relative h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 mb-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-24 h-10 bg-white rounded-md shadow-lg mb-2"></div>
              <div className="flex flex-col gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-1">
                    {[...Array(6)].map((_, j) => (
                      <div key={j} className="w-2 h-2 bg-purple-800 rounded"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'tutorial-room':
        return (
          <div className="relative h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2">
                <div className="w-8 h-6 bg-purple-300 rounded shadow-lg"></div>
                <div className="w-8 h-6 bg-purple-200 rounded shadow-lg"></div>
                <div className="w-8 h-6 bg-purple-300 rounded shadow-lg"></div>
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-purple-800 rounded-full"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <Monitor className="text-purple-200" size={32} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 p-5 hover:shadow-[0_8px_30px_rgba(139,92,246,0.3)] hover:border-purple-200 transition-all duration-300">
      <h3 className="text-xl font-semibold text-purple-700 mb-3">{name}</h3>
      
      {getVenueIllustration()}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={18} />
          <span className="text-sm">Capacity: {capacity}</span>
        </div>
        <div className={`flex items-center gap-2 ${statusColor} font-medium text-sm`}>
          <div className={`w-2 h-2 rounded-full ${statusDot}`}></div>
          <span>{status}</span>
        </div>
      </div>
      
      <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition duration-200 font-medium">
        View Details
      </button>
    </div>
  );
};

export default VenueCard;
