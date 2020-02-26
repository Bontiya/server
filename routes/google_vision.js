'use strict';
const Router = require('express').Router();
const {
  detectAnImage,
} = require('../controllers/GoogleVisionContoller');

Router.post('/detect', detectAnImage);

module.exports = Router;
