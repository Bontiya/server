const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { checkPassword } = require('../helpers/bcrypt');

class AuthController {
    /* istanbul ignore next */
    static register(req, res, next) {
        /* istanbul ignore next */
        const { name, email, password, gender } = req.body
        User
            .create({ 
                name, 
                email, 
                password, 
                gender,
                provider: 'default',
                avatar: 'https://img.icons8.com/wired/2x/small-smile.png'
            })
            .then(user => {
                const token = jwt.sign({
                    userId: user._id,
                    email: user.email
                }, process.env.JWT_SECRET)
                res.status(200).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    token
                })
            })
            .catch(next)
    }

    static login (req, res, next) {
        /* istanbul ignore next */
        const { email, password } = req.body
        User
            .findOne({ email })
            .then(user => {
                const messageError = {
                    name: 'ValidationError',
                    errors: [{
                        message: 'email/password incorrect'
                    }]
                }
                /* istanbul ignore next */
                if (user) {
                    const passwordIsValid = checkPassword(password, user.password)
                    /* istanbul ignore next */
                    if (passwordIsValid) {
                        const token = jwt.sign({
                            userId: user._id,
                            email: user.email
                        }, process.env.JWT_SECRET)
                        res.status(200).json({
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            gender: user.gender,
                            token
                        })
                    }else{
                        throw messageError
                    }
                }else{
                    throw messageError
                }
            })
            .catch(next)
    }

    static async deviceTokenFirebase ( req,res,next ) {
        /* istanbul ignore next */
        try {
            res.status(201).json(await User.updateOne({_id: req.userId},{
                tokenDeviceFirebase: req.body.tokenDeviceFirebase
            }))
        }
        catch ( err ) {
            next ( err )
        }
    }
}

module.exports = AuthController;