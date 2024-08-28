const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

//jasmine.getEnv().clearReporters();               // remove default reporter logs
jasmine.getEnv().addReporter(new SpecReporter({  // add jasmine-spec-reporter
  spec: {
    displayPending: true,
  },
  summary: {
    displayDuration: true,
  }
}));

const HtmlReporter = require('jasmine-pretty-html-reporter').Reporter;
jasmine.getEnv().addReporter(new HtmlReporter({
  path: 'reports/unit'
}));