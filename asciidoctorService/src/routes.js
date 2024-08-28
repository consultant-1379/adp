const serviceInfo = require('./views/serviceInfo/serviceInfo.view');
const asciidoc = require('./views/asciidoctor/asciidoctor.view');

/**
 * All api routes are listed here
 */
module.exports = (app) => {
  // api information
  app.get('/', serviceInfo.getBaseInformation);

  app.post('/asciiToHtml', asciidoc.asciiToHtml);
};
