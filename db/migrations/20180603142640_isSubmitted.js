
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('complaints', table => {
      table.boolean('isSubmitted');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('complaints', table => {
      table.dropColumn('isSubmitted');
    })
  ]);
};
