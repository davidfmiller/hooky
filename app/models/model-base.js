/*jshint esnext:true */
/* globals require, module, __dirname */

(function() {

  'use strict';

  const
    Model = require('objection').Model,
    Knex = require('knex');

  //var knex = new Knex({client: 'sqlite3', connection: {filename: __dirname + '/../data/sparkkr.db'}, useNullAsDefault: true});
  var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'hooky',
      password : 'eP7JzMtnidhAVkmEhsvzzsHb!',
      database : 'hooky'
    }
  });

  knex.on( 'query', function( queryData ) {
  //  console.log( queryData );
  });


  Model.knex(knex);

  module.exports = Model;

}());
