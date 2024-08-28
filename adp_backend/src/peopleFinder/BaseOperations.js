const ModelRetry = require('../library/ModelRetry');

/**
 * [ adp.peoplefinder.BaseOperations ]
 * Peoplefinder controller, all People finder base operations.
 * @author Cein-Sven Da Costa [edaccei]
 */
adp.docs.list.push(__filename);
class BaseOperations {
  constructor() {
    this.package = 'adp.peoplefinder.BaseOperations';
    this.cacheBySignumUsers = [];
    this.cacheBySignumFunctionals = [];
    this.cacheByFunctionalUsers = [];
    this.cacheByFunctionalFunctionals = [];
    this.retryTime = 5000;
  }

  /**
   * Searches the PeopleFinder directory for people.
   * No functional users will be returned.
   * @param {string} signum the signum to search for
   * @returns {array} list of found people
   * @author Cein
   */
  searchPeopleBySignum(signum) {
    const userCache = this.cacheBySignumUsers;
    const funcCache = this.cacheBySignumFunctionals;
    if (userCache.length > 0) {
      let foundInCache = null;
      userCache.forEach((USER) => {
        if (USER.id === signum) {
          foundInCache = USER.cache;
        }
      });
      if (foundInCache !== null) {
        return new Promise(RESOLVE => RESOLVE(foundInCache));
      }
    }
    if (funcCache.length > 0) {
      let foundInCache = null;
      funcCache.forEach((FUSER) => {
        if (FUSER.id === signum) {
          foundInCache = FUSER.cache;
        }
      });
      if (foundInCache !== null) {
        return new Promise(RESOLVE => RESOLVE([]));
      }
    }
    return new Promise((resolve, reject) => {
      if (typeof signum === 'string' && signum.trim() !== '') {
        const pfModel = new adp.models.PeopleFinder();
        const modelRetry = new ModelRetry(
          (() => pfModel.peopleSearchBySignum(signum, true)),
          [500, 502, 503, 504],
          this.retryTime,
        );
        modelRetry.init().then((peopleResp) => {
          if (peopleResp.length === 0) {
            // cached as a functional user
            funcCache.push({ id: signum, cache: [] });
          } else {
            // cached as a user
            userCache.push({ id: signum, cache: peopleResp });
          }
          resolve(peopleResp);
        }).catch((pfSearchErr) => {
          adp.echoLog(
            pfSearchErr.message || 'Peoplefinder Model Failure',
            pfSearchErr.data || pfSearchErr,
            pfSearchErr.code || 500,
            this.package,
          );
          reject(pfSearchErr);
        });
      } else {
        const error = { message: 'The given signum is not of type string or is empty.', code: 400, data: { signum, origin: 'searchPeopleBySignum' } };
        adp.echoLog(error.message, error.data, error.code, this.package);
        reject(error);
      }
    });
  }

  /**
   * Searches the PeopleFinder directory for functional users.
   * No people will be returned.
   * @param {string} signum the signum to search for
   * @returns {array} list of functional users
   * @author Cein
   */
  searchFunctionalUserBySignum(signum) {
    const userCache = this.cacheByFunctionalUsers;
    const funcCache = this.cacheByFunctionalFunctionals;
    if (userCache.length > 0) {
      let foundInCache = null;
      userCache.forEach((USER) => {
        if (USER.id === signum) {
          foundInCache = USER.cache;
        }
      });
      if (foundInCache !== null) {
        return new Promise(RESOLVE => RESOLVE([]));
      }
    }
    if (funcCache.length > 0) {
      let foundInCache = null;
      funcCache.forEach((FUSER) => {
        if (FUSER.id === signum) {
          foundInCache = FUSER.cache;
        }
      });
      if (foundInCache !== null) {
        return new Promise(RESOLVE => RESOLVE(foundInCache));
      }
    }
    return new Promise((resolve, reject) => {
      if (typeof signum === 'string' && signum.trim() !== '') {
        const pfModel = new adp.models.PeopleFinder();
        const modelRetry = new ModelRetry(
          (() => pfModel.functionalUserSearchBySignum(signum, true)),
          [503],
          this.retryTime,
        );

        modelRetry.init().then((funcUserResp) => {
          if (funcUserResp.length === 0) {
            // cached as a user
            userCache.push({ id: signum, cache: [] });
          } else {
            // cached as a functional user
            funcCache.push({ id: signum, cache: funcUserResp });
          }
          resolve(funcUserResp);
        }).catch((funcUserError) => {
          adp.echoLog(funcUserError.message, funcUserError.data, funcUserError.code, this.package);
          reject(funcUserError);
        });
      } else {
        const error = { message: 'The given signum is not of type string or is empty.', code: 400, data: { signum, origin: 'searchFunctionalUserBySignum' } };
        adp.echoLog(error.message, error.data, error.code, this.package);
        reject(error);
      }
    });
  }

  /**
   * Searches the PeopleFinder directory for PDL details.
   * No PDL members are returned(see searchPDLMembersByNickname).
   * @param {string} mailNickname the mail nickname(aka email username) to find the PDL details of.
   * @returns {array} list of found PDL details
   * @author Cein
   */
  searchPDLByMailNickname(mailNickname) {
    return new Promise((resolve, reject) => {
      if (typeof mailNickname === 'string' && mailNickname.trim() !== '') {
        const pfModel = new adp.models.PeopleFinder();
        const modelRetry = new ModelRetry(
          (() => pfModel.pdlSearchByMailNickname(mailNickname)),
          [503],
          this.retryTime,
        );
        modelRetry.init().then((pdlResp) => {
          resolve(pdlResp);
        }).catch((pdlSearchError) => {
          adp.echoLog(
            pdlSearchError.message, pdlSearchError.data, pdlSearchError.code, this.package,
          );
          reject(pdlSearchError);
        });
      } else {
        const error = { message: 'The given mail nickname is not of type string or is empty.', code: 400, data: { mailNickname, origin: 'searchPDLByMailNickname' } };
        adp.echoLog(error.message, error.data, error.code, this.package);
        reject(error);
      }
    });
  }

  /**
   * Searches the PeopleFinder directory for a single PDL members and their corresponding details.
   * This is not recursive and will not retrieve members of PDLs within
   * the found PDL.(see recursivePDLMemberSearchByNicknames)
   * @param {string} mailNickname the mail nickname(aka email username) to find the PDL details of.
   * @param {number} page the pagination page number of the query
   * @returns {array} list of found PDL details
   * @author Cein
   */
  pdlMemberSearchByNickname(mailNickname, page = 1) {
    return new Promise((resolve, reject) => {
      if (typeof mailNickname === 'string' && mailNickname.trim() !== '') {
        const pfModel = new adp.models.PeopleFinder();
        const modelRetry = new ModelRetry(
          (() => pfModel.pdlMembersSearchByMailNickname(mailNickname, page)),
          [503],
          this.retryTime,
        );
        modelRetry.init().then((pdlResp) => {
          resolve(pdlResp);
        }).catch((pdlSearchError) => {
          adp.echoLog(
            pdlSearchError.message, pdlSearchError.data, pdlSearchError.code, this.package,
          );
          reject(pdlSearchError);
        });
      } else {
        const error = { message: 'The given mail nickname is not of type string or is empty.', code: 400, data: { mailNickname, page, origin: 'pdlMemberSearchByNickname' } };
        adp.echoLog(error.message, error.data, error.code, this.package);
        reject(error);
      }
    });
  }
}

module.exports = BaseOperations;
