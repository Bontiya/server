'use strict';
const Event  = require('../models/Event');

class EventController {
  static async createNewEvent(req, res, next) {
    try {
      // const { id } = req.token;
      const { name, location, time, key } = req.body;
      const description = req.body.description || 'Description not available';
      const eventDetail = {
        name,
        location,
        time,
        key,
        description,
        admin: req.userId,
        status: 'scheduled'
      };
      const response = await Event.create(eventDetail);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
  static async getEventDetail(req, res, next) {
    try {
      const { eventid } = req.params;
      const detail = Event.findOne(
        { _id: eventid }).populate('admin') // populate admin dan members juga
      res.status(200).json(detail);
    } catch (err) {
      next(err);
    }
  }
  static async handleEventStatus(req, res, next) {
    try {
      const { eventid } = req.params;
      const { status } = req.body;
      if (status === 'scheduled' || status === 'ongoing' || status === 'done') {
        const updated = await Event.findByIdAndUpdate(
          { _id: eventid },
          { $set: { status: status } },
          { new: true },
        );
        res.status(200).json(updated);
      } else {
        // ERROR
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EventController;
