/* jshint esnext:true */
/* globals require, module, console, __dirname */

(function() {
  'use strict';

  const
    fs = require('fs'),
    PATH = __dirname + '/../hooky-config.json',
    INIT = {
      db: {
        'host': '127.0.0.1',
        'username': '',
        'password': '',
        'database': '',
        'table': 'hook',
        'driver': 'mysql'
      },
      readonly: false
    };

  try {
    if (! fs.existsSync(PATH)) {
      fs.writeFileSync(PATH, JSON.stringify(INIT, null, '  '));
      process.stderr.write("⚠️  Created default config file at `" + PATH + "`; enter database credentials and run `node hooky-app.js`\n");
      process.exit(1);
    } else {
      process.stdout.write("⚠️  Config exists\n");
    }

    JSON.parse(fs.readFileSync(PATH)).db;
  } catch (e) {
    process.stderr.write("🚫 Invalid config file at `" + PATH + "`; ex: \n" + JSON.stringify(INIT, null, "  ") + "\n");
    process.exit(1);
  }
})();
