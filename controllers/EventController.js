'use strict';
const Event  = require('../models/Event');
const Member = require('../models/Member');


const _populateMember = {
  path: 'members',
  populate: {
    path: 'user',
    select: '-password -provider'
  }
}

class EventController {
  static async createNewEvent(req, res, next) {
    try {
      const { name, location, time, key } = req.body;
      const description = req.body.description || 'Description not available';
      const eventDetail = {
        name,
        location,
        time,
        key,
        description,
        status: 'scheduled'
      };
      const event = await Event.create(eventDetail);
      const member = await Member.create({
        event: event._id,
        user: req.userId,
        role: 'host',
        statusKey: false,
        statusInvited: 'received'
      })
      await Event.updateOne({ _id: event._id }, {
        $push: {
          members: [member._id]
        }
      })
      const getEvent = await Event
                              .findOne({ _id: event._id })
                              .populate(_populateMember)
      res.status(201).json(getEvent);
    } catch (err) {
      next(err);
    }
  }
  static async getEventDetail(req, res, next) {
    try {
      const { eventId } = req.params;
      const detail = await Event
                            .findOne({ _id: eventId })
                            .populate(_populateMember)
      res.status(200).json(detail);
    } catch (err) {
      next(err);
    }
  }

  static async getEvents(req, res, next) {
    let options = {
      user: req.userId
    }
    if (req.query.status) {
      options.status = req.query.status
    }
    try {
      const members = await Member
                            .find(options)
                            .populate({
                              path: 'event',
                              populate: {
                                ..._populateMember
                              }
                            })
      const events = []
      members.forEach(member => {
        events.push(member.event)
      })
      res.status(200).json(events)
    } catch (error) {
      next(error)
    }
  }

  static async updateEvent (req, res, next) {
    try {
      const { name, location, time, key, description } = req.body
      const  { eventId } = req.params
      const updated = await Event.findByIdAndUpdate(
        { _id: eventId }, 
        { $set: { name, location, time, key, description } },
        { new: true },
      )
      res.status(200).json(updated);
    } catch (error) {
      next(error)
    }
  }

  static async handleEventStatus(req, res, next) {
    try {
      const { eventId } = req.params;
      const { status } = req.body;

      const updated = await Event.findByIdAndUpdate(
        { _id: eventId },
        { $set: { status } },
        { new: true },
      );
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async deleteEvent (req, res, next) {
    try {
      const { eventId } = req.params;
      const event = Event.findById(eventId)

      await Event.deleteOne({ _id: eventId })
      await Member.deleteMany(event.members)

      res.status(200).json({
        _id: eventId,
        ok: 'ok'
      })

    } catch (error) {
      next(error)
    }
  }
}

module.exports = EventController;
