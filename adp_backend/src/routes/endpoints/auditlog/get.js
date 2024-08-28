// ============================================================================================= //
/**
* [ global.adp.endpoints.auditlog.get ]
* Fetches audit log data for a given log id.<br/>
* @group Audit Log
* @route GET /auditlog
* @param {String} id the id of the required log data
* @returns 200 - The log data related to the passed log id
* @return 500 - Internal Server Error
* @return 400 - incorrect data passed to this end point
* @author Cein-Sven Da Costa [edaccei]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const requestObject = await global.adp.auditlog.read(REQ);
  const res = global.adp.setHeaders(RES);
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = requestObject.getCode();
  res.end(requestObject.getAnswer());
};
// ============================================================================================= //
