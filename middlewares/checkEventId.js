const Event = require('../models/Event');

module.exports = function (req, res, next) {
    /* istanbul ignore next */
    Event
        .findById(req.params.eventId)
        .then(event => {
            if (event) {
                next()
            }else{
                res.status(422).json({
                    errors: ['event id not found']
                })
            }
        })
        .catch((err) => {
            /* istanbul ignore next */
            if (err.name === 'CastError') {
                res.status(422).json({
                    errors: ['event id not found']
                })
            }else{
                res.status(500).json({
                    errors: ['internal server error']
                })
            }
        })
}