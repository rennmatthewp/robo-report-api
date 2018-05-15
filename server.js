const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());

app.use('/', express.static('public'));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => { // eslint-disable-next-line
  console.log(`roboReport server listening at ${app.get('port')}`);
});

module.exports = { app, database };
