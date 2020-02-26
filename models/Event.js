"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name cannot be empty"]
  },
  location: {
    name: String,
    lat: Number,
    lon: Number
  },
  time: {
    type: String,
    required: [true, "Time cannot be empty"],
    validate: {
      validator: function (v) {
        const dateNow = new Date().getTime()
        const dateEvent = new Date(v).getTime()
        if (dateNow >= dateEvent) return false
        return true
      },
      message: 'date must be future'
    }
  },
  key: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["scheduled", "onGoing", "done"],
    required: true
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Member"
    }
  ],
  description: {
    type: String,
    required: true
  }
});

EventSchema.pre("save", function(next) {
  const event = this;
  event.status = "onGoing";
  next();
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
