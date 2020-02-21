const chai = require('chai')
const chaiHttp = require('chai-http');
const expect = chai.expect

chai.use(chaiHttp);

const App = require('../app');


const dummyUserUpdate = {
    name: "Ahmad muzakki baru", 
    email: "dzakkiaz7@gmail.com", 
    username: "dzakki", 
    gender: "male",
    newPassword: "dzakki1"
}

describe('USER SUCCESS', function () {  
    describe('GET /users/:id', function () {  
        it('should send object with status code 200', function (done) {  
            chai
                .request(App)
                .get(`/users/${global.userId}`)
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('email')
                    expect(res.body).to.have.property('gender')
                    expect(res.body.name).to.equal(global.dummyUser.name)
                    expect(res.body.email).to.equal(global.dummyUser.email)
                    expect(res.body.gender).to.equal(global.dummyUser.gender)
                    done()
                })
        })
    })

    describe('GET /users/search', function () {  
        it('should send arrays with status code', function (done) {  
            chai
                .request(App)
                .get(`/users/search?email=dzakki`)
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body[0].name).to.include(global.dummyUser.name)
                    done()
                })
        })
    })

    describe('PUT /users', function () {  
        it('should send object with status code 200', function (done) {  
            chai
                .request(App)
                .put(`/users`)
                .set('authorization', global.token)
                .type('form')   
                .send(dummyUserUpdate)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('email')
                    expect(res.body).to.have.property('gender')
                    expect(res.body.name).to.equal(dummyUserUpdate.name)
                    expect(res.body.email).to.equal(dummyUserUpdate.email)
                    expect(res.body.gender).to.equal(dummyUserUpdate.gender)
                    done()
                })
                .catch(err => {
                    console.log(err)
                })
        })
    })

    describe('PATCH /users/password', function () {  
        it('should send object with status code 200', function (done) {  
            chai
                .request(App)
                .patch(`/users/password`)
                .send({
                    password: global.dummyUser.password,
                    newPassword: dummyUserUpdate.newPassword
                })
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('email')
                    expect(res.body).to.have.property('gender')
                    expect(res.body.name).to.equal(dummyUserUpdate.name)
                    expect(res.body.email).to.equal(dummyUserUpdate.email)
                    expect(res.body.gender).to.equal(dummyUserUpdate.gender)
                    done()
                })
        })
    })
})


describe('USER ERROR', function () {  
    describe('GET /users/:id', function () {  
        it('should send error with status code 422', function (done) {  
            chai
                .request(App)
                .get(`/users/123`)
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(404)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.errors).to.be.an('array').that.include("id not found")
                    done()
                })
        })
    })

    describe('PUT /users', function () {  
        it('should send object errors with status code 422', function (done) {  
            chai
                .request(App)
                .put(`/users`)
                .send({
                })
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an('Object')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.errors).to.be.an('array').that.include('email is required')
                    done()
                })
        })
    })

    describe('PATCH /users/password', function () {  
        it('should send object errors with status code 422', function (done) {  
            chai
                .request(App)
                .patch(`/users/password`)
                .send({
                    password: dummyUserUpdate.newPassword
                })
                .set('authorization', global.token)
                .then(res => {
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an('Object')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.errors).to.be.an('array').that.include('new password is required')
                    done()
                })
        })
    })
})