// ============================================================================================= //
/**
* [ global.adp.endpoints.doc.get ]
* This <b>EndPoint</b> was created to be used direct in the <b>browser</b>.<br/>
* Generate and display the HTML with the internal documentation ( <i>For
* developers who need to work with the <b>ADP BackEnd NodeJS API</b></i> ).<br/>
* The default action is show <b>all documentation</b> available for <b>NodeJS API</b>.
* But is possible to filter the package,
* adding <b>/adp/{Name of the Package}</b> on the URL. So, if the link is
* <b>https://{address}/doc</b>, use <b>https://{address}/doc/adp/document</b>
* for list the <b>[ global.adp.document ]</b> package.
* @group Internal Commands
* @returns 200 - ADP Portal Backend Application NODE.JS Documentation.
* @return 500 - Internal Server Error
* @return 404 - Item not found
* @route GET /doc
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const res = RES;
  const theResult = await global.adp.docs.generateDocs('DOC', null, REQ.params);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.statusCode = 200;
  res.end(theResult);
};
// ============================================================================================= //
