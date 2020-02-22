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


    static delete (req, res, next) {
        const { memberId,eventId } = req.params
        Member
            .deleteOne({ _id: memberId })
            .then(() => {
                return Event
                        .updateOne({
                            _id: eventId 
                        },{
                            $pull: {
                                members: [memberId]
                            }
                        })
            })
            .then(() => {
                res.status(200).json({
                    _id: memberId,
                    ok: 'ok'
                })
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })
    }

    static updateStatusInvited(req, res, next) {
        const { memberId } = req.params
        const { statusInvited } = req.body 
        Member
            .updateOne({ _id: memberId }, {
                statusInvited
            })
            .then(() => {
                return Member
                        .findById(memberId)
            })
            .then((member) => {
                res.status(200).json(member)
            })
            .catch(next)
    }


    static getStatusInvitedPending(req, res, next) {
        console.log(req.userId, '============')
        Member
            .find({
                user: req.userId,
                statusInvited: 'pending'
            })
            .populate({
                path: 'event',
            })
            .then(member => {
                res.status(200).json(member)
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