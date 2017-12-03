
(function() {
  'use strict';

  const
    fs = require('fs'),
    Model = require('objection').Model,
//    process = require('process'),
    path = __dirname + '/../../hooky-config.json',
    db = JSON.parse(fs.readFileSync(path)).db,
    knex = require('knex')({
      client: db.driver,
      connection: {
        host: db.host,
        user: db.username,
        password: db.password,
        database: db.database
      }
    });

  knex.on( 'query', function(/* queryData */) {
  //  console.log( queryData );
  });

  Model.tableName = db.table;
  Model.jsonSchema = {
    type: 'object',
    required: ['headers', 'body'],

    properties: {
      id: { type: 'integer' },
      headers: { type: 'string'},
      body: { type: 'string' },
      type: { type: 'string' },
      creationStamp: { type: 'string' }
    }
  };

  Model.knex(knex);
  module.exports = Model;
})();