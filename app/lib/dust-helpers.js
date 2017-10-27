/*jshint esnext:true */
/* globals require, __dirname */

const
  _ = require('underscore'),
  dust = require('dustjs-linkedin'),
  moment = require('moment'),
  i18n = new (require('i18n-2'))({
    locales: ['en', 'fr'],
//    defaultLocale : 'en',
    directory : __dirname + '/../../../localization/'
  });


(function() { 

'use strict';

dust.helpers.i18n = function(chunk, context, bodies, params) {

  const
    key = params.key;

  var
    lang = context.get(['login', 'language']);

    if (! lang) {
      lang = 'en';
    }

    i18n.setLocale(lang);
//    locale =   var id = 
//    body = bodies.block;

  if (key) {
    chunk.write(i18n.__(key));
  } else {
    dust.log('WARN', 'invalid parameter in @url helper');
  }

//  chunk.render(body, context);

  return chunk;
};


/**

 */
dust.helpers.jsonFormat = function(chunk, context, bodies, params) {

  console.log(params.string)

  try {
    const
      obj = JSON.parse(params.string),
  //    profile = params.profile,
      body = bodies.block;

    chunk.write(
      JSON.stringify(obj, null, "  ")
    );
  } catch(e) {
    chunk.write(params.string);
    return chunk;
  }

//  chunk.render(body, context);

  return chunk;
};

/**

 */
dust.helpers.formatDate = function(chunk, context, bodies, params) {
//  const
//    body = bodies.block;

    if (params.stamp) {
      var mom = moment(Date.parse(params.stamp));
      chunk.write(mom.calendar());
    } else {
      dust.log('WARN', 'invalid parameter in @formatDate helper');
    }

    return chunk;
};


}());
