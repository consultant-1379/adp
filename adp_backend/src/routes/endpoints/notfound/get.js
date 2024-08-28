// ============================================================================================= //
/**
* [ global.adp.endpoints.notfound.get ]
* Just an output to answer something in case of <b>404 error</b>.<br/>
* Should be changed to answer as a JSON Object.
* @returns 404 - Shows in case of '404' error on any request
* @return 500 - Internal Server Error
* @group Miscellaneous
* @route GET /notfound
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const res = RES;
  res.statusCode = 404;
  res.end('[ ADP Portal - BackEnd Application Server ] - Unknown Command');
};
// ============================================================================================= //
