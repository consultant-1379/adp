// ============================================================================================= //
/**
* [ global.adp.endpoints.integration.documentation ]
* Returns the html documentation for the integration API.
* @param {String} Version of the api to show.
* @return {object} 200  - Shows requested Documentation
* @return 404 - Version not found
* @return 500 - Internal Server Error
* @route GET /integration
* @author John Dolan [xjohdol]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const integrationApiVersion = REQ.params.version;

  global.adp.integration.documentation(integrationApiVersion).then((result) => {
    RES.writeHeader(200, { 'Content-Type': 'text/html' });
    RES.write(result);
    RES.end();
  }).catch(() => {
    RES.writeHeader(404, { 'Content-Type': 'text/html' });
    RES.write(`Integration API version ${integrationApiVersion} not found.`);
    RES.end();
  });
};
