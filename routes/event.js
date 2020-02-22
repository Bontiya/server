'use strict';
const Router = require('express').Router();
const authentication = require('../middlewares/authentication');
const {
  createNewEvent,
  handleEventStatus,
  getEventDetail,
  getEvents,
  updateEvent,
  deleteEvent
} = require('../controllers/EventController');
const MemberController = require('../controllers/MemberController')

Router.post('/', authentication, createNewEvent);
Router.get('/', authentication, getEvents);
Router.get('/:eventId', authentication, getEventDetail);
Router.put('/:eventId', authentication, updateEvent);
Router.patch('/:eventId/status', authentication, handleEventStatus);
Router.delete('/:eventId', authentication, deleteEvent);

Router.post('/:eventId/members', authentication, MemberController.create)
Router.get('/members/status-invited/pending', authentication, MemberController.getStatusInvitedPending)
Router.delete('/:eventId/members/:memberId', authentication, MemberController.delete)
Router.patch('/members/:memberId/status-invited', authentication, MemberController.updateStatusInvited)

module.exports = Router;
