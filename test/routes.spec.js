/* eslint-disable no-unused-expressions */

const chai = require('chai');
const chaiHttp = require('chai-http');
const { database } = require('../routes/apiRoutes');
const server = require('../server');

/* eslint-disable-next-line */
const should = chai.should();
chai.use(chaiHttp);

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
          response.should.be.json;
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
    it('should return a single user by their id', (done) => {
      chai.request(server)
        .get('/api/v1/users/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
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
          response.body.should.have.property('error', 'Could not find user with id=500.');
          done();
        });
    });
  });

  describe('POST /api/v1/users', () => {
    it('should add a new user to the database and return the new id', (done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send({
          firstName: 'Jon',
          lastName: 'Sweet',
          email: 'abcdef@hijklmnop',
          phone: '321-765-9877',
          phoneType: 'wireless',
          address: '123 Main',
          city: 'Denver',
          state: 'CO',
          zipcode: '90210',
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.have.property('id');
          done();
        });
    });

    it('should return an error with status 422 if a required param is missing', (done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send({
          lastName: 'Sweet',
          email: 'abcdef@hijklmnop',
          phone: '049-765-9877',
          phoneType: 'wireless',
          address: '123 Main',
          city: 'Denver',
          state: 'CO',
          zipcode: '90210',
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.have.property('error', 'Expected format: {firstName: <String>, lastName: <String>, email: <String>, phone: <String>, phoneType: <String>, address: <String>, city: <String>, state: <String>, zipcode: <String>}. Missing required property firstName.');
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
    it('should return a complaint by its id', (done) => {
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
          response.body.should.have.property('error', 'Could not find complaint with id=500.');
          done();
        });
    });
  });

  describe('POST api/v1/complaints', () => {
    it('should add a new complaint to the database and return the new id', (done) => {
      chai.request(server)
        .post('/api/v1/complaints')
        .send({
          user_id: 1,
          isSoliciting: true,
          subject: 'Robocall',
          description: 'A woman wants to eliminate my credit card debt',
          callerIdNumber: '303-123-1234',
          callerIdName: 'unknown',
          date: '04/04/2018',
          time: '5:00 PM',
          type: 'Prerecorded Voice',
          altPhone: '303-123-1234',
          permissionGranted: false,
          businessName: null,
          agentName: null,
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.have.property('id');
          done();
        });
    });

    it('should return an error with status 422 if a required param is missing', (done) => {
      chai.request(server)
        .post('/api/v1/complaints')
        .send({
          user_id: 1,
          isSoliciting: true,
          subject: 'Robocall',
          description: 'A woman wants to eliminate my credit card debt',
          callerIdName: 'unknown',
          date: '04/04/2018',
          time: '5:00 PM',
          type: 'Prerecorded Voice',
          altPhone: '303-123-1234',
          permissionGranted: false,
          businessName: null,
          agentName: null,
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.have.property('error', 'Expected format: {user_id: <Integer>, isSoliciting: <String>, subject: <String>, description: <String>, callerIdNumber: <String>, callerIdName: <String>, date: <String>, time: <String>, type: <String>, altPhone: <String>, permissionGranted: <Boolean>, businessName: <String>, agentName: <String>}. Missing required property callerIdNumber.');
          done();
        });
    });
  });

  describe('PATCH api/v1/complaints', () => {
    it('should update a complaint selected by id', (done) => {
      chai.request(server)
        .patch('/api/v1/complaints/1')
        .send({
          isSoliciting: true,
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.an('object');
          response.body.should.have.property('message', 'updated complaint with id=1');
          done();
        });
    });

    it('should return an error with status 422 if patching a column that doesn\'t exist', (done) => {
      chai.request(server)
        .patch('/api/v1/complaints/1')
        .send({
          randomProperty: true,
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error', 'Cannot update complaint, invalid property provided. Valid properties include: {user_id: <Integer>, isSoliciting: <String>, subject: <String>, description: <String>, callerIdNumber: <String>, callerIdName: <String>, date: <String>, time: <String>, type: <String>, altPhone: <String>, permissionGranted: <Boolean>, businessName: <String>, agentName: <String>}');
          done();
        });
    });
  });

  describe('DELETE /api/v1/complaints/:id', () => {
    it('should delete a complaint by its id', (done) => {
      chai.request(server)
        .delete('/api/v1/complaints/32')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.have.property('message', '1 row(s) deleted. Deleted complaint with id=32.');
          done();
        });
    });

    it('should return an error with status 422 if no complaint is found', (done) => {
      chai.request(server)
        .delete('/api/v1/complaints/33')
        .end((error, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.an('object');
          response.body.should.have.property('error', '0 row(s) deleted. No complaint found with id=33');
          done();
        });
    });
  });
});
