const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  getDashboardStats
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);

router.route('/')
  .get(protect, getBookings)
  .post(protect, authorize('staff', 'admin'), createBooking);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateBookingStatus);

module.exports = router;

