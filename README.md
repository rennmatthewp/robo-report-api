# Robo-Report

A back-end utility for storing FCC unwanted call complaint data in a postgres database with a CRUD API.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

1. Clone this repository
```
git clone https://github.com/rennmatthewp/roboReport.git
```
2. Change in to the project directory and install the dependencies - 
```
cd roboReport && npm install
```
3. Migrate the database schema (see prerequisites for database creation)
```
knex migrate:latest
``` 
4. Seed the database (optional) 
```
knex seed:run
```
5. Start the server in your terminal - 
```
node server.js
```
4. Visit localhost:3000 in your browser and complete the form to obtain a JWT.

Once the token is received, you may send requests to any of this api's endpoints by including the token in the header of your request. Please see the following prerequisites for establishing the necessary databases **prior** to sending requests to the API or running the test suite.

### Prerequisites

* PostgreSQL (can be installed with [homebrew](https://brew.sh))

```
brew install postgresql
```
* Create two databases, *robo_report* & *robo_report_test* using the postgreSQL command line interface
```
psql

CREATE DATABASE robo_report;

CREATE DATABASE robo_report_test;
```

## API Routes

GET api/v1/authenticate
  
* returns a JWT for the purposes of authenticating requests.

```
{
     token: <JWT>
}
```

GET api/v1/users

* returns an array of objects containing user information
```
[{
    "email": "thedude@gmail.com",
    "phone": "404-555-5555",
    "phoneType": "Wireless",
    "firstName": "Jeffery",
    "lastName": "Lebowski",
    "address": "1091 S Mesa Dr",
    "city": "Los Angeles",
    "state": "CA",
    "zipcode": "90210"
  },
  .
  .
  .
]
```

GET api/v1/users/:id
* Returns a single user (object) by their ID
```
{
    "email": "thedude@gmail.com",
    "phone": "404-555-5555",
    "phoneType": "Wireless",
    "firstName": "Jeffery",
    "lastName": "Lebowski",
    "address": "1091 S Mesa Dr",
    "city": "Los Angeles",
    "state": "CA",
    "zipcode": "90210"
  }
```

GET api/v1/complaints

* returns an array of objects containing complaint information
```
[{
    "isSoliciting": true,
    "subject": "Robocall",
    "description": "A woman wants to eliminate my credit card debt",
    "callerIdNumber": "303-123-1234",
    "callerIdName": "unknown",
    "date": "04/04/2018",
    "time": "5:00 PM",
    "type": "Prerecorded Voice",
    "altPhone": "303-123-1234",
    "permissionGranted": false,
    "businessName": null,
    "agentName": null
  },
  .
  .
  .
]
```

GET api/v1/complaints/:id
* Returns a single complaint (object) by their ID
```
{
    "isSoliciting": true,
    "subject": "Robocall",
    "description": "A woman wants to eliminate my credit card debt",
    "callerIdNumber": "303-123-1234",
    "callerIdName": "unknown",
    "date": "04/04/2018",
    "time": "5:00 PM",
    "type": "Prerecorded Voice",
    "altPhone": "303-123-1234",
    "permissionGranted": false,
    "businessName": null,
    "agentName": null
  }
```

POST api/v1/users
* Creates a new user in the database and returns the newly generated ID
```
{
  id: <Integer>
}
```

POST api/v1/complaints
* Creates a new complaint in the database and returns the newly generated ID
```
{
  id: <Integer>
}
```

PATCH api/v1/users/:id
* Corrects a table column for a user based on ID.
* Responds with number of and name of updated columns
```
{
  message: "<Integer> columns updated: [ <columns> ]. User id: <Integer>"
}
```

PATCH api/v1/complaints/:id
* Corrects a table column for a complaint based on ID.
* Responds with number of and name of updated columns
```
{
  message: "<Integer> columns updated: [ <columns> ]. Complaint id: <Integer>"
}
```

DELETE api/v1/users/:id
* Removes a user from the database and responds with a confirmation message
```
{
  message: "<Integer> row(s) deleted. Deleted user with id: <Integer>."
}
```

DELETE api/v1/complaints/:id
* Removes a complaint from the database and responds with a confirmation message
```
{
  message: "<Integer> row(s) deleted. Deleted complaint with id: <Integer>."
}
```

## Running the tests

The test suite requires the test database *robo_report_test* to be established. Tests can be run with the command:
```
npm test
``` 

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Node](https://nodejs.org/en/) - JS runtime
* [Express](https://expressjs.com/) - Web framework for Node
* [PostgreSQL](https://www.postgresql.org/) - Relational Database
* [Knex](http://knexjs.org/) - SQL query builder

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Matt Renn** - [rennmatthewp](https://github.com/rennmatthewp)
* **Jon Sweet** - [JSweet314](https://github.com/JSweet314)
