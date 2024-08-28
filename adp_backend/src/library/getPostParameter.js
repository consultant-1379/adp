// ============================================================================================= //
/**
* [ global.adp.getPostParameter ]
* A Shortcut to retrieve a specific parameter from <b>POST</b>.
* @param {Object} REQ The Request Object which contains the variables.
* @param {String} TYPE Inform the type of the variable ( 'ARRAY', 'INTEGER', 'STRING' ).
* @param {String} NAME The name of variable.
* @param {Variable} ONFAIL The value of the return in case of fail.
* @return Returns the value of the variable from <b>POST</b>.
* If cannot found, returns the value of <b>ONFAIL</b>.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (REQ, TYPE, NAME, ONFAIL) => {
  // ------------------------------------------------------------------------------------------- //
  const name = NAME.toLowerCase();
  // ------------------------------------------------------------------------------------------- //
  switch (TYPE.toUpperCase()) {
    case 'ARRAY':
      if (Array.isArray(REQ.headers[name])) {
        return REQ.headers[name];
      }
      break;
    case 'INTEGER':
      if (parseInt(`${REQ.headers[name]}`, 10) > -1) {
        return parseInt(REQ.headers[name], 10);
      }
      break;
    case 'STRING':
      if (typeof REQ.headers[name] === 'string' || REQ.headers[name] instanceof String) {
        return `${REQ.headers[name]}`;
      }
      break;
    default:
      return ONFAIL;
  }
  return ONFAIL;
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
