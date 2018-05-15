exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('complaints', table => {
      table.boolean('isSoliciting').alter();
      table.string('subject');
      table.string('date').alter();
      table.string('time').alter();
      table.renameColumn('phone', 'callerIdNumber');
      table.boolean('permissionGranted');
      table.string('businessName');
      table.string('agentName');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('complaints')
  ]);
};
