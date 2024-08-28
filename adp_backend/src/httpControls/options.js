// ============================================================================================= //
/**
* [ global.adp.httpControls.options ]
* Delivery the certificates files for HTTPS.
* @return {promise} Answer the request and return a Promise when done.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => {
  const keyPath = `${global.adp.path}/keys/adp/server.key`;
  const certPath = `${global.adp.path}/keys/adp/server.crt`;
  const caPath = `${global.adp.path}/keys/adp/intermediate.crt`;
  global.adp.config.ssl = {};
  global.adp.config.ssl.key = global.fs.readFileSync(keyPath);
  global.adp.config.ssl.cert = global.fs.readFileSync(certPath);
  global.adp.config.ssl.ca = global.fs.readFileSync(caPath);
  return true;
};
// ============================================================================================= //
