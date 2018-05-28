
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('complaints', table => {
      table.text('description').alter();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('complaints', table => {
      table.string('description').alter();
    })
  ]);
};
