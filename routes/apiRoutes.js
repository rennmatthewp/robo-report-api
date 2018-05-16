const express = require('express');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const router = express.Router();

router.get('/users', (request, response) => {
  database('users').select()
    .then((users) => {
      response.status(200).json(users);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

router.get('/complaints', (request, response) => {
  database('complaints').select()
    .then((complaints) => {
      response.status(200).json(complaints);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

module.exports = { router, database };
