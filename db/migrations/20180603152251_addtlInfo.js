
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('complaints', table => {
      table.text('addtlInfo');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('complaints', table => {
      table.dropColumn('addtlInfo');
    })
  ]);
};
