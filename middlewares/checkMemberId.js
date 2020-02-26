const Member = require('../models/Member');

module.exports = (req, res, next) => {
    /* istanbul ignore next */
    Member
        .findById(req.params.memberId)
        .then(member => {
            if (member) {
                next()
            }else{
                res.status(422).json({
                    errors: ['member id not found']
                })
            }
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                res.status(422).json({
                    errors: ['member id not found']
                })
            }else{
                res.status(500).json({
                    errors: ['internal server error']
                })
            }
        })
}