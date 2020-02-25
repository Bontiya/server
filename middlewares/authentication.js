const jwt = require('jsonwebtoken')
module.exports = function (req, res, next) {
    if (req.headers.hasOwnProperty('authorization')) {
        const { authorization } = req.headers
        try {
            const user = jwt.verify(authorization, process.env.JWT_SECRET)
            req.userId = user.userId
            req.email = user.email
            next()
        } catch (error) {
            res.status(422).json({
                errors: ['authorization is not valid']
            })
        }
    }else{
        res.status(404).json({
            errors: ['authorization is not found']
        })
    }
}
