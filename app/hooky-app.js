/*jshint esnext:true */
/* globals require, console, __dirname */

(function(){

  'use strict';
  require('dustjs-helpers');
  require('./lib/dust-helpers');

  const
      process = require('process'),
      express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      fs = require('fs'),
      request = require('request'),
      cons = require('consolidate'),
      queryString = require('query-string'),
      morgan = require('morgan'),

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
          'keywords' : 'hooky',
          'description' : 'A simple tool for logging webhooks',
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

  router.get('/hook/:id', function getAbout(req, res) {

    resetMetadata(req);

    metadata.page.title = 'Hooky';
    metadata.page.description = 'Hooky';
    metadata.page.class = 'meta about';

    HookModel.query()
    .where('id', '=', req.params.id)
    .then(function (hook) {

      console.log(hook);

      res.render('hook', {
        meta : metadata,
        hook : hook
      });

    })
    .catch(function (err) {
      res.status(500).send(err);
    });


  });


  router.get('/', function getAbout(req, res) {

    resetMetadata(req);

    metadata.page.title = 'Hooky';
    metadata.page.description = 'Hooky';
    metadata.page.class = 'meta about';

      HookModel.query()
      .orderBy('id', 'desc')
      .modify(function (builder) {
/*
        if (query.code) {
          builder.where('code', query.code);
        }

        if (query.person) {
          builder.where('secret', '0');
          builder.orWhere('creatorID', '=', query.person);
        }
*/
  //      if (query.eager) {
  //        builder.where('code', query.code);
  //      }

  //      console.log(query);
  /*
        if (Object.keys(req.query).length !== 0) {
          var key = Object.keys(req.query)[0];
          if (key == 'person') {
            builder.where('secret', '0');
            builder.orWhere('creatorID', '=', req.query[key]);
          }
          else {
            builder.orWhere(key, '=', req.query[key]);
          }
        } else {
          builder.where('secret', '0');
        }
  */
  //      console.log(builder.toString());

  //      console.log(builder.toString());
      })
//      .eager('[creator.[image, github, instagram, twitter], icon, image]')
      .then(function (hooks) {

        res.render('index', {
          meta : metadata,
          hooks : hooks
        });

      })
      .catch(function (err) {
        res.status(500).send(err);
      });

  });

  router.post('/', function getAbout(req, res) {

    var body = req.body;

      console.log(req.headers, req.body);

      HookModel.query().insert({
        headers : JSON.stringify(req.headers),
        payload : JSON.stringify(req.body)
      }).then(function(hook) {

        res.status(200).send(JSON.stringify(hook, null, 2));

      }).catch(function(err) {
        console.log(err);
      });

  });

  app.use(morgan('dev')); 
  app.use(express.static(__dirname + '/static'));
  app.use('/', router);

  app.listen(port);
  console.log('💥  ' + port);
  
}());
