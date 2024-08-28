// ============================================================================================= //
/**
* [ global.adp.endpoints.tagsCounter.get ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  let p1 = null;
  let p2 = null;
  if (REQ.params.searchLevel1 !== null && REQ.params.searchLevel1 !== undefined) {
    if (REQ.params.searchLevel2 !== null && REQ.params.searchLevel2 !== undefined) {
      p1 = REQ.params.searchLevel1;
      p2 = REQ.params.searchLevel2;
    } else {
      p2 = REQ.params.searchLevel1;
    }
  }
  const docs = await global.adp.tags.count(p1, p2);
  answer.setCode(docs.code);
  res.statusCode = docs.code;
  answer.setCache(docs.cache);
  answer.setMessage(docs.msg);
  answer.setTotal(docs.data.length);
  answer.setPage(1);
  answer.setLimit(9999999);
  answer.setSize(global.adp.getSizeInMemory(docs.data));
  answer.setData(docs.data);
  answer.setTime(new Date() - timer);
  res.end(answer.getAnswer());
};
// ============================================================================================= //
