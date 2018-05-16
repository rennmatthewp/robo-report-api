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

router.get('/users/:id', (request, response) => {
  const { id } = request.params;
  database('users').where('id', id)
    .then((user) => {
      if (!user[0]) {
        return response.status(404).json({error: `Could not find user with id ${id}.`})
      }
      return response.status(200).json(user[0]);
    })
    .catch(error => response.status(500).json(error));
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

router.get('/complaints/:id', (request, response) => {
  const { id } = request.params;
  database('complaints').where('id', id)
    .then((complaint) => {
      if (!complaint[0]) {
        return response.status(404).json({ error: `Could not find complaint with id ${id}.` })
      }
      return response.status(200).json(complaint[0]);
    })
    .catch(error => response.status(500).json(error));
});

module.exports = { router, database };
