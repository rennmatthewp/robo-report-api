const chai = require('chai');
const chaiHttp = require('chai-http');
const { router, database } = require('../routes/apiRoutes');

chai.use(chaiHttp);
const should = chai.should();

describe('Client Routes', () => { });

describe('API Routes', () => {
  beforeEach(done => {
    database.migrate.rollback().then(() => {
      database.migrate.rollback().then(() => {
        database.migrate.rollback().then(() => {
          database.migrate.latest().then(() => {
            return database.seed.run().then(() => {
              done();
            });
          });
        });
      });
    });
  });

  it('should exist', () => {
    (2).should.equal(2)
  })
});
