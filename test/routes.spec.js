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

  it('GET api/v1/users should return an array of users', (done) => {
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
