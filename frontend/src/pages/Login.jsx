import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/bookmyvenuelogo.png';
import { authApi } from '../lib/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const res = await authApi.login(email, password);
            const userData = res?.data;
            const token = res?.token;

            if (!token || !userData) {
                throw new Error('Login failed: missing token or user');
            }

            // Role comes from backend account; UI role toggle is kept for now but ignored.
            login({ user: userData, token });
            navigate('/dashboard');
        } catch (err) {
            setError(err?.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-3.5 sm:px-6 lg:px-8">
            <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full border border-gray-100">
                {/* Left Panel - Desktop Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-purple-300 opacity-20 rounded-full -top-1/2 -left-1/4 w-full h-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col justify-between p-8 text-white">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="BookMyVenue Logo" className="h-16 w-auto" />
                        </div>

                        {/* Main Content */}
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold">Welcome Back</h1>
                            <p className="text-base text-purple-100">
                                Manage college venues,<br />
                                classes & events with ease.
                            </p>
                        </div>

                        {/* Illustration */}
                        <div className="flex justify-start items-end">
                            <div className="relative">
                                <div className="bg-purple-400 bg-opacity-50 rounded-xl p-4 backdrop-blur-sm">
                                    <svg className="w-20 h-20 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-8 bg-gray-50/50">
                    <div className="max-w-md w-full space-y-5 sm:space-y-6">
                    {/* Mobile Brand Header */}
                    <div className="flex items-center gap-2.5 lg:hidden mb-2">
                        <img src={logo} alt="BookMyVenue Logo" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-purple-700">BookMyVenue</span>
                    </div>

                    {/* Header */}
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700">Login</h2>
                        <p className="mt-1 text-xs sm:text-sm text-gray-600">Hi, welcome back!</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                I am a
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl border-2 transition text-xs sm:text-sm font-medium active:scale-95 ${
                                        role === 'student'
                                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('staff')}
                                    className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl border-2 transition text-xs sm:text-sm font-medium active:scale-95 ${
                                        role === 'staff'
                                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Staff
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl border-2 transition text-xs sm:text-sm font-medium active:scale-95 ${
                                        role === 'admin'
                                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Admin
                                </button>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="john_smithe@gmail.co"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none relative block w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-gray-700 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <div>
                                <a href="#" className="font-medium text-gray-600 hover:text-purple-600">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            {error ? (
                                <div className="mb-3 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                    {error}
                                </div>
                            ) : null}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm sm:text-base font-semibold rounded-xl text-white bg-purple-600 hover:bg-purple-700 active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition shadow-md disabled:opacity-50"
                            >
                                {submitting ? 'Logging in…' : 'Log in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Login;