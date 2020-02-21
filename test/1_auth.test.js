const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect

chai.use(chaiHttp)

const App = require('../app');
describe('AUTH', function () {

    const bodyDummyRegister = {
        name: "Dzakki Achmed",
        username: "dzakki",
        email: "dzakkiaz7@gmail.com",
        password: "dzakki"
    }
    
    describe('POST /auth/register', function () {  
        it('should send object with status code 200', function (done) {  
            chai
                .request(App)
                .post('/auth/register')
                .body(bodyDummyRegister)
                .then((res) => {
                    expect(res).to.have.statusCode(200)
                    expect(res.body).to.be.an('Object')
                    expect(res.body).to.have.property('token')
                    expect(res.body).to.include({
                        name: bodyDummyRegister.name,
                        email: bodyDummyRegister.email
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
                email: "dzakkiaz7@gmail.com",
                password: "dzakki"
            }
            chai
                .request(App)
                .post('/auth/login')
                .body(bodyDummy)
                .then(res => {
                    expect(res).to.have.statusCode(200)
                    expect(res.body).to.be.an('Object')
                    expect(res.body).to.have.property('token')
                    expect(res.body).to.include({
                        name: bodyDummyRegister.name,
                        email: bodyDummyRegister.email,
                    })
                    global.token = res.body.token
                    done()
                })
                .catch(err => {
                    console.log(err)
                })
        })
    })
})