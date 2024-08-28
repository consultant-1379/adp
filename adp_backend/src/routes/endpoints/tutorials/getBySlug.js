/**
* [ global.adp.endpoints.tutorials.getBySlug ]
* Returns the tutorials information (at the moment only Title) by slug.
* @param {String} Authorization as string on the header of the request.
* @return {object} 200 - Returns a full tutorial data
* @route GET /getBySlug
* @author Omkar Sadegaonkar [zsdgmkr]
 */
module.exports = (REQ, RES) => {
  const timer = new Date();
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const badRequest = () => {
    answer.setCode(400);
    answer.setMessage('400 Bad Request - Slug is NULL or UNDEFINED...');
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return false;
  };
  if (REQ.params === null || REQ.params === undefined) {
    return badRequest();
  }
  if (REQ.params.slug === null || REQ.params.slug === undefined) {
    return badRequest();
  }
  const slug = REQ.params.slug.trim();
  return adp.tutorials.getBySlug(slug)
    .then((resp) => {
      answer.setCode(resp.code);
      res.statusCode = resp.code;
      const msg = resp.code === '200' ? 'OK' : 'ERROR';
      answer.setMessage(msg);
      answer.setData(resp.title);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      return true;
    }).catch((error) => {
      answer.setCode(error.code);
      res.statusCode = error.code;
      answer.setMessage(`${error.message}`);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      return false;
    });
};
