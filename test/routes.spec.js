/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { database } = require('../routes/apiRoutes');
const server = require('../server');

chai.use(chaiHttp);
const { expect } = chai;
const should = chai.should();

describe('Client Routes', () => { });

describe('API Routes', () => {
  beforeEach((done) => {
    database.migrate.rollback().then(() => {
      database.migrate.rollback().then(() => {
        database.migrate.rollback().then(() => {
          database.migrate.latest().then(() => database.seed.run().then(() => {
            done();
          }));
        });
      });
    });
  });

  describe('GET /api/v1/users', () => {
    it('should return an array of users', (done) => {
      chai.request(server)
        .get('/api/v1/users')
        .end((error, response) => {
          response.should.have.status(200);
          expect(response).to.be.json;
          response.body.should.be.an('array');
          response.body.length.should.equal(33);
          response.body[0].should.have.property('id', 1);
          response.body[0].should.have.property('firstName', 'Jeffery');
          response.body[0].should.have.property('lastName', 'Lebowski');
          response.body[0].should.have.property('email', 'thedude@gmail.com');
          response.body[0].should.have.property('phone', '404-555-5555');
          response.body[0].should.have.property('phoneType', 'Wireless');
          response.body[0].should.have.property('address', '1091 S Mesa Dr');
          response.body[0].should.have.property('city', 'Los Angeles');
          response.body[0].should.have.property('state', 'CA');
          response.body[0].should.have.property('zipcode', '90210');
          done();
        });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return a single user by their ID', (done) => {
      chai.request(server)
        .get('/api/v1/users/1')
        .end((error, response) => {
          response.should.have.status(200);
          expect(response).to.be.json;
          response.body.should.be.an('object');
          response.body.should.have.property('id', 1);
          response.body.should.have.property('firstName', 'Jeffery');
          response.body.should.have.property('lastName', 'Lebowski');
          response.body.should.have.property('email', 'thedude@gmail.com');
          response.body.should.have.property('phone', '404-555-5555');
          response.body.should.have.property('phoneType', 'Wireless');
          response.body.should.have.property('address', '1091 S Mesa Dr');
          response.body.should.have.property('city', 'Los Angeles');
          response.body.should.have.property('state', 'CA');
          response.body.should.have.property('zipcode', '90210');
          done();
        });
    });

    it('should return an error with status 404 if the user is not found', (done) => {
      chai.request(server)
        .get('/api/v1/users/500')
        .end((error, response) => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.have.property('error', 'Could not find user with id 500.');
          done();
        });
    });
  });

  describe('POST /api/v1/users', () => {
    it('should add a new user to the database and return the new ID', (done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send({
          firstName: "Jon",
          lastName: "Sweet",
          email: "abcdef@hijklmnop",
          phone: "321-765-9877",
          phoneType: "wireless",
          address: "123 Main",
          city: "Denver",
          state: "CO",
          zipcode: "90210"
        })
        .end((error, response) => {
          response.should.have.status(201);
          done();
        });
    });
  });

  describe('GET /api/v1/complaints', () => {
    it('should return an array of complaints', (done) => {
      chai.request(server)
        .get('/api/v1/complaints')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.an('array');
          response.body.length.should.equal(32);
          response.body[0].should.have.property('id', 1);
          response.body[0].should.have.property('user_id', 1);
          response.body[0].should.have.property('isSoliciting', true);
          response.body[0].should.have.property('description', 'A woman wants to eliminate my credit card debt');
          response.body[0].should.have.property('subject', 'Robocall');
          response.body[0].should.have.property('callerIdNumber', '303-123-1234');
          response.body[0].should.have.property('callerIdName', 'unknown');
          response.body[0].should.have.property('date', '04/04/2018');
          response.body[0].should.have.property('time', '5:00 PM');
          response.body[0].should.have.property('type', 'Prerecorded Voice');
          response.body[0].should.have.property('altPhone', '303-123-1234');
          response.body[0].should.have.property('permissionGranted', false);
          response.body[0].should.have.property('businessName', null);
          response.body[0].should.have.property('agentName', null);
          done();
        });
    });
  });

  describe('GET /api/v1/complaints/:id', () => {
    it('should return a complaint by its ID', (done) => {
      chai.request(server)
        .get('/api/v1/complaints/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.an('object');
          response.body.should.have.property('id', 1);
          response.body.should.have.property('user_id', 1);
          response.body.should.have.property('isSoliciting', true);
          response.body.should.have.property('description', 'A woman wants to eliminate my credit card debt');
          response.body.should.have.property('subject', 'Robocall');
          response.body.should.have.property('callerIdNumber', '303-123-1234');
          response.body.should.have.property('callerIdName', 'unknown');
          response.body.should.have.property('date', '04/04/2018');
          response.body.should.have.property('time', '5:00 PM');
          response.body.should.have.property('type', 'Prerecorded Voice');
          response.body.should.have.property('altPhone', '303-123-1234');
          response.body.should.have.property('permissionGranted', false);
          response.body.should.have.property('businessName', null);
          response.body.should.have.property('agentName', null);
          done();
        });
    });

    it('should return an error with status 404 if the complaint is not found', (done) => {
      chai.request(server)
        .get('/api/v1/complaints/500')
        .end((error, response) => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.have.property('error', 'Could not find complaint with id 500.');
          done();
        });
    });
  });
});
