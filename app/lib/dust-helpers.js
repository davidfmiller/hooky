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
dust.helpers.url = function(chunk, context, bodies, params) {

  const
    spark = params.spark,
    profile = params.profile,
    body = bodies.block;

  var
    url,
    title = params.title; // optional

  if (spark) {
    title = title ? title : (spark.description ? spark.description : spark.title);
    url = '/spark/' + spark.code;
  }
  else if (profile) {
    title = title ? title : profile.name;
    url = '/profile/' + profile.id;
  } else {
    dust.log('WARN', 'invalid parameter in @url helper');
  }

  chunk.write(
    '<a href="' + _.escape(url) + '" title="' + _.escape(title) + '"' +
    (params.target ? 'target="' + _.escape(params.target) + '"' : '') +
  '>');

  chunk.render(body, context);
  chunk.write('</a>');

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

/**

 */
dust.helpers.img = function(chunk, context, bodies, params) {

  var
//    body = bodies.block,
    image = params.image,
    system = params['default'];

  var
    url = null;

  if (image) {
    url = image.url; // '/fetched/' + image.name;
  } else if (system) {

    image = {
      'profile' : {
        width : 512,
        height : 512,
        url : '/assets/img/default/' + system + '.png'
      },
      'icon' : {
        width : 512,
        height : 512,
        url : '/assets/img/default/' + system + '.png' 
      },
      'spark' : {
        width : 512,
        height : 512,
        url : '/assets/img/default/' + system + '.png'
      }
    }[system];

    url = '/assets/img/default/' + system + '.png';
  } else {
    return;
  }

  if (! url) {
    dust.log('WARN', 'invalid parameter in @img helper');
    return chunk;
  }

  var
  width = params.width ? params.width : image.width ? image.width : 0 ,
  height = params.height ? params.height : image.height ? image.height : 0;

 console.log(image);

  if (image) {
    if (width && ! params.height) {
      height = image.height * (parseInt(width, 10) / image.width);
    } else if (height && ! params.width) {
      width = image.width * (parseInt(height, 10) / image.height);
    }
  }

  chunk.write(
    '<img src="' + _.escape(url) + '"' +
    (params.alt ? ' alt="' + _.escape(params.alt) + '"' : '') +
    (width ? ' width="' + width + '"' : '') +
    (height ? ' height="' + height + '"' : '') +
    (params['class'] ? ' class="' + _.escape(params['class']) + '"' : '') +
    '>'
  );

  return chunk;
};

/**

 */
dust.helpers.loggedin = function(chunk, context, bodies/*, params*/) {
  const body = bodies.block;
  var id = context.get(['login', 'id']);

  if (id) {
    chunk.render(body, context);
  }

  return chunk;
};


/**

 */
dust.helpers.loggedout = function(chunk, context, bodies/*, params*/) {

  const body = bodies.block;
  var id = context.get(['login', 'id']);

  if (! id) {
    chunk.render(body, context);
  }

  return chunk;
};


var favoriteChecker = function(chunk, context, bodies, spark) {

  const
    favorites = context.get(['login', 'favorites']);

  var i = 0;

  if (! spark) {
    dust.log('WARN', 'invalid parameter in @favoriteChecker helper');
    return false;
  }

  if (! favorites) { return false; }

  for (i in favorites) {
    if (favorites[i].id === spark.id) { return true; }
  }

  return false;
};


/**

 */
dust.helpers.myProfile = function(chunk, context, bodies, params) {

  const
  profile = params.profile,
//  spark = params.spark,
  id = context.get(['login', 'id']);

  if (! profile) {
    dust.log('WARN', 'invalid parameter in @myProfile helper');
    return false;
  }

  if (profile.id === id) {
    chunk.render(bodies.block, context);
  }

  return chunk;
};


dust.helpers.otherProfile = function(chunk, context, bodies, params) {

  const
  profile = params.profile,
//  spark = params.spark,
  id = context.get(['login', 'id']);

  if (! profile) {
    dust.log('WARN', 'invalid parameter in @myProfile helper');
    return false;
  }

  if (profile.id !== id) {
    chunk.render(bodies.block, context);
  }

  return chunk;
};



/**

 */
dust.helpers.mySpark = function(chunk, context, bodies, params) {

  const
  spark = params.spark,
  id = context.get(['login', 'id']);

  if (! spark) {
    dust.log('WARN', 'invalid parameter in @mySpark helper');
    return false;
  }

  if (spark.creatorID === id) {
    chunk.render(bodies.block, context);
  }

  return chunk;
};


/**

 */
dust.helpers.sparkSecret = function(chunk, context, bodies, params) {

  const
  spark = params.spark;

  if (! spark) {
    dust.log('WARN', 'invalid parameter in @sparkSecret helper');
    return false;
  }

  if (spark.secret) {
    chunk.render(bodies.block, context);
  }

  return chunk;
};


/**

 */
dust.helpers.sparkPublic = function(chunk, context, bodies, params) {

  const
  spark = params.spark;

  if (! spark) {
    dust.log('WARN', 'invalid parameter in @sparkPublic helper');
    return false;
  }

  if (! spark.secret) {
    chunk.render(bodies.block, context);
  }

  return chunk;
};

/**

 */
dust.helpers.sparkFaved = function(chunk, context, bodies, params) {

  var result = favoriteChecker(chunk, context, bodies, params.spark);

  if (result) {
    chunk.render(bodies.block, context);
  }

  return chunk;
};


dust.helpers.sparkUnfaved = function(chunk, context, bodies, params) {

  var result = favoriteChecker(chunk, context, bodies, params.spark);

  if (! result) {
    chunk.render(bodies.block, context);
  }

  return chunk;
};

}());
