const Booking = require('../models/Booking');
const Venue = require('../models/Venue');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    let query = {};

    // If not admin, show only user's bookings
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by venue
    if (req.query.venue) {
      query.venue = req.query.venue;
    }

    const bookings = await Booking.find(query)
      .populate('venue', 'name type capacity location')
      .populate('user', 'name email department')
      .populate('approvedBy', 'name email')
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('venue', 'name type capacity location')
      .populate('user', 'name email department')
      .populate('approvedBy', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Staff/Admin)
exports.createBooking = async (req, res) => {
  try {
    const { venue, startTime, endTime, attendees } = req.body;

    // Check if venue exists
    const venueExists = await Venue.findById(venue);
    if (!venueExists) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }

    // Check venue capacity
    if (attendees > venueExists.capacity) {
      return res.status(400).json({
        success: false,
        message: `Number of attendees exceeds venue capacity of ${venueExists.capacity}`
      });
    }

    // Check for booking conflicts
    const hasConflict = await Booking.checkConflict(venue, new Date(startTime), new Date(endTime));
    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: 'Venue is already booked for the selected time slot'
      });
    }

    req.body.user = req.user.id;

    const booking = await Booking.create(req.body);

    const populatedBooking = await Booking.findById(booking._id)
      .populate('venue', 'name type capacity location')
      .populate('user', 'name email department');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to update
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // If updating time, check for conflicts
    if (req.body.startTime || req.body.endTime) {
      const startTime = req.body.startTime ? new Date(req.body.startTime) : booking.startTime;
      const endTime = req.body.endTime ? new Date(req.body.endTime) : booking.endTime;
      const venueId = req.body.venue || booking.venue;

      const hasConflict = await Booking.checkConflict(venueId, startTime, endTime, booking._id);
      if (hasConflict) {
        return res.status(400).json({
          success: false,
          message: 'Venue is already booked for the selected time slot'
        });
      }
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('venue', 'name type capacity location')
      .populate('user', 'name email department');

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve/Reject booking
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    if (status === 'approved') {
      booking.approvedBy = req.user.id;
    }
    if (status === 'rejected' && rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }

    await booking.save();

    booking = await Booking.findById(booking._id)
      .populate('venue', 'name type capacity location')
      .populate('user', 'name email department')
      .populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to delete
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this booking'
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
