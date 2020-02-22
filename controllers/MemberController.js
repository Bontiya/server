const Member = require('../models/Member');
const Event = require('../models/Event');

class MemberController {

    static create(req, res, next) {
        const { eventId } = req.params
        const promiseMembers = MemberController
                                .createPromiseInsertMembers(req.body, eventId)
        
        Promise.all(promiseMembers)
            .then(members => {
                // res.status(201).json(members)
                const pushMember = []
                members.forEach(member => {
                    pushMember.push(member._id)
                });
                return Event.updateOne({ _id:  eventId}, {
                    $push: {
                        members: pushMember
                    }
                })
            })
            .then(() => {
                return Event.findOne({ _id: eventId })
                            .populate({
                                path: 'members',
                                populate: {
                                    path: 'user',
                                    select: '-password -provider'
                                }
                            })
            })
            .then(event => {
                res.status(201).json(event)
            })
            .catch(next)
    }


    static createPromiseInsertMembers (member, eventId) {
        const promiseMembers = []
        member.forEach(data => {
            promiseMembers.push(
                Member
                    .create({
                        event: eventId,
                        user: data.userId,
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