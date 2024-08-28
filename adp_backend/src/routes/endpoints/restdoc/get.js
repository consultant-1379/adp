// ============================================================================================= //
// global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  let myURL = '';
  if (REQ.secure) {
    myURL = `https://${REQ.headers.host}/`;
  } else {
    myURL = `http://${REQ.headers.host}/`;
  }
  const theResult = await global.adp.docs.generateDocs('REST', myURL);
  const res = RES;
  res.statusCode = 200;
  res.end(theResult);
};
// ============================================================================================= //
