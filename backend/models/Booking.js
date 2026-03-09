const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: [true, 'Please specify a venue']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Please add a booking title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: [true, 'Please specify start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please specify end time']
  },
  purpose: {
    type: String,
    required: [true, 'Please specify the purpose'],
    enum: ['class', 'meeting', 'seminar', 'workshop', 'exam', 'event', 'other']
  },
  attendees: {
    type: Number,
    required: [true, 'Please specify number of attendees'],
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validate that end time is after start time
bookingSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
  }
  this.updatedAt = Date.now();
  next();
});

// Check for booking conflicts
bookingSchema.statics.checkConflict = async function(venueId, startTime, endTime, excludeBookingId = null) {
  const query = {
    venue: venueId,
    status: { $in: ['pending', 'approved'] },
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflicts = await this.find(query);
  return conflicts.length > 0;
};

module.exports = mongoose.model('Booking', bookingSchema);
