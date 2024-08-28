// ============================================================================================= //
/**
* [ global.adp.answerClass ]
* Class to be used as <b>Template</b> of the Answers to <b>FrontEnd</b>.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
class answerClass {
  // ------------------------------------------------------------------------------------------ //
  constructor() {
    this.templateJSON = {
      code: 200,
      page: 0,
      limit: 50,
      total: 0,
      time: 0,
      size: 0,
      cache: '',
      message: '',
      warning: '',
      data: [],
    };
  }

  // ------------------------------------------------------------------------------------------ //

  setCode(N) {
    this.templateJSON.code = N;
  }

  getCode() {
    return this.templateJSON.code;
  }

  // ------------------------------------------------------------------------------------------ //

  setQueueLink(N) {
    this.templateJSON.queueStatus = N;
  }

  getQueueLink() {
    return this.templateJSON.queueStatus;
  }

  // ------------------------------------------------------------------------------------------ //

  setPage(N) {
    this.templateJSON.page = N;
  }

  // ------------------------------------------------------------------------------------------ //

  setLimit(N) {
    this.templateJSON.limit = N;
  }

  // ------------------------------------------------------------------------------------------ //

  setTotal(N) {
    this.templateJSON.total = N;
  }

  // ------------------------------------------------------------------------------------------ //

  setTime(N) {
    this.templateJSON.time = N;
  }

  // ------------------------------------------------------------------------------------------ //

  setSize(N) {
    this.templateJSON.size = N;
  }

  // ------------------------------------------------------------------------------------------ //

  setCache(S) {
    this.templateJSON.cache = S;
  }

  // ------------------------------------------------------------------------------------------ //

  setMessage(S) {
    this.templateJSON.message = S;
  }

  // ------------------------------------------------------------------------------------------ //

  setWarning(A) {
    this.templateJSON.warning = A;
  }

  getWarning() {
    return this.templateJSON.warning;
  }

  // ------------------------------------------------------------------------------------------ //

  setData(O) {
    this.templateJSON.data = O;
  }

  getData() {
    return this.templateJSON.data;
  }

  // ------------------------------------------------------------------------------------------ //

  getAnswer() {
    if (!Array.isArray(this.templateJSON.warning)) {
      delete this.templateJSON.warning;
    } else if (this.templateJSON.warning.length === 0) {
      delete this.templateJSON.warning;
    }
    return JSON.stringify(this.templateJSON);
  }
  // ------------------------------------------------------------------------------------------ //
}
// ============================================================================================= //
module.exports = answerClass;
// ============================================================================================= //
