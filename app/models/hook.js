/*jshint esnext:true */
/* globals require, module */

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


  Model.tableName = 'hook';
  Model.jsonSchema = {
    type: 'object',
    required: ['headers', 'payload'],

    properties: {
      id: { type: 'integer' },
      headers: { type: 'string'},
      payload: { type: 'string' },
      creationStamp: { type: 'string' }
    }
  };


  Model.knex(knex);

//  module.exports = Model;

/*
  const BaseModel = require('./model-base');

  function Hook() {
    BaseModel.apply(this, arguments);
  }

//  console.log(Model);

  BaseModel.extend(Hook);

  Hook.tableName = 'hook';


  Hook.prototype.$afterGet = function() {
    //this.url = 'https://' + this.bucket + '.s3.amazonaws.com/' + this.name;
  };

  Hook.prototype.$beforeInsert = function () {
  //  this.creationStamp = new Date().toISOString();
  };
*/
  module.exports = Model;

}());
