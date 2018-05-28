/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */

const express = require('express');
const jwt = require('jsonwebtoken');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const router = express.Router();

const checkAuth = (request, response, next) => {
  const token = request.header('token');
  if (!token) {
    return response.status(403).send({ error: 'You are not authorized.' });
  }
  return jwt.verify(token, process.env.secret_key, (error, decoded) => {
    if (error) {
      return response.status(403).send({ error: 'You are not authorized to use this endpoint.' });
    }
    if (decoded.admin) {
      return next();
    }
    return response.status(403).send({ error: 'You are not authorized to use this endpoint.' });
  });
};

const requiredUserParameters = [
  'email',
  'phone',
  'phoneType',
  'phoneLocation',
  'firstName',
  'lastName',
  'address',
  'city',
  'state',
  'zipcode',
];

const requiredComplaintParameters = [
  'user_id',
  'subject',
  'description',
  'isSoliciting',
  'typeOfSolicit',
  'doneBusinessWith',
  'inquiredWith',
  'householdRelation',
  'permissionToCall',
  'writtenPermission',
  'dateOfPermission',
  'date',
  'time',
  'typeOfCall',
  'receivedCallerId',
  'callerIdNumber',
  'callerIdName',
  'receivedBusinessName',
  'nameAtBeginning',
  'providedAdvertiserName',
  'providedAdvertiserNumber',
];

router.post('/authenticate', (request, response) => {
  const { appName, email } = request.body;
  const authorizedEmail = process.env.auth_emails.split(' ').includes(email);

  if (email && appName) {
    jwt.sign({ appName, email, admin: authorizedEmail }, process.env.secret_key, (error, token) => {
      if (error) {
        return response.status(403).send({ error: 'You are not authorized.' });
      }
      return response.status(201).json({ token });
    });
  } else {
    return response.status(402).json({ error: 'Invalid request.' });
  }
  return null;
});

router.get('/users', checkAuth, (request, response) => {
  const { email } = request.query;
  if (email) {
    database('users')
      .where('email', email)
      .select()
      .then((user) => {
        if (!user.length) {
          return response.status(404).json({ error: `Could not find user with email: ${email}.` });
        }
        return response.status(200).json(user[0]);
      })
      .catch(error => response.status(500).json({ error }));
  } else {
    database('users')
      .select()
      .then(users => response.status(200).json(users))
      .catch(error => response.status(500).json({ error }));
  }
});

router.get('/users/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  database('users')
    .where('id', id)
    .then((user) => {
      if (!user[0]) {
        return response
          .status(404)
          .json({ error: `Could not find user with id: ${id}.` });
      }
      return response.status(200).json(user[0]);
    })
    .catch(error => response.status(500).json(error));
});

router.post('/users', checkAuth, (request, response) => {
  const user = request.body;

  for (const parameter of requiredUserParameters) {
    if (!user[parameter]) {
      return response.status(422).json({
        error: `Expected format: { email: <String>, phone: <String>, phoneType: <String>, phoneLocation: <String>, firstName: <String>, lastName: <String>, address: <String>, city: <String>, state: <String>, zipcode: <String> }. Missing required property ${parameter}.`,
      });
    }
  }

  return database('users')
    .insert(user, 'id')
    .then(result => response.status(201).json({ id: result[0] }))
    .catch(error => response.status(500).json(error));
});

router.patch('/users/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  const revision = request.body;
  let correctFormat = true;
  Object.keys(revision).forEach((key) => {
    if (!requiredUserParameters.includes(key)) {
      correctFormat = false;
    }
  });
  if (!correctFormat) {
    return response.status(422).json({
      error: 'Cannot update user, invalid property provided. Valid properties include: { email: <String>, phone: <String>, phoneType: <String>, phoneLocation: <String>, firstName: <String>, lastName: <String>, address: <String>, city: <String>, state: <String>, zipcode: <String> }.',
    });
  }

  return database('users')
    .where('id', id)
    .select()
    .update(revision)
    .then((updateCount) => {
      if (updateCount === 0) {
        return response.status(422).json({
          error: `${updateCount} column(s) updated. Unable to find user with id: ${id}`,
        });
      }
      const updates = Object.keys(revision).join(', ');
      return response.status(201).json({
        message: `${updateCount} column(s) updated: [ ${updates} ]. User id: ${id}.`,
      });
    })
    .catch(error => response.status(500).json({ error }));
});

router.delete('/users/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  database('complaints')
    .where('user_id', id)
    .del()
    .then((complaintsDelCount) => {
      if (complaintsDelCount === 0) {
        return response.status(422).json({
          error: `${complaintsDelCount} row(s) deleted. No complaint found with user_id: ${id}`,
        });
      }
      return database('users')
        .where('id', id)
        .del()
        .then((deleteCount) => {
          if (deleteCount === 0) {
            return response.status(422).json({
              error: `${deleteCount} row(s) deleted. No user found with id: ${id}`,
            });
          }
          return response.status(200).json({
            message: `${deleteCount} row(s) deleted. Deleted user with id: ${id}.`,
          });
        })
        .catch(error => response.status(500).json({ error }));
    })
    .catch(error => response.status(500).json(error));
});

router.get('/complaints', checkAuth, (request, response) => {
  const { city, user_id } = request.query;

  if (city) {
    return database('users')
      .where('city', city)
      .select()
      .then((users) => {
        const ids = users.map(user => user.id);
        return database('complaints')
          .whereIn('user_id', ids)
          .select()
          .then(complaints => response.status(200).json(complaints))
          .catch(error => response.status(500).json({ error }));
      });
  }

  if (user_id) {
    return database('complaints')
      .where('user_id', user_id)
      .then((complaints) => {
        if (!complaints.length) {
          return response
            .status(404)
            .json({ error: `No complaints found for user with id: ${user_id}.` });
        }
        return response.status(200).json(complaints);
      })
      .catch(error => response.status(500).json({ error }));
  }

  return database('complaints')
    .select()
    .then(complaints => response.status(200).json(complaints))
    .catch(error => response.status(500).json({ error }));
});

router.get('/complaints/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  database('complaints')
    .where('id', id)
    .then((complaint) => {
      if (!complaint[0]) {
        return response
          .status(404)
          .json({ error: `Could not find complaint with id: ${id}.` });
      }
      return response.status(200).json(complaint[0]);
    })
    .catch(error => response.status(500).json(error));
});

router.post('/complaints', checkAuth, (request, response) => {
  const complaint = request.body;

  for (const parameter of requiredComplaintParameters) {
    if (complaint[parameter] === undefined) {
      return response.status(422).json({
        error: `Expected format: { user_id: <Integer>, subject: <String>, description: <String>, isSoliciting: <String>, typeOfSolicit: <String>, doneBusinessWith: <String>, inquiredWith: <String>, householdRelation: <String>, permissionToCall: <String>, writtenPermission: <String>, dateOfPermission: <String>, date: <String>, time: <String>, typeOfCall: <String>, receivedCallerId: <String>, callerIdNumber: <String>, callerIdName: <String>, receivedBusinessName: <String>, nameAtBeginning: <String>, providedAdvertiserName: <String>, providedAdvertiserNumber: <String> }. Missing required property ${parameter}.`,
      });
    }
  }

  return database('complaints')
    .insert(complaint, 'id')
    .then(result => response.status(201).json({ id: result[0] }))
    .catch(error => response.status(500).json(error));
});

router.patch('/complaints/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  const revision = request.body;
  let correctFormat = true;
  Object.keys(revision).forEach((key) => {
    if (!requiredComplaintParameters.includes(key)) {
      correctFormat = false;
    }
  });
  if (!correctFormat) {
    return response.status(422).json({
      error: 'Cannot update complaint, invalid property provided. Valid properties include: { user_id: <Integer>, isSoliciting: <String>, subject: <String>, description: <String>, callerIdNumber: <String>, callerIdName: <String>, date: <String>, time: <String>, type: <String>, altPhone: <String>, permissionGranted: <Boolean>, businessName: <String>, agentName: <String> }.',
    });
  }

  return database('complaints')
    .where('id', id)
    .select()
    .update(revision)
    .then((updateCount) => {
      if (updateCount === 0) {
        return response.status(422).json({
          error: `${updateCount} column(s) updated. Unable to find complaint with id: ${id}`,
        });
      }
      const updates = Object.keys(revision).join(', ');
      return response.status(201).json({
        message: `${updateCount} column(s) updated: [ ${updates} ]. Complaint id: ${id}.`,
      });
    })
    .catch(error => response.status(500).json({ error }));
});

router.delete('/complaints/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  database('complaints')
    .where('id', id)
    .del()
    .then((deleteCount) => {
      if (deleteCount === 0) {
        return response.status(422).json({
          error: `${deleteCount} row(s) deleted. No complaint found with id: ${id}`,
        });
      }
      return response.status(200).json({
        message: `${deleteCount} row(s) deleted. Deleted complaint with id: ${id}.`,
      });
    })
    .catch(error => response.status(500).json({ error }));
});

module.exports = { router, database };
