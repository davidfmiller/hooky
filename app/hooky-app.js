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
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
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

      MAXFILESIZE = 2 * 1024 * 1024;

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
          'title' : 'dfm',
          'description' : 'Photography',
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

  app.set('template_engine', template_engine);
//  app.set('domain', domain);
  app.set('views', __dirname + '/views');
  app.set('view engine', template_engine);

  app.use(function(req, res, next) {
    next();
  });

  app.use(morgan('dev')); 
  app.use(express.static(__dirname + '/static'));

  router.get('/', function getAbout(req, res) {

    resetMetadata(req);

    metadata.page.title = 'About Sparkkr';
    metadata.page.description = 'About Sparkkr';
    metadata.page.class = 'meta about';

    res.render('index', {
      meta : metadata
    });

  });

  app.use(morgan('dev')); 
  app.use(express.static(__dirname + '/static'));
  app.use('/', router);

  app.listen(port);
  console.log('💥  ' + port);
  
}());

  
