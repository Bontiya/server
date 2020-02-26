const User = require('../models/User');
const { checkPassword } = require('../helpers/bcrypt');
module.exports = function (req, res, next) {  
    /* istanbul ignore next */
    User
        .findOne({
            _id: req.userId
        })
        .then(user => {
            const passwordIsValid = checkPassword(req.body.password, user.password)
            if (passwordIsValid) {
                next()
            }else{
                res.status(422).json({
                    errors: ['password incorrect']
                })
            }
        })
        .catch(() => {
            res.status(500).json({
                errors: "internal server error"
            })
        })
}