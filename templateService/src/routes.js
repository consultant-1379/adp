const serviceInfo = require('./views/serviceInfo/serviceInfo.view');

/**
 * All api routes are listed here
 */
module.exports = (app) => {
  // api information
  app.get('/', serviceInfo.getBaseInformation);
};
