/**
 * [ adp.peoplefinder.RecursivePDLMembers ]
 * Peoplefinder recursive PDL members look up.
 * Fetches all Person objects from all nested Group objects inside of list of PDLS
 * @param {array} mailList list of emails to validate
 * @param {boolean} [includePortalUserData=false] if true the returning members will include
 * @param {number} [recursiveLimit=20] the max depth to fetch nested PDL members.
 * the Portal user object for that member
 * @author Cein-Sven Da Costa [edaccei]
 */
adp.docs.list.push(__filename);
/* eslint-disable no-await-in-loop */
class RecursivePDLMembers extends adp.peoplefinder.BaseOperations {
  constructor(mailList, includePortalUserData = false, recursiveLimit = 20) {
    super();
    this.package = 'adp.peoplefinder.RecursivePDLMembers';
    this.mailList = mailList;
    this.includePortalUserData = (typeof includePortalUserData === 'boolean' ? includePortalUserData : false);
    this.recursiveLimit = (typeof recursiveLimit === 'number' && recursiveLimit) ? recursiveLimit : 20;
    this.tracker = {};
    this.recursiveErrors = [];
    this.recursiveWarning = [];
    this.pplMembers = [];
  }

  /**
   * Validates the given mail lists
   * @returns {object} obj.validMailers {Array} list of valid mailers with mail Nicknames.
   * obj.invalidMailers {Array} list of invalid mailers with corresponding error.
   * obj.error any error results
   * @author Cein
   */
  validateMailList() {
    const result = { validNicknames: [], invalidMailers: [], error: { message: '', code: 200 } };

    if (Array.isArray(this.mailList) && this.mailList.length) {
      this.mailList.forEach((mailer) => {
        if (typeof mailer === 'string' && mailer.trim() !== '') {
          const formattedMailer = mailer.toLowerCase().trim();
          const ericssonEmailRegex = /^(?=.+@)(?=.*\bericsson\b).*$/;

          if (ericssonEmailRegex.test(formattedMailer)) {
            const splitMail = formattedMailer.split('@');
            result.validNicknames.push(splitMail[0]);
          } else if (!formattedMailer.includes('@')) {
            result.validNicknames.push(formattedMailer);
          } else {
            result.invalidMailers.push({ data: mailer, message: 'Only Ericsson PDLs are supported.', code: 400 });
          }
        } else {
          result.invalidMailers.push({ data: mailer, message: 'Mailer is not of type string or is empty.', code: 400 });
        }
      });
    } else {
      result.error.message = 'Mail list is not of the correct form or empty.';
      result.error.code = 400;
    }
    return result;
  }

  /**
   * Searches the PeopleFinder directory for members and their corresponding details.
   * This is recursive and will retrieve members of PDLs within the found PDL.
   * @param {string} mailNickname the mail nickname(aka email username) to find the PDL details of.
   * @returns {object} obj.members {array} list of members of the pdl that are people
   * obj.errors {array} list of errors encountered during recursion
   * @author Cein
   */
  searchByMailers() {
    return new Promise(async (resolve, reject) => {
      const validObj = this.validateMailList();

      if (validObj.error.code === 200) {
        const recLimit = this.recursiveLimit;
        let recursiveLvl = 0;
        let pdlGroupList = validObj.validNicknames;
        this.tracker = {};
        this.recursiveErrors = validObj.invalidMailers;
        this.recursiveWarning = [];
        this.pplMembers = [];

        while (pdlGroupList.length > 0 && recursiveLvl < recLimit) {
          pdlGroupList = await this._pdlGroupsLookup(pdlGroupList);
          recursiveLvl += 1;
        }

        resolve({
          membersTotal: this.pplMembers.length,
          members: this.pplMembers,
          errors: this.recursiveErrors,
          warnings: this.recursiveWarning,
        });
      } else {
        adp.echoLog('Peoplefinder searchByMailers errors', validObj.error.message, validObj.error.code, this.package);
        reject(validObj.error);
      }
    });
  }

  /**
   * Iterates through each group(mail nickname)
   * @param {array} pdlGroupList list of mail nicknames
   * @returns {array} list of next nickName(Groups) to iterate through
   * @author Cein
   */
  async _pdlGroupsLookup(pdlGroupList) {
    const nestedGroupsFound = [];

    for (let grpIndex = 0; grpIndex < pdlGroupList.length; grpIndex += 1) {
      const mailNickName = pdlGroupList[grpIndex];

      if (typeof mailNickName === 'string' && mailNickName.trim()) {
        const trackerKey = mailNickName.toLowerCase();
        if (!this.tracker[trackerKey]) {
          const foundGroups = await this._pdlGroupLookup(mailNickName);
          nestedGroupsFound.push(...foundGroups);
        }
      } else {
        const error = { message: 'PDL nickname is not type string or is empty', data: mailNickName, code: 400 };
        this.recursiveErrors.push(error);
      }
    }
    return nestedGroupsFound;
  }


  /**
   * Checks if the group PDL exists to the PeopleFinder directories
   * @param {array} mailNickName list of mail nicknames
   * @returns {array} list of next nickName(Group) to iterate through
   * @author Cein
   */
  _pdlGroupLookup(mailNickName) {
    return super.searchPDLByMailNickname(mailNickName).then((pdlCheckResult) => {
      if (pdlCheckResult && pdlCheckResult.elements) {
        if (pdlCheckResult.elements.length) {
          return this._pdlMembersPagesLookup(mailNickName);
        }
        const error = { message: 'Given PDL is not listed in the PeopleFinder PDL directories.', data: { pdlCheckResult, mailNickName }, code: 400 };
        this.recursiveErrors.push(error);
        return [];
      }
      const error = { message: 'Peoplefinder not responding as expected.', data: { pdlCheckResult, mailNickName }, code: 500 };
      this.recursiveErrors.push(error);
      return [];
    }).catch((errorCheckPDL) => {
      const error = errorCheckPDL;
      error.data = mailNickName;
      this.recursiveErrors.push(error);
      return [];
    }).finally(() => {
      this.tracker[mailNickName] = true;
    });
  }

  /**
   * Checks if the given PDL exists to the PeopleFinder Directories
   * @param {string} nickName the nickName to retrieve the PDL members of
   * @returns {array} list of next nickName(Groups) to iterate through
   * @author Cein
   */
  async _pdlMembersPagesLookup(nickName) {
    const foundGroups = [];
    let hasNextPage = false;
    let pagesfoundGroupPerson = false;
    let pageCount = 0;

    do {
      const {
        hasNext, groups, pagefoundGrpPer,
      } = await this._pdlMemberPageLookup(nickName, pageCount + 1);

      hasNextPage = hasNext;
      foundGroups.push(...groups);

      if (!pagesfoundGroupPerson && pagefoundGrpPer) {
        pagesfoundGroupPerson = true;
      }

      pageCount += 1;
    } while (hasNextPage && pageCount < this.recursiveLimit);

    if (!pagesfoundGroupPerson) {
      const warning = { message: 'Given PDL, Peoplefinder returns data that does not contain a Person or a Group(PDL).', data: nickName, code: 200 };
      this.recursiveWarning.push(warning);
    }

    return foundGroups;
  }

  /**
   * Fetches pdlmembers of a single page
   * @param {string} nickName the nickName to retrieve the PDL members of
   * @param {number} [page=1] the pagination page to fetch from
   * @returns {object} obj.hasNext {boolean} if there is another page
   * obj.groups {array} list of nested pdls found
   * obj.pagefoundGrpPer {boolean} if any categoryObjects contain either Group or Person
   * @author Cein
   */
  async _pdlMemberPageLookup(nickName, page = 1) {
    return super.pdlMemberSearchByNickname(nickName, page)
      .then(async (pdlMembResp) => {
        const returnObj = { hasNext: false, groups: [], pagefoundGrpPer: false };

        if (pdlMembResp.totalNoOfResults) {
          returnObj.hasNext = (pdlMembResp.hasNext ? pdlMembResp.hasNext : false);

          for (let memberIndex = 0; memberIndex < pdlMembResp.elements.length; memberIndex += 1) {
            const memberObj = pdlMembResp.elements[memberIndex];
            const category = memberObj.objectCategory;

            if (category && category.includes('CN=Group') && memberObj.mailNickname) {
              returnObj.groups.push(memberObj.mailNickname);
              returnObj.pagefoundGrpPer = true;
            } else if (category && category.includes('CN=Person') && memberObj.mailNickname) {
              const trackerKey = memberObj.mailNickname.toLowerCase();
              returnObj.pagefoundGrpPer = true;
              if (!this.tracker[trackerKey]) {
                const resultMemberObj = { peopleFinder: memberObj };
                if (this.includePortalUserData) {
                  resultMemberObj.portal = await this._portalUserObjFetch(trackerKey);
                }

                this.pplMembers.push(resultMemberObj);
                this.tracker[trackerKey] = true;
              }
            }
          }
        } else {
          const warning = { message: 'Given PDL, Peoplefinder returns an empty result.', data: nickName, code: 200 };
          this.recursiveWarning.push(warning);
        }
        return returnObj;
      }).catch((errorMemberSearch) => {
        const error = errorMemberSearch;
        error.data = nickName;
        this.recursiveErrors.push(error);
        return { hasNext: false, groups: [], singlefoundGrpPer: false };
      });
  }

  /**
   * Retrieves the adp portal user object to the given signum
   * @param {string} signum the signum used to retrieve the adp portal user object
   * @returns {object} on success the related adp portal user object, on failure a empty object
   * @author Cein
   */
  _portalUserObjFetch(signum) {
    return adp.user.thisUserShouldBeInDatabase(signum).then((portalUserResp) => {
      if (portalUserResp.docs && portalUserResp.docs.length) {
        return portalUserResp.docs[0];
      }
      const error = { message: 'ADP user not returned from the cache or database.', code: 500, data: { signum } };
      adp.echoLog(error.message, null, error.code, this.package);
      return {};
    }).catch((errorFetchingUser) => {
      const error = {
        message: errorFetchingUser.message || `thisUserShouldBeInDatabase error for signum [${signum}]`,
        code: (errorFetchingUser.code || 500),
        data: { signum, origin: '_portalUserObjFetch' },
      };
      adp.echoLog(error.message, error.data, error.code, this.package);
      return {};
    });
  }
}

module.exports = RecursivePDLMembers;
