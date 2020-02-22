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
                    console.log(res.body)
                    done()
                })
                .catch(console.log)
        })
    })

})