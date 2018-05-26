
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('complaints', table => {
      table.string('isSoliciting').alter();
      table.string('typeOfSolicit');
      table.string('doneBusinessWith');
      table.string('inquiredWith');
      table.string('householdRelation');
      table.dropColumn('permissionGranted');
      table.string('permissionToCall');
      table.string('writtenPermission');
      table.string('dateOfPermission');
      table.renameColumn('type', 'typeOfCall');
      table.string('receivedCallerId');
      table.renameColumn('businessName', 'receivedBusinessName');
      table.string('nameAtBeginning');
      table.renameColumn('agentName', 'providedAdvertiserName');
      table.renameColumn('altPhone', 'providedAdvertiserNumber');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('complaints', table => {
      table.boolean('isSoliciting').alter();
      table.dropColumn('typeOfSolicit');
      table.dropColumn('doneBusinessWith');
      table.dropColumn('inquiredWith');
      table.dropColumn('householdRelation');
      table.boolean('permissionGranted');
      table.dropColumn('permissionToCall');
      table.dropColumn('writtenPermission');
      table.dropColumn('dateOfPermission');
      table.renameColumn('typeOfCall', 'type');
      table.dropColumn('receivedCallerId');
      table.renameColumn('receivedBusinessName', 'businessName');
      table.dropColumn('nameAtBeginning');
      table.renameColumn('providedAdvertiserName', 'agentName');
      table.renameColumn('providedAdvertiserNumber', 'altPhone');
    })
  ]);
};
