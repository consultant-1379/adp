// ============================================================================================= //
/**
* [ global.adp.endpoints.auditlog.get ]
* Retrieve audit log/s related to type and can be refined by the given parameters.
* <br/> All parameters are optional depending on the use case.
* <br/><br/> If <b>no parameters</b> are passed, all logs will be passed through.
* <br/><br/> <b>typeoroption</b> if passed by <b>type and not option:</b>
* <br/> <b>type</b> will be the log type such as microservices or services.
* <br/> If type is only give, all logs related to that type will be retrieved.
* <br/> type has only one option there after which is <b>id</b> this is the <b>type id</b>.
* <br/> type id will list all logs related to that type and the type's id.
* <br/><br/> The <b>option of typeoroption</b> is defined by passing <b>'byusersignum'</b>.
* <br/> typeoroption <b>'byusersignum' MUST have a id passed! That id is the users signum</b>
* <br/> This will list all logs related to that user's signum.
* <br/> Extra optional items relating to byusersignum and the signum Id:
* <br/> <b>optiontype</b> which is the <b>type</b> will be the log type such
* as microservices or services.
* <br/> if <b>optiontype</b> is given with byusersignum & the id,
* the logs will be filtered by that given type relating to the given signum.
* <br/> Extra optional items relating to byusersignum and the signum Id:
* <br/> <b>optiontypeid</b> which is the <b>type id</b> such has microservice id.
* <br/> This will list all logs related to the user's signum, type and type id.
* <br/><br/> All log files are listed as latest first
*
* @group Audit Logs
* @route GET /auditlogs/:typeoroption?/:id?/:optiontype?/:optiontypeid?
* @param {String} typeoroption (optional) type is the database log type
* e.g microservice, option would be byusersignum then a signum must be supplied as the id
* @param {string} id the id of the log type which is optional,
* if a option is defined as byusersignum then a signum must be passed
* @param {string} optiontype (optional) only used for typeoroption defined as byusersignum,
* this will be the log type to filter by e.g microservice
* @returns 200 - The log data related to the passed log id
* @return 500 - Internal Server Error
* @return 400 - incorrect data passed to this end point
* @author Cein-Sven Da Costa [edaccei]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const requestObject = await global.adp.auditlogs.read(REQ);
  const res = global.adp.setHeaders(RES);
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = requestObject.getCode();
  res.end(requestObject.getAnswer());
};
// ============================================================================================= //
