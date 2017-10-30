/* jshint undef: true,strict:true,trailing:true,loopfunc:true */
/* global document,window,Element,module,require */

(function() {

  'use strict';

  window.Hooky = {
  //  vue : require('./lib/vue.min.js'),
    Popover : require('./lib/popover')
  //  screen : require('./lib/fullscreen'),
  //  backdrop : require('./lib/backdrop')
  };

  var popover = new window.Hooky.Popover(null, {position: "side", color : "rgba(0,0,0,0.9)"});
/*
  popover.on(
    'pop',
    function(target, popover) { window.console.log('pop', target, popover); }
  ).on(
    'unpop',
    function(target, popover) { window.console.log('unpop', target, popover); }
  );
*/
}());