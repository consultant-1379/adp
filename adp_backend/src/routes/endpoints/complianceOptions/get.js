// ============================================================================================= //
/**
* [ global.adp.endpoints.complianceOptions.get ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const res = global.adp.setHeaders(RES);
  global.adp.compliance.readComplianceOptions.getComplianceOptions()
    .then((DOCS) => {
      res.statusCode = 200;
      res.end(DOCS);
    })
    .catch(() => {
      res.statusCode = 500;
      res.end('');
    });
};
// ============================================================================================= //
