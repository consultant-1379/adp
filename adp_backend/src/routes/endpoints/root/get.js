// ============================================================================================= //
/**
* [ global.adp.endpoints.root.get ] Root of the Application.
* @group Miscellaneous
* @returns {Integer} 200 with a JSON Object, displaying the name and description of this App.
* @route GET /
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const res = global.adp.setHeaders(RES);
  res.statusCode = 200;
  const myJSON = {
    name: 'ADP Portal',
    description: 'BackEnd Application Server',
  };
  res.end(JSON.stringify(myJSON));
};
// ============================================================================================= //
