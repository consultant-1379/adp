const serviceInfoContr = require('../../controllers/serviceInfo/serviceInfo.controller');
const { log } = require('../../lib/echolog/echo.lib');
/**
 * All view functions for the service's information are listed here.
 */
const pack = 'serviceinfo.view';

/**
 * get: api information endpoint
 * @returns {object} obj.name {string} the name of the service
 * obj.description {string} the description of the service
 * obj.version {string} the version of the service
 * @author Cein
 */
const getBaseInformation = (req, res) => {
  log('Fetching service base information', null, 200, pack);
  const version = serviceInfoContr.getVersion();
  const detailsObj = serviceInfoContr.getInformation();

  return res.json({ ...detailsObj, version });
};

module.exports = {
  getBaseInformation,
};
