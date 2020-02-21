'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be empty'],
  },
  location: {
    name: String,
    lat: Number,
    lon: Number,
  },
  time: {
    type: String,
    required: [true, 'Time cannot be empty'],
  },
  key: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  members: [],
  admin: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

EventSchema.pre('save', function(next) {
  const event = this;
  event.status = 'scheduled';
  next();
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
