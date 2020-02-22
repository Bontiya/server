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
                    global.eventId = res.body._id
                    done()
                })
        })
    })
})