exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('users', table => {
      table.string('zipcode').alter();
    })
  ])  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ]);
};
