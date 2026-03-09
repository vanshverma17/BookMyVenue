# BookMyVenue Backend API

Backend API for BookMyVenue - A Campus Venue Management System built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Role-based authorization (Student, Staff, Admin)
- Venue management
- Booking system with conflict detection
- RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookmyvenue
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## Running the Application

Development mode with auto-restart:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Venues
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get single venue
- `POST /api/venues` - Create venue (Admin only)
- `PUT /api/venues/:id` - Update venue (Admin only)
- `DELETE /api/venues/:id` - Delete venue (Admin only)

### Bookings
- `GET /api/bookings` - Get bookings (Own bookings for users, all for admin)
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking (Staff/Admin only)
- `PUT /api/bookings/:id` - Update booking
- `PUT /api/bookings/:id/status` - Approve/Reject booking (Admin only)
- `DELETE /api/bookings/:id` - Delete booking

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── venueController.js # Venue CRUD operations
│   └── bookingController.js # Booking management
├── middleware/
│   └── auth.js            # JWT authentication & authorization
├── models/
│   ├── User.js            # User model
│   ├── Venue.js           # Venue model
│   └── Booking.js         # Booking model
├── routes/
│   ├── auth.js            # Auth routes
│   ├── venues.js          # Venue routes
│   └── bookings.js        # Booking routes
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── server.js              # Entry point
```

## User Roles

- **Student**: Can view venues and their own bookings
- **Staff**: Can view venues, create bookings, manage own bookings
- **Admin**: Full access to all features including venue management and booking approval

## License

ISC
