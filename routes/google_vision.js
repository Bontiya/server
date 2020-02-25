'use strict';
const Router = require('express').Router();
const {
  detectAnImage,
} = require('../controllers/GoogleVisionContoller');

Router.get('/detect', detectAnImage);

module.exports = Router;
