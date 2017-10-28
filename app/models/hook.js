/*jshint esnext:true */
/* globals require, module */

(function() {

  'use strict';

  const
    fs = require('fs'),
    Model = require('objection').Model,
    Knex = require('knex'),
    process = require('process'),
    init = {
      db : {
        "host" : "127.0.0.1",
        "username" : "",
        "password" : "",
        "database" : "",
        "table" : "hook",
        "driver" : "mysql"
      }
    };

  try {

    var path = "../hooky-config.json";

    if (! fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify(init));
      process.stderr.write("🚫 Created default config file at `" + path + "`; enter database credentials and restart hooky-app\n");
      process.exit(1);
    }

    JSON.parse(fs.readFileSync(path)).db;

  } catch (e) {

    process.stderr.write("🚫 Invalid config file at `" + path + "`; ex: \n" + JSON.stringify(init, null, "  ") + "\n");
    process.exit(1);
  }


  var db = JSON.parse(fs.readFileSync("../hooky-config.json")).db;

  var knex = require('knex')({
    client: db.driver,
    connection: {
      host : db.host,
      user : db.username,
      password : db.password,
      database : db.database
    }
  });

  knex.on( 'query', function( queryData ) {
  //  console.log( queryData );
  });


  Model.tableName = db.table;
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
