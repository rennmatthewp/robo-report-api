const usersData = require('../../../seedData/users-data.json');
const complaintsData = require('../../../seedData/complaints-data.json');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('complaints')
    .del()
    .then(() => knex('users').del())
    .then(() => {
      // Inserts seed entries
      return Promise.all([
        knex('users')
          .insert(usersData, 'id')
          .then(user => {
            const complaints = complaintsData.map((complaint, index) => {
              const user_id = user[index % 3];
              return { ...complaint, user_id };
            });
            return knex('complaints').insert(complaints);
          })
          .then(() => console.log('seeding complete'))
          .catch(error => console.log(`error seeding: ${error}`))
      ]);
    })
    .catch(error => console.log(`error seeding: ${error}`));
};
