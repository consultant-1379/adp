const { SpecReporter } = require('jasmine-spec-reporter');

jasmine.getEnv().addReporter(new SpecReporter({
  spec: {
    displayPending: true,
  },
  summary: {
    displayDuration: true,
  },
}));

const HtmlReporter = require('jasmine-pretty-html-reporter').Reporter;
jasmine.getEnv().addReporter(new HtmlReporter({
  path: 'reports/unit'
}));