const express = require('express');
const { router } = require('./routes/apiRoutes');
const bodyParser = require('body-parser');

require('dotenv').config();

const server = express();

server.set('port', process.env.PORT || 3000);

server.use((request, response, next) => {
  response.header(
    'Access-Control-Allow-Origin',
    '*',
  );
  response.header(
    'Access-Control-Allow-Headers',
    'Content-Type,token',
  );
  next();
});
server.use(bodyParser.json());
server.use('/', express.static('public'));
server.use('/api/v1', router);

server.listen(server.get('port'), () => { // eslint-disable-next-line
  console.log(`roboReport server listening at ${server.get('port')}`);
});

module.exports = server;
