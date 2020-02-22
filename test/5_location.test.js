const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect 

const placeid = 'ChIJ-XIiDaXxaS4R6fDk7En91mg'
const lat = -6.1744;
const lon = 106.8294;

chai.use(chaiHttp);

const app = require('../app');

describe.only('Location API', function() {
  describe('Query location', function() {
    it('Should send array of places prediction - status 202', async () => {
      const response = await chai.request(app)
        .get(`/locations/search?q=padang&lat=${lat},lon=${lon}`)
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('Array');
    });
    it('Should give status 400 when location name is empty', async () => {
      const response = await chai
        .request(app)
        .get(`/locations/search?lat=${lat},lon=${lon}`)
      expect(response).to.have.status(400);
      expect(response.body).to.be.an('Object');
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.be.an('Array');
      expect(response.body.errors).to.include('query q is required as location name');
    });
  })
  describe('Place detail', function() {
    it('Should give place detail - status 200', async () => {
      const response = await chai
        .request(app)
        .get(`/locations/detail?placeid=${placeid}`);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('Object');
      expect(response.body.id).to.equal(placeid);
      expect(response.body).to.have.property('lat');
      expect(response.body).to.have.property('lon');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('description');
    });
    it('Should give status 400 when user did not placeid', async () => {
      const response = await chai
        .request(app)
        .get('/locations/detail')
      expect(response).to.have.status(400);
      expect(response.body).to.be.an('Object');
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.be.an('Array');
      expect(response.body.errors).to.include('placeid is required!');
    })
  })
  describe('Reverse geocode', function() {
    it('should send array of place name', async () => {
      const response = await chai
        .request(app)
        .get('/locations/reverse?lat=-6.2607&lon=106.7816')
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('Array');
    });
    it('Should give status 400 when user did not input lat and lon', async () => {
      const response = await chai
        .request(app)
        .get('/locations/reverse')
      expect(response).to.have.status(400);
      expect(response.body).to.be.an('Object');
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.be.an('Array');
      expect(response.body.errors).to.include('latitude and longitude is required!');
    })
  })
})
