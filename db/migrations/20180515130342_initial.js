exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('email').unique();
      table.string('phone').unique();
      table.string('phoneType');
      table.string('firstName');
      table.string('lastName');
      table.string('address');
      table.string('city');
      table.string('state');
      table.integer('zipcode');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('complaints', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.string('isSoliciting');
      table.string('description');
      table.string('phone');
      table.string('callerIdName');
      table.date('date');
      table.time('time');
      table.string('type');
      table.string('altPhone');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('complaints'),
    knex.schema.dropTable('users')
  ]);
};
