/**
* [ adp.rbac.authenticator ]
* Function used for authentication user who is trying to
* perform RBAC operations
* @author Omkar Sadegaonkar [zsdgmkr]
*/
module.exports = (REQ, RES, NEXT) => {
  const packName = 'adp.rbac.authenticator';
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  return adp.permission.getUserFromRequestObject(REQ)
    .then((USER) => {
      const { role, signum } = USER;
      if (role !== 'admin') {
        answer.setCode(403);
        answer.setMessage('Unauthorized');
        res.statusCode = 403;
        res.end(answer.getAnswer());
        const errorText = 'User is not authorized to proceed';
        const errorOBJ = { message: 'Unauthorized', signum, role };
        adp.echoLog(errorText, errorOBJ, 403, packName, true);
        return false;
      }
      // eslint-disable-next-line no-param-reassign
      REQ.user = USER;
      NEXT();
      return true;
    })
    .catch((ERROR) => {
      answer.setCode(500);
      answer.setMessage('Unauthorized');
      res.statusCode = 500;
      res.end(answer.getAnswer());
      const errorText = 'Error in [ adp.permission.getUserFromRequestObject ]';
      const errorOBJ = { ERROR };
      adp.echoLog(errorText, errorOBJ, 500, packName, false);
      return false;
    });
};
