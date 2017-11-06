/*jshint esnext:true */
/* globals require, module, console, __dirname */

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

      HookModel = require('./models/hook');
//      session = require('express-session');



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
  app.use(function(req, res, next) {

    if (req.headers['content-type'] != 'text/xml') {
      next();
      return;
    }

    req.rawBody = '';
//    req.setEncoding('utf8');

    req.on('data', function(chunk) { 
      req.rawBody += chunk;
    });

    req.on('end', function(chunk) { 
      next();
    });

  });


  app.set('template_engine', template_engine);
//  app.set('domain', domain);
  app.set('views', __dirname + '/views');
  app.set('view engine', template_engine);

  app.use(function _use(req, res, next) {
    next();
  });

  app.use(morgan('dev')); 
  app.use(express.static(__dirname + '/public'));

  router.get('/hook/:id', function getHook(req, res) {

    resetMetadata(req);

    metadata.page.title = 'Hooky';
    metadata.page.description = 'Hooky';
    metadata.page.class = 'meta about';

    HookModel.query()
    .where('id', '=', req.params.id)
    .then(function _then(hook) {

      res.render('hook', {
        meta : metadata,
        hook : hook
      });

    })
    .catch(function _catch(err) {
      res.status(500).send(err);
    });
  });

  router.get('/hook/:id/raw', function getRaw(req, res) {

    HookModel.query()
    .where('id', '=', req.params.id)
    .then(function _then(hooks) {
      
      if (hooks.length == 0) {
        res.status(404).send('Not found');
        return;
      }

      var
      hook = hooks[0],
      content = hook.body,
      mime = 'text/plain';

      switch (hook.type) {
        case 'json':
          mime = 'application/json';
          content = JSON.stringify(JSON.parse(hook.body), null, '  ');
          break;
        case 'xml':
          mime = 'text/xml';
          break;
      }

      res.setHeader('Content-Type', mime);
//      console.log(hooks[0].body);
      res.status(200).send(content);
    })
    .catch(function _catch(err) {
      res.status(500).send(err);
    });
  });

  router.get('/hook/:id/download', function getDownload(req, res) {

    HookModel.query()
    .where('id', '=', req.params.id)
    .then(function _then(hooks) {
      
      if (hooks.length == 0) {
        res.status(404).send('Not found');
        return;
      }

      var
      hook = hooks[0],
      content = hook.body,
      extension = 'txt',
      mime = 'text/plain';

      switch (hook.type) {
        case 'json':
          mime = 'application/json';
          content = JSON.stringify(JSON.parse(hook.body), null, '  ');
          extension = 'json';
          break;
        case 'xml':
          mime = 'text/xml';
          extension = 'xml';
          break;
      }

      res.setHeader('Content-Disposition', 'attachment; filename=hook-' + req.params.id + '.' + extension);
      res.setHeader('Content-Type', mime);

      res.status(200).send(content);
    })
    .catch(function _catch(err) {
      res.status(500).send(err);
    });
  });



  router.get('/', function getIndex(req, res) {

    resetMetadata(req);

    metadata.page.title = 'Hooky';
    metadata.page.description = 'Hooky';
    metadata.page.class = 'meta about';

      HookModel.query()
      .orderBy('id', 'desc')
      .modify(function _modify(builder) {
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
  //      console.log(builder.toString());
      })
      .then(function _then(hooks) {

        res.render('index', {
          meta : metadata,
          hooks : hooks
        });

      })
      .catch(function _catch(err) {
        res.status(500).send(err);
      });

  });

  router.post('/', function postIndex(req, res) {

    var body = req.body;

//    console.log(req.body);
//    console.log(req.rawBody);

//    res.status(200).send(req.rawBody);
//    return;

    HookModel.query().insert({
      headers : JSON.stringify(req.headers),
      body : JSON.stringify(req.body),
      type : 'json'
    }).then(function _then(hook) {

      res.status(200).send(JSON.stringify(hook, null, 2));

    }).catch(function _catch(err) {
      console.log(err);
    });
  });

  router.post('/example', function postExample(req, res) {

    var obj = {
      'rmr' : {
        'hooky' : 'https://github.com/davidfmiller/hooky',
        'home' : 'https://readmeansrun.com',
        'safari' : 'https://readmeansrun.com/code/readmeansafari/'
      },
      'links' : {
        'strava' : 'https://strava.com/',
        'youtube' : 'https://www.youtube.com/channel/UCf6hm45A9tlsbn11q9loYCw?view_as=subscriber',
        'flickr' : 'https://www.flickr.com/photos/davidfmiller/'
      }
    };

    request.post({url : 'http://localhost:' + port + '/', json: true, body : obj}, function _post(error, response, body) {
      if (error || response.statusCode !== 200)  {
        res.status(500).send(JSON.stringify(e, null, 2));
        return;
      }
      res.redirect(301, '/')
    });
  });


  router.post('/hook/:id/delete', function postDelete(req, res) {

    HookModel
    .query()
    .delete()
    .where('id', req.params.id)
    .then(function _then(thing) {

      res.redirect(301, '/');

    }).catch(function _catch(err) {
      console.log(err);
      reject(err);
    });

  });

  router.post('/reset', function postReset(req, res) {

    HookModel
    .query()
    .delete()
    .then(function _then() {
      res.redirect(301, '/');
    }).catch(function _catch(err) {
      console.log(err);
      res.status(500).send(JSON.stringify(err));
    });

  });


  app.use(morgan('dev')); 
  app.use(express.static(__dirname + '/static'));
  app.use('/', router);

  app.listen(port);
  console.log('💥  ' + port);
  
}());
