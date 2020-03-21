const mongoose = require('mongoose');

const MarkersSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
});

module.exports = Marker = mongoose.model('marker', MarkersSchema);
