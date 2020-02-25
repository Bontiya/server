const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect

chai.use(chaiHttp)

const App  = require('../app');


const dummyEvent = {
    name: "Makan bareng",
    location: {
        name: "PIM",
        lat: 19.311143,
        lon: -1.406250
    },
    time : new Date().toDateString(),
    key: 'shoe',
    description: 'nothing',
    locationHost: {
        name: "PIM",
        lat: 19.311143,
        lon: -1.406250
    },
}

describe('EVENT', function () {  
    describe('POST /events', function () {  
        it('should send object with status code 201', function (done) {
            chai
                .request(App)
                .post('/events')
                .send(dummyEvent)
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('time')
                    expect(res.body).to.have.property('members')
                    expect(res.body.members).to.be.an('array')
                    expect(res.body.members.length).to.equal(1)
                    expect(res.body.members[0].role).to.equal('host');
                    global.eventId = res.body._id
                    done()
                })
                .catch()
        })
    })

    describe('GET /events', function () {  
        it('should send array with status code 200', function (done) {
            chai
                .request(App)
                .get(`/events`)
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body[0]).to.have.property('_id')
                    expect(res.body[0]).to.have.property('name')
                    expect(res.body[0]).to.have.property('time')
                    expect(res.body[0]).to.have.property('members')
                    expect(res.body[0].members).to.be.an('array')
                    expect(res.body[0].members.length).to.equal(1)
                    done()
                })
                .catch()
        })
    })

    describe('GET /events/eventId', function () {  
        it('should send object with status code 200', function (done) {
            chai
                .request(App)
                .get(`/events/${global.eventId}`)
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('time')
                    expect(res.body).to.have.property('members')
                    expect(res.body.members).to.be.an('array')
                    expect(res.body.members.length).to.equal(1)
                    done()
                })
                .catch()
        })
    })

    describe('PUT /events/eventId', function () {  
        it('should send object with status code 200', function (done) {  

            const dummyUpdateEvent = {
                name: "Makan bareng kedua",
                location: {
                    name: "PIM 2",
                    lat: 19.311143,
                    lon: -1.406250
                },
                time : new Date().toDateString(),
                key: 'wristwatch',
                description: 'nothing 2',
            }

            chai
                .request(App)
                .put(`/events/${global.eventId}`)
                .send(dummyUpdateEvent)
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('time')
                    expect(res.body).to.have.property('members')
                    expect(res.body.members).to.be.an('array')
                    expect(res.body.members.length).to.equal(1)
                    expect(res.body.name).to.equal(dummyUpdateEvent.name)
                    expect(res.body.location.name).to.equal(dummyUpdateEvent.location.name)
                    expect(res.body.key).to.equal(dummyUpdateEvent.key)
                    done()
                })
                .catch()
        })
    })
})
