const express = require('express');
const router = express.Router();
const {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue
} = require('../controllers/venueController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getVenues)
  .post(protect, authorize('admin'), createVenue);

router.route('/:id')
  .get(getVenue)
  .put(protect, authorize('admin'), updateVenue)
  .delete(protect, authorize('admin'), deleteVenue);

module.exports = router;
