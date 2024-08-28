/**
 * Fetches listoptions groups with denormalised related items.
 * @return {object} standard response object with array of
 * clean denormalised listoptions group items
 * @author Cein
 */
global.adp.docs.rest.push(__filename);
module.exports = ({ body: listoptsGroupIds }, RES) => {
  const timer = new Date();
  const res = global.adp.setHeaders(RES);
  const listOpsContr = new adp.listOptions.ListOptionsController();
  const answer = new global.adp.Answers();
  listOpsContr.groupItemsByGroupId(listoptsGroupIds)
    .then((resoDenormGrps) => {
      res.statusCode = 200;
      answer.setCode(200);
      answer.setTotal(resoDenormGrps.length);
      answer.setSize(global.adp.getSizeInMemory(resoDenormGrps));
      answer.setData(resoDenormGrps);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
    })
    .catch((err) => {
      res.statusCode = err.code || 500;
      answer.setCode(res.statusCode);
      answer.message(err.message || 'Failure to fetch denormalised listoptions data');
      res.end(answer.getAnswer());
    });
};
