'use strict';
const Router = require('express').Router();
const {
  queryLocation,
  getLocationDetail,
  reverseGeoLocation,
  getTravelDuration,
  routes,
} = require('../controllers/LocationController');

Router.get('/search', queryLocation);
Router.get('/detail', getLocationDetail);
Router.get('/reverse', reverseGeoLocation);
Router.get('/duration', getTravelDuration);
Router.get('/routes', routes);

module.exports = Router;
