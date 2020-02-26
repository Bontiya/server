const Event = require('../models/Event');
module.exports = function (req, res, next) {
    /* istanbul ignore next */
    Event
        .findOne({
            _id: req.params.eventId
        })
        .populate({
            path: "members",
            populate: {
                path: 'user'
            }
        })
        .then(event => {
            const { members } = event
            const users = req.body
            members.forEach(member => {
                users.forEach(user => {
                    if (JSON.stringify(member.user._id) === JSON.stringify(user.userId)) {
                        res.status(422).json({
                            errors: ["this user have exist at event"]
                        })
                        return;
                    }
                })
            });
            next()
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                errors: ['internal server error']
            })
        })
}