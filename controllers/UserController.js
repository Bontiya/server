const User = require('../models/User');
const { hashPassword } = require('../helpers/bcrypt');

class UserController {
    static get(req, res, next) {
        User
            .findOne({
                _id: req.params.id
            })
            .then(user => {
                const { _id, name, email, gender, created_at, updated_at } = user
                res.status(200).json({ 
                    _id, 
                    name, 
                    email, 
                    gender, 
                    created_at, 
                    updated_at 
                })
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    const messageError = {
                        name: 'Forbidden',
                        errors: [{
                            message: 'id not found'
                        }]
                    }
                    next(messageError)
                }else{
                    next()
                }
            })
    }
    static update(req, res, next) {
        const validateIsNull = UserController.isNull(req.body)
        if (validateIsNull) {
            next(validateIsNull)
            return;
        }

        const { name, email, username, gender, avatar } = req.body
        User
            .updateOne({ _id: req.userId }, { 
                name, 
                email, 
                username, 
                gender,
                avatar
            })
            .then((res) => {
                return User
                    .findOne({ _id: req.userId })
                    .select('-password -provider')
            })
            .then(user => {

                res.status(200).json(user)
            })
            .catch(next)
    }

    static updatePassword(req, res, next) {
        const { newPassword } = req.body
        if (!newPassword) {
            next({
                name: 'ValidationError',
                errors: [
                    { message: 'new password is required' },
                ]
            })
            return
        }

        const password = hashPassword(newPassword)
        User
            .updateOne({ _id: req.userId }, { password },)
            .then((rs) => { 
                return User
                        .findOne({ _id: req.userId })
                        .select('-password -provider')
            })
            .then(user => {
                res.status(200).json(user)
            })
            .catch(next)
    }

    static isNull(obj) {
        if (!Object.keys(obj).length) {
            return {
                name: 'ValidationError',
                errors: [
                    { message: 'email is required' },
                    { message : 'name is required'},
                    { message : 'gender is required'}
                ]
            }
        }

        const messageError = {
            name: 'ValidationError',
            errors: []
        }
        for (const key in obj) {
            if (!obj[key]) {
                messageError.errors.push({
                    message: `${key} is required`
                })
            }
        }
        if (messageError.errors.length) return messageError
        return false
    }

    static getUserBySearch(req, res, next) {
        let options = {}
        if (req.query.email) {
            options.email = {
                $regex: `.*${req.query.email}.*`
            }
        }
        User
            .find(options)
            .select('_id name email username')
            .then(user => {
                res.status(200).json(user)
            })
            .catch(next)
    }

    static async getAllUser( req, res, next ) {
        try {
            res.status(200).json( await User.find({}))
        }
        catch ( err ) {
            next( err )
        }
    }
}

module.exports = UserController