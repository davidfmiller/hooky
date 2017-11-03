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

  var button = document.querySelector('form.reset button');
  if (button) {
    button.addEventListener('click', function(e) {
      var b = window.confirm('Are you sure you wish to erase all hooks?');
      if (! b) {
        e.preventDefault();
      }
    });
  }
  
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

    var fields = document.querySelectorAll('pre > span.field');
    for (var i in fields) {
      if (! fields.hasOwnProperty(i)) {
        continue;
      }
      var span = fields[i];
      span.classList.add('collapsed');
    }

    var
    toggler = function(e) {
      var n = e.target.parentNode,
          needle = 'collapsed';

      while (n && n.className.indexOf('field') < 0) { n = n.parentNode; }
      if (! n) { return; }

      if (n.className.indexOf(needle) >= 0) {
        n.className = 'field';
      } else {
        n.className += ' ' + needle;
      }
    },

    hover = function(e) {
      var n = e.target.parentNode;
      while (n && n.className.indexOf('field') < 0) { n = n.parentNode; }
      n.className = n.className.trim() + ' hover';
    },

    blur = function(e) {

      var n = e.target.parentNode;
      while (n && n.className.indexOf('field') < 0) {
        n = n.parentNode;
      }

      n.className = n.className.replace(/hover/gi, '').trim();
    },

    toggles = document.getElementsByClassName('toggle'),
    abbrs = document.getElementsByTagName('abbr'),
    objs = document.getElementsByClassName('obj'),
    open = [],
    close = [],
    i = 0;

    for (; i < toggles.length; i++) {
      toggles[i].addEventListener('click', toggler);
    }

    for (i = 0; i < abbrs.length; i++) {
      abbrs[i].addEventListener('click', toggler);
      abbrs[i].addEventListener('mouseover', hover);
      abbrs[i].addEventListener('mouseout', blur);
    }

    for (i = 0; i < objs.length; i++) {
      objs[i].addEventListener('click', toggler);
      objs[i].addEventListener('mouseover', hover);
      objs[i].addEventListener('mouseout', blur);
    }

}());