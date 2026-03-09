const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a venue name'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please add a venue type'],
    enum: ['classroom', 'lab', 'auditorium', 'lecture-theater', 'tutorial-room', 'library', 'other']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity'],
    min: 1
  },
  location: {
    building: {
      type: String,
      required: true
    },
    floor: {
      type: String,
      required: true
    },
    roomNumber: String
  },
  facilities: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance', 'Inactive'],
    default: 'Available'
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Update the updatedAt timestamp before saving
venueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Venue', venueSchema);
