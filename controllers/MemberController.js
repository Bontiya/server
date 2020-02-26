const Member = require("../models/Member");
const Event = require("../models/Event");
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(require('../adminKeyfile.json')),
  databaseURL: 'https://pushnotification-f4b04.firebaseio.com'
});


class MemberController {
  static create(req, res, next) {
    
    const { eventId } = req.params;
    const promiseMembers = MemberController.createPromiseInsertMembers(
      req.body,
      eventId
    );

    Promise.all(promiseMembers)
      .then(members => {
        // res.status(201).json(members)
        const pushMember = [];
        members.forEach(member => {
          pushMember.push(member._id);
        });
        return Event.updateOne(
          { _id: eventId },
          {
            $push: {
              members: pushMember
            }
          }
        );
      })
      .then((e) => {
        return Event.findOne({ _id: eventId }).populate({
          path: "members",
          populate: {
            path: "user",
            select: "-password -provider"
          }
        });
      })
      .then(event => {
        const io = req.app.get("socketio");
        const membersFirebaseToken = req.body[0].membersFirebaseToken
        console.log(req.body[0],'INI REQ BODY')
        if (process.env.NODE_ENV !== "test" && io) {
          MemberController.notifToStatusInvitedPending(req.body, event, io);
        }
        admin.messaging().sendMulticast({
          tokens: ['eB6sZJKFtNU:APA91bH6BU7hfXp2HXwmZfoBuC9VrT9vu4QcahSSn1vAXw-Q6KbVCL5K1WvRjeP_6x0yhI3iU0StNucJRmZNvTzDH8BTd3kgqfdVmV4T1Zz4emr-9ByiTpzqK73jmSuGHgxnCQiOG3ZP'],
          notification: {
            body: 'Ada member baru',
            title: 'Invite',
          }
        })
          .then( response => {
            console.log( response.successCount + ' messages were sent')
          })
          .catch( err => console.log( err ))
        res.status(201).json(event);
      })
      .catch(next);
  }

  static delete(req, res, next) {
    const { memberId, eventId } = req.params;
    Member.deleteOne({ _id: memberId })
      .then(() => {
        return Event.updateOne(
          {
            _id: eventId
          },
          {
            $pull: {
              members: [memberId]
            }
          }
        );
      })
      .then(() => {
        res.status(200).json({
          _id: memberId,
          ok: "ok"
        });
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  }

  static updateStatusInvited(req, res, next) {
    const { memberId } = req.params;
    const { statusInvited, location } = req.body;
    Member.updateOne(
      { _id: memberId },
      {
        statusInvited,
        location
      }
    )
      .then(() => {
        return Member.findById(memberId)
          .populate({
            path: "event",
            populate: {
              path: "members",
              match: { role: "host" }
            }
          })
          .populate({
            path: "user",
            select: "-password -provider"
          });
      })
      .then(member => {
        const io = req.app.get("socketio");
        if (process.env.NODE_ENV !== "test" && io) {
          const notifFrom = {
            memberId: member._id,
            userId: member.user._id,
            name: member.user.name,
            role: member.role,
            statusKey: member.statusKey,
            statusInvited: member.statusInvited
          };
          const eventData = {
            location: member.event.location,
            _id: member.event._id,
            name: member.event.name,
            time: member.event.time,
            key: member.event.key,
            status: member.event.status
          };
          MemberController.notifStatusInvitedUpdated(
            notifFrom,
            eventData,
            member.event.members,
            io
          );
        }
        res.status(200).json(member);
      })
      .catch(next);
  }

  static getStatusInvitedPending(req, res, next) {
    // console.log(req.userId, '============')
    Member.find({
      user: req.userId,
      statusInvited: "pending"
    })
      .populate({
        path: "event",
        populate: {
          path: "members",
          match: { role: "host" },
          populate: {
            path: "user",
            select: "-password -provider"
          }
        }
      })
      .then(member => {
        res.status(200).json(member);
      })
      .catch(next);
  }

  static notifStatusInvitedUpdated(notifFrom, eventData, members, io) {
    console.log(`${members[0].user} socketio StatusInvitedUpdated`);
    if (notifFrom.statusInvited === "received") {
      io.emit(`${notifFrom.userId} myAcceptedEvent`, "success accepted event");
    }
    members.forEach(data => {
      io.emit(`${data.user} StatusInvitedMemberUpdated`, {
        notifFrom,
        event: eventData
      });
    });
  }

  static notifToStatusInvitedPending(members, event, io) {
    console.log("socketio StatusInvitedPending");
    members.forEach(data => {
      io.emit(`${data.userId} StatusInvitedPending`, event);
    });
  }

  static createPromiseInsertMembers(member, eventId) {
    const promiseMembers = [];
    member.forEach(data => {
      promiseMembers.push(
        Member.create({
          event: eventId,
          user: data.userId,
          role: data.role || "guest",
          statusKey: false,
          statusInvited: "pending"
        })
      );
    });
    return promiseMembers;
  }

  static updateStatusKey(req, res, next) {
    console.log('update status key benar')
    Member.update({
      _id: req.params.memberId
    }, {
      statusKey: true
    })
      .then(data => {
        res.status(200).json(data)
      })
      .catch(next)
  }
}

module.exports = MemberController;
