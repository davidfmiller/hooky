/* jshint undef: true,strict:true,trailing:true,loopfunc:true */
/* global document,window,Element,module,require */

(function() {
  'use strict';

  window.Hooky = {
  //  vue : require('./lib/vue.min.js'),
    Popover: require('./lib/popover'),
    Clipboard: require('./lib/clipboard')
  //  screen : require('./lib/fullscreen'),
  //  backdrop : require('./lib/backdrop')
  };

  let
  i = 0;

  const
  button = document.querySelector('form.reset button'),
  fields = document.querySelectorAll('pre > span.field'),
  copys = document.querySelectorAll('button.copy'),
  preventDefault = function(e) {
    e.preventDefault();
  };

  new window.Hooky.Popover(null, {position: "side", color: "rgba(0,0,0,0.9)"});
//  window.Hooky.Clipboard('button.copy');

  if (button) {
    button.addEventListener('click', function(e) {
      if (! window.confirm('Are you sure you wish to erase all hooks?')) {
        e.preventDefault();
      }
    });
  }

/*
  popover.on(
    'pop',
    function(target, popover) { window.console.log('pop', target, popover); }
  ).on(
    'unpop',
    function(target, popover) { window.console.log('unpop', target, popover); }
  );
*/

  for (i in fields) {
    if (! fields.hasOwnProperty(i)) {
      continue;
    }
    const span = fields[i], toggle = span.querySelector('span.toggle');
    if (toggle && toggle.parentNode === span) {
      span.classList.add('collapsed');
    }
  }

  for (i in copys) {
    if (! copys.hasOwnProperty(i)) {
      continue;
    }
    copys[i].addEventListener('click', preventDefault);
  }


/*
  clipboard.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

//    e.clearSelection();
});

//alert(window.Hooky.Clipboard.isSupported());

clipboard.on('error', function(e) {
  console.error('Action:', e.action);
  console.error('Trigger:', e.trigger);
});

  /*
  for (var i in copys) {
    if (! copys.hasOwnProperty(i)) { continue; }

    var button = copys[i];
    button.addEventListener('click', function(e) {

      var textarea = e.target.parentNode.parentNode.querySelector('textarea');

      e.preventDefault();

      console.log(form);
    });
  }
*/

  const
  toggler = function(e) {
    const
    needle = 'collapsed';

    let n = e.target.parentNode;

    while (n && n.className.indexOf('field') < 0) {
      n = n.parentNode;
    }
    if (! n) {
      return;
    }

    if (n.className.indexOf(needle) >= 0) {
      n.className = 'field';
    } else {
      n.className += ' ' + needle;
    }
  },
  hover = function(e) {
    let n = e.target.parentNode;
    while (n && n.className.indexOf('field') < 0) {
      n = n.parentNode;
    }
    n.className = n.className.trim() + ' hover';
  },
  blur = function(e) {
    let n = e.target.parentNode;
    while (n && n.className.indexOf('field') < 0) {
      n = n.parentNode;
    }

    n.className = n.className.replace(/hover/gi, '').trim();
  },
  toggles = document.getElementsByClassName('toggle'),
  abbrs = document.getElementsByTagName('abbr'),
  objs = document.getElementsByClassName('obj');

  for (i = 0; i < toggles.length; i++) {
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
})();