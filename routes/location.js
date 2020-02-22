'use strict';
const Router = require('express').Router();
const {
  queryLocation,
  getLocationDetail
} = require('../controllers/LocationController');

Router.get('/search', queryLocation);
Router.get('/detail', getLocationDetail);

module.exports = Router;
