/**
* [ adp.endpoints.peopleFinder.getPdlMembers ]
* fetches all members of any given PDLs
* @params {array} list of PDLs
* @author Cein-Sven Da Costa [edaccei]
*/
adp.docs.rest.push(__filename);
module.exports = (REQ, RES) => {
  const packageName = 'adp.endpoints.peopleFinder.getPdlMembers';
  const timer = new Date();
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  const mailList = (REQ.body ? REQ.body : []);
  const pfRecPDLMemb = new adp.peoplefinder.RecursivePDLMembers(mailList, true);
  pfRecPDLMemb.searchByMailers().then((respObj) => {
    adp.echoLog(`Peoplefinder PDL members fetch complete in ${(new Date() - timer)}ms`, null, 200, packageName);
    answer.setData(respObj);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
  }).catch((error) => {
    adp.echoLog(`Peoplefinder PDL members fetch Failed in ${(new Date() - timer)}ms`, error, error.code, packageName);
    res.statusCode = error.code;
    answer.setCode(error.code);
    answer.setMessage(error.message);
    res.end(answer.getAnswer());
  });
};
