const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect 

chai.use(chaiHttp);

const app = require('../app');

describe('MEMBER', function () {
    const dummiesUser = []

    before(function (done) {
        chai
            .request(app)
            .post('/auth/register')
            .send({
                name: "Dzakki Achmed 2",
                email: "dzakkiaz8@gmail.com",
                password: "dzakki2",
                gender: "male"
            })
            .then(res => {
                dummiesUser.push(res.body._id)
                return chai
                        .request(app)
                        .post('/auth/register')
                        .send({
                            name: "Dzakki Achmed 3",
                            email: "dzakkiaz9@gmail.com",
                            password: "dzakki10",
                            gender: "male"
                        })
            })
            .then(res => {
                global.token2 = res.body.token
                dummiesUser.push(res.body._id)
                done()
            })
            .catch(console.log)
    })

    describe('POST /events/:eventid/members', function () {
        it('should send arrays with status code 201', function (done) {
            const members = []

            dummiesUser.forEach(user => {
                members.push({
                    userId: user,
                    role: 'guest',
                })
            })

            chai
                .request(app)
                .post(`/events/${global.eventId}/members`)
                .send(members)
                .set('authorization', global.token)
                .then(res => {
                    // console.log(res.body)
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an('object')
                    expect(res.body.members).to.be.an('array')
                    expect(res.body.members.length).to.equal(3)
                    expect(res.body.members[0]).to.have.property('event')
                    expect(res.body.members[0]).to.have.property('user')
                    expect(res.body.members[0]).to.have.property('role')
                    expect(res.body.members[0]).to.have.property('statusKey')
                    expect(res.body.members[0]).to.have.property('statusInvited')
                    expect(res.body.members[0].statusKey).to.not.be.ok;
                    global.memberId = res.body.members[0]._id 
                    done()
                })
                .catch(console.log)
        })
    })


    describe('PATCH /events/members/status-invited', function () {
        it('should send object with status code 200', function (done) {
            chai
                .request(app)
                .patch(`/events/members/${global.memberId}/status-invited`)
                .send({
                    statusInvited: 'received'
                })
                .set('authorization', global.token)
                .then(res => {
                    // console.log(res.body)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('statusInvited')
                    expect(res.body.statusInvited).to.equal('received')
                    done()
                }) 
                .catch(console.log)
        })
    })

    describe('PATCH /events/:eventId/status', function () {
        it('should send object with status code 200', function (done) {
            chai
                .request(app)
                .patch(`/events/${global.eventId}/status`)
                .send({ status: 'done' })
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('time')
                    expect(res.body).to.have.property('members')
                    expect(res.body.members).to.be.an('array')
                    expect(res.body.members.length).to.equal(3)
                    expect(res.body.status).to.equal('done')
                    done()
                })
                .catch(console.log)
        })
    })

    describe('GET /members/status-invited/pending', function () {
        it('should send array with status code 200', function (done) {
            chai
                .request(app)
                .get(`/events/members/status-invited/pending`)
                .set('authorization', global.token2)
                .then(res => {
                    // console.log(res.body)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.equal(1)
                    expect(res.body[0].statusInvited).to.equal('pending')
                    done()
                })
                .catch(console.log)
        })
    })

    describe('DELETE /events/:eventId/members/memberId', function () {
        it('should send object with status code 200', function (done) {
            chai
                .request(app)
                .delete(`/events/${global.eventId}/members/${global.memberId}`)
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body.ok).to.equal('ok')
                    // done()
                    return chai
                        .request(app)
                        .get(`/events/${global.eventId}`)
                        .set('authorization', global.token)
                })
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('time')
                    expect(res.body).to.have.property('members')
                    expect(res.body.members).to.be.an('array')
                    expect(res.body.members.length).to.equal(2)
                    done()
                })
                .catch(console.log)
        })
    })

    describe('DELETE /events/:eventId', function () {  
        it('should send object with status code 200', function (done) {
            chai
                .request(app)
                .delete(`/events/${global.eventId}`)
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body._id).to.equal(global.eventId)
                    done()
                })
        })
    })
})