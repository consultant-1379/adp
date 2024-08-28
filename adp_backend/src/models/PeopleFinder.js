/**
 * [ adp.models.PeopleFinder ]
 * All Azure queries are managed here
 * @author Cein-Sven Da Costa [edaccei]
 */
adp.docs.list.push(__filename);
class PeopleFinder {
  constructor() {
    this.package = 'adp.models.PeopleFinder';
    this.basehttpOptions = {
      url: adp.config.peopleFinderApiUrl,
      headers: {
        Authorization: 'Bearer ',
        'Content-Type': 'application/json',
        funUserId: 'eadpusers',
      },
    };
  }

  /**
   * PeopleFinder people search by signum
   * @param {string} signum the signum of the person
   * @param {boolean} [removeFunctionalUsers=false] if true removes functional
   * users from the search
   * @returns {promise} {array} list of found users
   * @author Cein
   */
  peopleSearchBySignum(signum, removeFunctionalUsers = false) {
    return new Promise((resolve, reject) => {
      const timer = new Date();
      adp.models.azure.token().then((azureToken) => {
        const options = { ...this.basehttpOptions };
        options.url += `people/search/${signum}`;
        options.headers.Authorization += azureToken;
        options.method = 'GET';

        global.request(options, (reqError, resp, body) => {
          if (reqError) {
            options.headers.Authorization = 'Hidden Token';
            const error = {
              message: 'Peoplefinder response contains an error',
              code: reqError.code || 500,
              data: {
                error: reqError, signum, removeFunctionalUsers, options, origin: 'peopleSearchBySignum',
              },
            };
            reject(error);
          } else if (resp.statusCode === 200 && typeof body === 'string') {
            let result = JSON.parse(body);
            if (removeFunctionalUsers && result) {
              result = result.filter(peopleObj => (peopleObj.signType !== 'A'));
            }
            adp.echoLog(`peopleSearchBySignum [${signum}] complete in ${(new Date() - timer)}ms`, null, 200, this.package);
            resolve(result);
          } else {
            options.headers.Authorization = 'Hidden Token';
            const error = { message: 'Peoplefinder failure to retrieve response.', code: resp.statusCode };
            error.data = {
              error: body, signum, removeFunctionalUsers, options, origin: 'peopleSearchBySignum',
            };
            reject(error);
          }
        });
      }).catch((errorFetchingToken) => {
        const error = { message: 'Azure token fetch failure', code: 500 };
        error.data = {
          error: errorFetchingToken, signum, removeFunctionalUsers, origin: 'peopleSearchBySignum',
        };
        reject(error);
      });
    });
  }

  /**
   * PeopleFinder functional user search by signum
   * @param {string} signum the signum of the person
   * @param {boolean} [removeNonFunctionalUsers=false] if true removes all non-functional
   * users from the search
   * @returns {promise} {array} list of found functional users
   * @author Cein
   */
  functionalUserSearchBySignum(signum, removeNonFunctionalUsers = false) {
    return new Promise((resolve, reject) => {
      const timer = new Date();
      adp.models.azure.token().then((azureToken) => {
        const options = { ...this.basehttpOptions };
        options.url += `functionalUser/${signum}`;
        options.headers.Authorization += azureToken;
        options.method = 'GET';

        global.request(options, (reqError, resp, body) => {
          if (reqError) {
            options.headers.Authorization = 'Hidden Token';
            const error = {
              message: 'Peoplefinder response contains an error',
              code: reqError.code || 500,
              data: {
                error: reqError, signum, removeNonFunctionalUsers, options, origin: 'functionalUserSearchBySignum',
              },
            };
            reject(error);
          } else if (resp.statusCode === 200 && typeof body === 'string') {
            let result = JSON.parse(body);
            if (removeNonFunctionalUsers && result && result.length) {
              result = result.filter(peopleObj => (peopleObj.signType === 'A'));
            }
            adp.echoLog(`functionalUserSearchBySignum [${signum}] complete in ${(new Date() - timer)}ms`, null, 200, this.package);
            resolve(result);
          } else {
            options.headers.Authorization = 'Hidden Token';
            const error = { message: 'Peoplefinder responds is of incorrect form.', code: resp.statusCode };
            error.data = {
              error: body, signum, removeNonFunctionalUsers, options, origin: 'functionalUserSearchBySignum',
            };
            reject(error);
          }
        });
      }).catch((errorFetchingToken) => {
        const error = { message: 'Azure toke fetch failure', code: 500 };
        error.data = {
          error: errorFetchingToken, signum, removeNonFunctionalUsers, origin: 'functionalUserSearchBySignum',
        };
        reject(error);
      });
    });
  }


  /**
   * Searches for PDL details by mail nickname
   * Does not return PDL members
   * @param {string} mailNickname the PDL nickname
   * e.g pdladpanch from pdladpanch@ericsson.com, not case sensitive
   * @returns {promise} {object} which contains details about found PDL's and the list of found PDLs
   * @author Cein
   */
  pdlSearchByMailNickname(mailNickname) {
    return new Promise((resolve, reject) => {
      const timer = new Date();
      adp.models.azure.token().then((azureToken) => {
        const options = { ...this.basehttpOptions };
        options.url += 'outlookDistribution/searchpdl/search';
        options.headers.Authorization += azureToken;
        options.method = 'POST';
        options.json = { displayName: mailNickname };

        global.request(options, (reqError, resp, body) => {
          if (reqError) {
            options.headers.Authorization = 'Hidden Token';
            const error = {
              message: 'Peoplefinder PDL search failure',
              code: reqError.code || 500,
              data: {
                error: reqError, mailNickname, options, origin: 'pdlSearchByMailNickname',
              },
            };
            reject(error);
          } else if (resp.statusCode === 200) {
            adp.echoLog(`pdlSearchByMailNickname [${mailNickname}] complete in ${(new Date() - timer)}ms`, null, 200, this.package);
            resolve(body);
          } else {
            options.headers.Authorization = 'Hidden Token';
            const error = { message: 'Peoplefinder responds is of incorrect form.', code: resp.statusCode };
            error.data = {
              error: body, mailNickname, options, origin: 'pdlSearchByMailNickname',
            };
            reject(error);
          }
        });
      }).catch((errorFetchingToken) => {
        const error = { message: 'Azure toke fetch failure', code: 500, data: { error: errorFetchingToken, mailNickname, origin: 'pdlSearchByMailNickname' } };
        reject(error);
      });
    });
  }

  /**
   * Searches for PDL members by mail nickname
   * @param {string} mailNickname the PDL nickname
   * @param {number} page the pagination page number of the query
   * e.g pdladpanch from pdladpanch@ericsson.com, not case sensitive
   * @returns {promise} {object} which contains details about found PDL members and
   * the list of the found PDL members
   * @author Cein
   */
  pdlMembersSearchByMailNickname(mailNickname, page = 1) {
    return new Promise((resolve, reject) => {
      const timer = new Date();
      const pageNum = (typeof page === 'number' && page ? page : 1);

      adp.models.azure.token().then((azureToken) => {
        const options = { ...this.basehttpOptions };
        options.url += `outlookDistribution/searchpdl/members?page=${pageNum}`;
        options.headers.Authorization += azureToken;
        options.method = 'POST';
        options.json = { displayName: mailNickname, authMembers: false };

        global.request(options, (reqError, resp, body) => {
          if (reqError) {
            options.headers.Authorization = 'Hidden Token';
            const error = {
              message: 'Peoplefinder response contains an error',
              code: reqError.code || 500,
              data: {
                error: reqError, mailNickname, page, options, origin: 'pdlMembersSearchByMailNickname',
              },
            };
            reject(error);
          } else if (resp.statusCode === 200) {
            adp.echoLog(`pdlMembersSearchByMailNickname [${mailNickname}] complete in ${(new Date() - timer)}ms`, null, 200, this.package);
            resolve(body);
          } else {
            options.headers.Authorization = 'Hidden Token';
            const error = { message: 'Peoplefinder response is not in the correct form.', code: resp.statusCode };
            error.data = {
              error: body, mailNickname, page, options, origin: 'pdlMembersSearchByMailNickname',
            };
            reject(error);
          }
        });
      }).catch((errorFetchingToken) => {
        const error = { message: 'Azure toke fetch failure', code: 500 };
        error.data = {
          error: errorFetchingToken, mailNickname, page, origin: 'pdlMembersSearchByMailNickname',
        };
        reject(error);
      });
    });
  }
}

module.exports = PeopleFinder;
