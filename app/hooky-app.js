/*jshint esnext:true */
/* globals require, console, __dirname */

(function(){

  'use strict';
//  require('dustjs-helpers');
//  require('./lib/dust-helpers');

  const
      process = require('process'),
      express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
//      nodemailer = require('nodemailer'),
      fs = require('fs'),
//      markdown = require('markdown').markdown,
      request = require('request'),
      cons = require('consolidate'),
//      fileUpload = require('express-fileupload'),
      queryString = require('query-string'),
      morgan = require('morgan'),
//      cookieParser = require('cookie-parser'),
      HookModel = require('./models/hook'),
      session = require('express-session');

/*
      i18n = new (require('i18n-2'))({
        locales: ['en'],
        defaultLocale : 'en',
        directory : __dirname + '/../../localization/'
      }),
*/
//      AWS = require('aws-sdk'),
//      API = require('./lib/api-bridge'),
//      RMR = require('rmr-lib'),
//      LIB = require('./lib/sparkkr-web-lib'),



  const
      template_engine = 'dust',
//      domain = config.hosts.http.domain,
      router = express.Router(),
      port = 8082,
      metadata = {
        page : {} // see resetMetadata
      },

      resetMetadata = function(req) {
        metadata.page = {
          'image' : '/assets/img/og-image.png',
          'title' : 'hooky',
          'description' : 'Hooky',
          'class' : '',
          'url' : ''
        };

        if (req.query.msg) {
//          metadata.message = i18n.__(req.query.msg);
        } else {
          delete metadata.message;
        }
      };

  app.disable('x-powered-by');
  app.engine('dust', cons.dust);

  app.use(bodyParser.json())

  app.set('template_engine', template_engine);
//  app.set('domain', domain);
  app.set('views', __dirname + '/views');
  app.set('view engine', template_engine);

  app.use(function(req, res, next) {
    next();
  });


  app.use(morgan('dev')); 
  app.use(express.static(__dirname + '/public'));

  router.get('/', function getAbout(req, res) {

    resetMetadata(req);

    metadata.page.title = 'About Sparkkr';
    metadata.page.description = 'About Sparkkr';
    metadata.page.class = 'meta about';

    res.render('index', {
      meta : metadata
    });

  });

  router.post('/', function getAbout(req, res) {

    var body = req.body;

      console.log(req.headers);

      HookModel.query().insert({
        headers : 'HEADERS',
        payload : 'PAYLOAD'
      }).then(function(hook) {
        console.log(hook);
      }).catch(function(err) {
        console.log(err);
      });

/*
        var obj = {};
        obj[socialType + 'ID'] = social.id;

        Person
        .query()
        .patchAndFetchById(personID, obj)
        .then(function(person) {
          resolve(person);
        }).catch(function(err) {
          reject(err);
        });


    var str = (new Date()) + "\n" + JSON.stringify(req.headers, null, 2) + "\n" + JSON.stringify(body, null, 2) + "\n\n";

    fs.appendFile("../hooky.log", str, function(err) {
      if(err) {
        return console.log(err);
      }
      res.status(200).send(req.body);
    }); 

//    resetMetadata(req);
/*
    metadata.page.title = 'About Sparkkr';
    metadata.page.description = 'About Sparkkr';
    metadata.page.class = 'meta about';

    res.render('index', {
      meta : metadata
    });
*/
  });


  app.use(morgan('dev')); 
  app.use(express.static(__dirname + '/static'));
  app.use('/', router);

  app.listen(port);
  console.log('💥  ' + port);
  
}());

  
