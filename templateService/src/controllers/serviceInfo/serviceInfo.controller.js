const pjson = require('../../../package.json');
/**
 * API information controller
 * any information about this api can be controlled here.
 */

/**
* Serves the version of this api
* @returns {string} version of the service
* @author Cein
*/
const getVersion = () => pjson.version;

/**
* Serves the version of this api
* @returns {object} obj.name {string} the name of the service
* obj.description {string} the description of the service
* @author Cein
*/
const getInformation = () => {
  const { name, description } = pjson;
  return {
    name,
    description,
  };
};


module.exports = {
  getVersion,
  getInformation,
};
