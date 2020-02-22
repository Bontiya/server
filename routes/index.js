const express = require('express');
const router = express.Router();

const errorHandler = require('../middlewares/errorHandler');
const auth = require('./auth');
const users = require('./users')
const event = require('./Event');

// ini biarin yaa
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', auth)
router.use('/users', users)
router.use('/events', event);
router.use(errorHandler)

module.exports = router;
