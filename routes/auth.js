const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const AuthController = require('../controllers/AuthController');

router.post('/register', AuthController.register)
router.post('/login', AuthController.login);
router.post('/token-firebase', authentication, AuthController.deviceTokenFirebase)

module.exports = router