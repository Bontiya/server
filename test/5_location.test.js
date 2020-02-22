const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect 

const lat = -6.1744;
const lon = 106.8294;

chai.use(chaiHttp);

const app = require('../app');

describe.only('Location API', function() {
  it('Should send array of places prediction - status 202', async () => {
    const response = await chai.request(app)
      .get(`/locations/search?q=padang&lat=${lat},lon=${lon}`)
    console.log(response.body)
    expect(response).to.have.status(200);
    expect(response.body).to.be.an('Array');
    expect(response.bodyp)
  } )
})
