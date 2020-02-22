const Member = require('../models/Member');
const Event = require('../models/Event');

class MemberController {

    static create(req, res, next) {
        const promiseMembers = MemberController
                                .createPromiseInsertMembers(req.body, req.params.eventid)
        Promise.all(promiseMembers)
            .then(members => {
                console.log(members)
                res.status(201).json(members)
            })
        .catch(next)
    }


    static createPromiseInsertMembers (member, eventId) {
        const promiseMembers = []
        member.forEach(data => {
            promiseMembers.push(
                Member
                    .create({
                        eventId,
                        userId: data.userId,
                        role: data.role || 'guest',
                        statusKey: false,
                        statusInvited: 'pending'
                    })
            )
        });
        return promiseMembers
    }
}

module.exports = MemberController