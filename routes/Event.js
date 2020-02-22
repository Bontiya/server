'use strict';
const Router = require('express').Router();
const authentication = require('../middlewares/authentication');
const {
  createNewEvent,
  handleEventStatus,
  getEventDetail,
} = require('../controllers/EventController');
const MemberController = require('../controllers/MemberController')

Router.post('/', authentication, createNewEvent);
Router.get('/:eventid', authentication, getEventDetail);
Router.patch('/', authentication, handleEventStatus);
// Router.delete('/:id')

Router.post('/:eventid/members', authentication, MemberController.create)

module.exports = Router;
