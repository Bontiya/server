'use strict';
const Router = require('express').Router();
const {
  queryLocation,
  getLocationDetail,
  reverseGeoLocation,
} = require('../controllers/LocationController');

Router.get('/search', queryLocation);
Router.get('/detail', getLocationDetail);
Router.get('/reverse', reverseGeoLocation);

module.exports = Router;
