import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="text-center max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-5 sm:mb-6">
          <svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <Link 
          to="/dashboard"
          className="inline-block w-full sm:w-auto bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-medium px-6 py-2.5 sm:py-3 rounded-xl transition duration-200 text-sm sm:text-base shadow-md"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
