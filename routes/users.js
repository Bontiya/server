const router = require('express').Router();
const UserController = require('../controllers/UserController');
const authentication = require('../middlewares/authentication');
const preUserUpdatePassword = require('../middlewares/preUserUpdatePassword');

router.put('/', authentication, UserController.update);
router.patch('/password', [authentication, preUserUpdatePassword], UserController.updatePassword);
router.get('/search', authentication, UserController.getUserBySearch);
router.get('/:id', authentication, UserController.get);

module.exports = router;
