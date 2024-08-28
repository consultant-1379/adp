// ============================================================================================= //
/**
* [ global.adp.httpControls.getSecurityPort ]
* Just return the Security Port ( HTTPS ).
* @return {number} Return the number of the port.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => global.adp.config.securityPort;
// ============================================================================================= //
