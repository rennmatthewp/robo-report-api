
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.string('phoneLocation');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.dropColumn('phoneLocation');
    })
  ]);
};
