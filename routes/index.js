const express = require('express');
const router = express.Router();

const auth = require('./auth');
const users = require('./users')
const errorHandler = require('../middlewares/errorHandler');

// ini biarin yaa
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', auth)
router.use('/users', users)

router.use(errorHandler)

module.exports = router;
