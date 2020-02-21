'use strict';
const Router = require('express').Router();
const {
  createNewEvent,
  handleEventStatus,
} = require('../controllers/EventController');

Router.post('/', createNewEvent);
Router.patch('/', handleEventStatus);
// Router.delete('/:id')

module.exports = Router;
