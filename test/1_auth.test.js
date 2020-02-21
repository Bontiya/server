const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect

chai.use(chaiHttp)

const App = require('../app');

const dummyUser = {
    name: "Dzakki Achmed",
    email: "dzakkiaz7@gmail.com",
    password: "dzakki",
    gender: "male"
}
global.dummyUser = dummyUser
describe('AUTH SUCCESS', function () {
    describe('POST /auth/register', function () {  
        it('should send object with status code 200', function (done) {  
            chai
                .request(App)
                .post('/auth/register')
                .send(dummyUser)
                .then((res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('Object')
                    expect(res.body).to.have.property('token')
                    expect(res.body).to.include({
                        name: dummyUser.name,
                        email: dummyUser.email
                    })
                    done()
                })
                .catch(err => {
                    console.log('error test register')
                    console.log(err)
                })
        })
    })
    describe('POST /auth/login', function () {  
        it('should send object with status code 200', function (done) {  
            const bodyDummy = {
                email: dummyUser.email,
                password: dummyUser.password
            }
            chai
                .request(App)
                .post('/auth/login')
                .send(bodyDummy)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('Object')
                    expect(res.body).to.have.property('token')
                    expect(res.body).to.include({
                        name: dummyUser.name,
                        email: dummyUser.email,
                    })
                    global.userId = res.body._id
                    global.token = res.body.token
                    done()
                })
                .catch(err => {
                    console.log(err)
                })
        })
    })
})

describe('AUTH ERRORS', function () {  
    describe('POST /auth/register', function () {  
        it('should send object errors with status code 409', function (done) {  
            chai
                .request(App)
                .post('/auth/register')
                .send(dummyUser)
                .then((res) => {
                    expect(res).to.have.status(409)
                    expect(res.body).to.be.an('Object')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.errors[0]).to.have.include("email has been used")
                    done()
                })
                .catch(err => {
                    console.log('error test register')
                    console.log(err)
                })
        })
    })
    describe('POST /auth/register', function () {  
        it('should send object errors with status code 422', function (done) {  
            chai
                .request(App)
                .post('/auth/register')
                .send({})
                .then((res) => {
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an('Object')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.errors).to.be.an('array').that.include("name is required")
                    done()
                })
                .catch(err => {
                    console.log('error test register')
                    console.log(err)
                })
        })
    })

    describe('POST /auth/login', function () {  
        it('should send object errors with status code 422', function (done) {  
            chai
                .request(App)
                .post('/auth/login')
                .send({})
                .then((res) => {
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an('Object')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.errors).to.be.an('array').that.include("email/password incorrect")
                    done()
                })
                .catch(err => {
                    console.log('error test login')
                    console.log(err)
                })
        })
    })
})