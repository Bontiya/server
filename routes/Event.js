'use strict';
const Router = require('express').Router();
const {
  createNewEvent,
  handleEventStatus,
  getEventDetail,
} = require('../controllers/EventController');

Router.post('/', createNewEvent);
Router.get('/:eventid', getEventDetail);
Router.patch('/', handleEventStatus);
// Router.delete('/:id')

module.exports = Router;
