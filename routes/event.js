'use strict';
const Router = require('express').Router();
const authentication = require('../middlewares/authentication');
const checkEventId = require('../middlewares/checkEventId');
const checkMemberId = require('../middlewares/checkMemberId');
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
Router.get('/:eventId', [authentication, checkEventId], getEventDetail);
Router.put('/:eventId', [authentication, checkEventId], updateEvent);
Router.patch('/:eventId/status', [authentication, checkEventId], handleEventStatus);
Router.delete('/:eventId', [authentication, checkEventId], deleteEvent);

Router.post('/:eventId/members', [authentication, checkEventId], MemberController.create)
Router.get('/members/status-invited/pending', authentication, MemberController.getStatusInvitedPending)
Router.delete('/:eventId/members/:memberId', [authentication, checkEventId, checkMemberId], MemberController.delete)
Router.patch('/members/:memberId/status-invited', [authentication, checkMemberId], MemberController.updateStatusInvited)

module.exports = Router;
