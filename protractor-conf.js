'use strict';

var ScreenShotReporter = require('protractor-screenshot-reporter');

//baseUrl: 'http://nodejs-dev.sourcefabric.org/?liveblog[servers][rest]=master.lb-test.sourcefabric.org&liveblog[limit]=5&liveblog[theme]=default',

exports.config = 
{ baseUrl: 'http://nodejs-dev.sourcefabric.org'
, params:
  { baseBackendUrl: 'http://master.lb-test.sourcefabric.org/resources'
  , baseUrl: 'http://nodejs-dev.sourcefabric.org'
  }
, specs:
  [ 'spec/setup.js'
  , 'spec/matchers.js'
  , 'spec/**/*[Ss]pec.js'
  ]
, capabilities:
  { browserName: 'chrome'
  }
, framework: 'jasmine'
, jasmineNodeOpts:
  { showColors: true
  , isVerbose: false
  , includeStackTrace: false
  , defaultTimeoutInterval: 30000
  }

/* global jasmine */
, onPrepare: function() {
  jasmine.getEnv().addReporter(new ScreenShotReporter(
  { baseDirectory: './screenshots'
  , pathBuilder:
    function pathBuilder(spec, descriptions, results, capabilities) {
      return results.passed() + '_' + descriptions.reverse().join('-');
    }
  , takeScreenShotsOnlyForFailedSpecs: true
  }));
  }
};
