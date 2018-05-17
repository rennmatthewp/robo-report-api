const express = require('express');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const router = express.Router();

const requiredUserParameters = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'phoneType',
  'address',
  'city',
  'state',
  'zipcode'
];

const requiredComplaintParameters = [
  "user_id",
  "isSoliciting",
  "subject",
  "description",
  "callerIdNumber",
  "callerIdName",
  "date",
  "time",
  "type",
  "altPhone",
  "permissionGranted",
  "businessName",
  "agentName"
]

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
        return response.status(404).json({ error: `Could not find user with id ${id}.` })
      }
      return response.status(200).json(user[0]);
    })
    .catch(error => response.status(500).json(error));
});

router.post('/users', (request, response) => {
  const user = request.body;

  for (let parameter of requiredUserParameters) {
    if (!user[parameter]) {
      return response.status(422).json({
        error: `Expected format: {firstName: <String>, lastName: <String>, email: <String>, phone: <String>, phoneType: <String>, address: <String>, city: <String>, state: <String>, zipcode: <String>}. Missing required property ${parameter}.`
      });
    }
  }

  database('users')
    .insert(user, 'id')
    .then((user) => {
      return response.status(201).json({ id: user[0] })
    })
    .catch((error) => {
      return response.status(500).json(error);
    });
});

router.patch('/users/:id', (request, response) => {
  const { id } = request.params;
  const revision = request.body;
  let correctFormat = true;
  Object.keys(revision).forEach(key => {
    if (!requiredUserParameters.includes(key)) {
      correctFormat = false;
    }
  })
  if (!correctFormat) {
    return response.status(422).json({ error: 'Cannot update user, invalid property provided. Valid properties include: {firstName: <String>, lastName: <String>, email: <String>, phone: <String>, phoneType: <String>, address: <String>, city: <String>, state: <String>, zipcode: <String>}' });
  }

  database('users').where('id', id)
    .select()
    .update(revision)
    .then(user => {
      return response.status(201).json({ message: `updated user with ID=${id}` });
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
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

router.post('/complaints', (request, response) => {
  const complaint = request.body;

  for (let parameter of requiredComplaintParameters) {
    if (complaint[parameter] === undefined) {
      return response.status(422).json({
        error: `Expected format: {user_id: <Integer>, isSoliciting: <String>, subject: <String>, description: <String>, callerIdNumber: <String>, callerIdName: <String>, date: <String>, time: <String>, type: <String>, altPhone: <String>, permissionGranted: <Boolean>, businessName: <String>, agentName: <String>}. Missing required property ${parameter}.`
      });
    }
  }

  database('complaints')
    .insert(complaint, 'id')
    .then((complaint) => {
      return response.status(201).json({ id: complaint[0] })
    })
    .catch((error) => {
      return response.status(500).json(error);
    });
});

router.patch('/complaints/:id', (request, response) => {
  const { id } = request.params;
  const revision = request.body;
  let correctFormat = true;
  Object.keys(revision).forEach(key => {
    if (!requiredComplaintParameters.includes(key)) {
      correctFormat = false;
    }
  })
  if (!correctFormat) {
    return response.status(422).json({ error: 'Cannot update complaint, invalid property provided. Valid properties include: {user_id: <Integer>, isSoliciting: <String>, subject: <String>, description: <String>, callerIdNumber: <String>, callerIdName: <String>, date: <String>, time: <String>, type: <String>, altPhone: <String>, permissionGranted: <Boolean>, businessName: <String>, agentName: <String>}' });
  }

  database('complaints').where('id', id)
    .select()
    .update(revision)
    .then(complaint => {
      return response.status(201).json({ message: `updated complaint with ID=${id}` });
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

router.delete('/complaints/:id', (request, response) => {
  const { id } = request.params;
  database('complaints').where('id', id).del()
    .then(() => response.status(200).json({ message: `Deleted complaint with ID ${id}.` }))
    .catch(error => response.status(500).json({ error }))
});

module.exports = { router, database };
