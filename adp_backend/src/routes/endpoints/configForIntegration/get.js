// ============================================================================================= //
/**
* [ global.adp.endpoints.configForIntegration.get ] Provides data from config.json of Back End
* @author Tirth [zpiptir]
*/

/**
 * @swagger
 * /configForIntegration:
 *    get:
 *      description: This endpoint provides field values from config.json of Back End.
 *      responses:
 *        '200':
 *          description: Ok. Successfully displayed the version from package.json.
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Config For Integration Test
 */

// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const res = adp.setHeaders(RES);
  const configObject = {};

  configObject.mockServerAddress = adp.config.mockServerAddress;
  configObject.mockServerPort = adp.config.mockServerPort;
  configObject.environmentID = adp.config.environmentID;
  configObject.integrationTestsPassword = adp
    && adp.config
    && adp.config.integrationTestsPassword
    ? adp.config.integrationTestsPassword
    : null;

  configObject.mockServer = adp.config.mockServer;
  configObject.environmentID = adp.config.environmentID;
  configObject.mimerServer = adp.config.mimerServer;
  configObject.muninServer = adp.config.muninServer;
  configObject.eridocServer = adp.config.eridocServer;
  configObject.primDDServer = adp.config.primDDServer;
  configObject.mockArtifactoryAddress = adp.config.mockArtifactoryAddress;

  if (configObject.mockServerAddress
    && configObject.mockServerPort
    && configObject.mimerServer
    && configObject.muninServer
    && configObject.eridocServer
    && configObject.mockServer
    && configObject.environmentID
    && configObject.primDDServer
    && configObject.mockArtifactoryAddress
  ) {
    configObject.gotAllValues = true;
    res.statusCode = 200;
    res.end(JSON.stringify(configObject));
  } else {
    configObject.gotAllValues = false;
    res.statusCode = 500;
    res.end(JSON.stringify(configObject));
  }
};
// ============================================================================================= //
