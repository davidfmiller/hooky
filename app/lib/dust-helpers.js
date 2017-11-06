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
dust.helpers.table = function(chunk, context, bodies, params) {


  try {
    const
      obj = JSON.parse(params.object),
  //    profile = params.profile,
      body = bodies.block;

    chunk.write('<table class="headers"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody>');
    for (var i in obj) {
      if (! obj.hasOwnProperty(i)) {
        continue;
      }
      chunk.write(
        '<tr><th>' + i + '</th><td>: ' + obj[i] + '</td></tr>'
      );
    }

    chunk.write('</tbody></table>');

  } catch(e) {
    chunk.write(params.string);
    return chunk;
  }

//  chunk.render(body, context);

  return chunk;
};

var _jsonFormat = function(obj) {

  var
  b64EncodeUnicode = function(str) { return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) { return String.fromCharCode('0x' + p1); })); },
  isFunction= function(o) { return typeof o === 'function';},
  isObject  = function(o) { return (typeof o === 'object'); },
  isArray   = function (o) { return Array.isArray(o); },
  _toStr    = Object.prototype.toString,
  UNDEFINED = 'undefined',
  OBJECT    = 'object',
  NULL      = 'null',
  STRING    = 'string',
  NUMBER    = 'number',
  BOOLEAN   = 'boolean',

  localize = function() {
    return '';
  },

  // utility function used to determine how to serialize a variable.
  _type = function(o) {
      var t = typeof o;
      return  _allowable[t] ||              // number, string, boolean, undefined
              _allowable[_toStr.call(o)] || // Number, String, Boolean, Date
              (t === OBJECT ?
                  (o ? OBJECT : NULL) :     // object, array, null, misc natives
                  UNDEFINED);               // function, unknown
  },

  // escapes a special character to a safe Unicode representation
  _char = function(c) {
      if (!_CHAR[c]) {
          _CHAR[c] = '\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
          _CHAR_COUNT[c] = 0;
      }

      // === to avoid this conditional for the remainder of the current operation
      if (++_CHAR_COUNT[c] === _CACHE_THRESHOLD) {
          _COMMON.push([new RegExp(c, 'g'), _CHAR[c]]);
          _COMMON_LENGTH = _COMMON.length;
      }

      return _CHAR[c];
  },

  // enclose escaped strings in quotes
  _string = function(s) {
    var
    i = 0,
    chr;

    // preprocess the string against common characters to avoid function overhead associated with replacement via function.
    for (; i < _COMMON_LENGTH; i++) {
      chr = _COMMON[i];
      s = s.replace(chr[0], chr[1]);
    }

    var
    v = s.replace(_SPECIAL, _char),
    isLink = v.substring(0, 7) === 'http://' || v.substring(0, 8) === 'https://';

    // original function replace for the not-as-common set of chars
    return QUOTE + (isLink ? '<a href="' + v + '">' : '') + v + (isLink ? '</a>' : '') + QUOTE;
  },

  // add provided space to the beginning of every line in the input string
  _indent = function(s,space) {
    return s.replace(/^/gm, space);
  },

  // JavaScript implementation of stringify (see API declaration of stringify)
  _stringify = function(o,space) {
      if (o === undefined) {
          return undefined;
      }

      var replacer = null, //isFunction(w) ? w : null,
          format   = _toStr.call(space).match(/String|Number/) || [],
          _date    = 'TODO', //Y.JSON.dateToString,
          stack    = [],
          tmp,i,len;

      _CHAR_COUNT      = {};
      _CACHE_THRESHOLD = 100;

/*
      if (replacer || !isArray(w)) {
          w = undefined;
      }

      // Ensure whitelist keys are unique
      if (w) {
          tmp = {};
          for (i = 0, len = w.length; i < len; ++i) {
              tmp[w[i]] = true;
          }
          w = tmp;
      }
*/
      // Per the spec, strings are truncated to 10 characters and numbers
      // are converted to that number of spaces (max 10)
      space = format[0] === 'Number' ?
                  new Array(Math.min(Math.max(0,space),10)+1).join(" ") :
                  (space || EMPTY).slice(0,10);

      function _serialize(h,key, ctx) {

          var value = h[key],
              t     = _type(value),
              a     = [],
              colon = COLON, //space ? COLON_SP : COLON,
              arr, i, keys, k, v;

          if (arguments.length === 2) {
              ctx = '';
          }

          // Per the ECMA 5 spec, toJSON is applied before the replacer is
          // called.  Also per the spec, Date.prototype.toJSON has been added, so
          // Date instances should be serialized prior to exposure to the
          // replacer.  I disagree with this decision, but the spec is the spec.
          if (value === null) { 

  //        } else  if (isObject(value) && isFunction(value.toJSON)) {
  //            value = value.toJSON(key);
          } else if (t === DATE) {
              value = _date(value);
          }

/*    
          if (isFunction(replacer)) {
              value = replacer.call(h,key,value);
          }
*/
          if (value !== h[key]) {
              t = _type(value);
          }

          switch (t) {
              case DATE    : // intentional fallthrough.  Pre-replacer Dates are
                             // serialized in the toJSON stage.  Dates here would
                             // have been produced by the replacer.
              case OBJECT  : break;
              case STRING  :
                return "<span class=\"str\">" + _string(value) + "</span>";
              case NUMBER  : return "<span class=\"num\">" + (isFinite(value) ? value+EMPTY : NULL) + "</span>";
              case BOOLEAN : return "<span class=\"bool\">" + value+EMPTY + "</span>";
              case NULL    : return "<span class=\"null\">" + NULL + "</span>"; 
              default      : return undefined;
          }

          // Check for cyclical references in nested objects
          for (i = stack.length - 1; i >= 0; --i) {
              if (stack[i] === value) {
                  throw new Error("JSON.stringify. Cyclical reference");
              }
          }

          arr = isArray(value);

          // Add the object to the processing stack
          stack.push(value);

          var expander = false,
              abbr = '';

          if (arr) { // Array
              for (i = value.length - 1; i >= 0; --i) {
                  expander = _type(value[i]) === OBJECT;
                  abbr = '';

                  if (expander) {
                    if (isArray(value[i])) {
                      if (value[i].length) {
                        abbr = ABBR_ARRAY;
                      } else {
                        expander = false;
                        abbr = '';
                      }
                    } else { // it's an object
                      if (Object.keys(value[i]).length) {
                        abbr = ABBR_OBJECT;
                      } else {
                        expander = false;
                        abbr = '';
                      }
                    }
                  }

                  a[i] = ('<span class="field">' + (expander ? EXPANDER + abbr : "") + '<span class="value" title="' + (ctx + '[' + i + ']') + '">' +  _serialize(value, i, ctx + '[' + i + ']') + '</span></span>') || NULL;
              }
          } else {   // Object
              // If whitelist provided, take only those keys
              keys = /*w ||*/ value;
              i = 0;

              for (k in keys) {
                  if (keys.hasOwnProperty(k)) {
                      v = _serialize(value, k, (ctx ? ctx + '.' : '') + k);
                      if (v) {
                          expander = _type(value[k]) === OBJECT;
                          abbr = '';
                          if (expander) {
                            if (isArray(value[k])) {
                              if (value[k].length) {
                                abbr = ABBR_ARRAY;
                              } else {
                                expander = false;
                                abbr = '';
                              }
                            } else { // it's an object
                              abbr = ABBR_OBJECT;
                            }
                          }
                          a[i++] = '<span class="field">' + (expander ? EXPANDER : '') + "<span title=\"" + ((ctx ? ctx + '.' : '') + k) + "\" class=\"key" + (expander ? " obj" : "") + "\">" + _string(k) + "</span>" + colon + abbr + '<span class="value" title="' + ((ctx ? ctx + '.' : '') + k) + '">' + v + '</span></span>';
                      }
                  }
              }
          }

          // remove the array from the stack
          stack.pop();

          if (space && a.length) {
              return arr ?
                  OPEN_A + CR + _indent(a.join(COMMA_CR), space) + CR + CLOSE_A :
                  OPEN_O + CR + _indent(a.join(COMMA_CR), space) + CR + CLOSE_O;
          } else {
              return arr ?
                  OPEN_A + a.join(COMMA) + CLOSE_A :
                  OPEN_O + a.join(COMMA) + CLOSE_O;
          }
      }

      // process the input
      return _serialize({'':o},'', '');
  },

  EXPANDER = '<span title="' + localize('toggle') + '" class="toggle"></span>',
  ABBR_OBJECT = '<abbr>{<span title="' + localize('expand') + '">&#x2026;</span>}</abbr>',
  ABBR_ARRAY = '<abbr>[<span title="' + localize('expand') + '">&#x2026;</span>]</abbr>',

  DATE  = 'date',
  _allowable= {
    'undefined'        : UNDEFINED,
    'string'           : STRING,
    '[object String]'  : STRING,
    'number'           : NUMBER,
    '[object Number]'  : NUMBER,
    'boolean'          : BOOLEAN,
    '[object Boolean]' : BOOLEAN,
    '[object Date]'    : DATE,
    '[object RegExp]'  : OBJECT
  },
  EMPTY     = '',
  OPEN_O    = '<span class="open">{</span>',
  CLOSE_O   = '<span class="close">}</span>',
  OPEN_A    = '<span class="open">[</span>',
  CLOSE_A   = '<span class="close">]</span>',
  COMMA     = ',',
  COMMA_CR  = ",\n",
  CR        = "\n",
  COLON     = ':',
  COLON_SP  = ': ',
  QUOTE     = '"',

  // regex used to capture characters that need escaping before enclosing their containing string in quotes.
  _SPECIAL = /[\x00-\x07\x0b\x0e-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

  // character substitution map for common escapes and special characters.
  _COMMON = [
    [/\\/g, '\\\\'],
    [/\"/g, '\\"'],
    [/\x08/g, '\\b'],
    [/\x09/g, '\\t'],
    [/\x0a/g, '\\n'],
    [/\x0c/g, '\\f'],
    [/\x0d/g, '\\r']
  ],
  _COMMON_LENGTH = _COMMON.length,

  // In-process optimization for special character escapes that haven't yet
  // been promoted to _COMMON
  _CHAR = {},

  // Per-char counter to determine if it's worth fast tracking a special
  // character escape sequence.
  _CHAR_COUNT, _CACHE_THRESHOLD;

  return _stringify(obj, "  ");
}

/**

 */
dust.helpers.bodyFormat = function(chunk, context, bodies, params) {

  const
    obj = JSON.parse(params.string) //params.type == 'json' ? JSON.parse(params.string) : params.string,
  ;

  console.log(params.type);

  // if we don't need all the <html> tags...
  if (parseInt(params.tags, 10) == 0) {
    chunk.write(JSON.stringify(obj, null, '  '));
    return chunk;
  }

  try {
    chunk.write(
      _jsonFormat(obj)
    );
  } catch(e) {
    chunk.write(params.string);
    return chunk;
  }

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
