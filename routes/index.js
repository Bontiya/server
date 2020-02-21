const express = require('express');
const router = express.Router();

const auth = require('./auth');
const errorHandler = require('../middlewares/ErrorHandler');

// ini biarin yaa
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', auth)
router.use(errorHandler)

module.exports = router;
