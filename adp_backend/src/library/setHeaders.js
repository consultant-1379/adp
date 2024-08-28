// ============================================================================================= //
/**
* [ global.adp.setHeaders ]
* Prepare the Header of the Response to send to FrontEnd.
* @param { Object } RES The Response Object of the requisition.
* @return { Object } The same object but now, with the Headers.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (RES) => {
  // ------------------------------------------------------------------------------------------ //
  try {
    const res = RES;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '-1');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner');
    res.setHeader('Access-Control-Expose-Headers', 'alertbanner');
    res.setHeader('Content-Type', 'application/json');
    return res;
  } catch (e) {
    return false;
  }
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
