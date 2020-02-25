'use strict';
const Router = require('express').Router();
const {
  queryLocation,
  getLocationDetail,
  reverseGeoLocation,
  getTravelDuration,
  routes,
  backupQuery
} = require('../controllers/LocationController');

Router.get('/search', backupQuery);
Router.get('/detail', getLocationDetail);
Router.get('/reverse', reverseGeoLocation);
Router.get('/duration', getTravelDuration);
Router.get('/routes', routes);

module.exports = Router;
