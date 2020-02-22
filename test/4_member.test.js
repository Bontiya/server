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