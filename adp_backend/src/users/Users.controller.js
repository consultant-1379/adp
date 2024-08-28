const joi = require('joi');

/**
* [ adp.users.UserController ]
* Controller for all user processing
* @author Cein-Sven Da Costa [edaccei]
*/
adp.docs.list.push(__filename);

class UsersController {
  constructor() {
    this.packName = 'adp.users.UserController';
    this.allUserCacheKey = 'ALLUSERS';
  }


  /**
   * Fetches users by signum from the cache
   * @param {string} userSignums
   * @param {boolean} [showHiddenInfo=false] remove any private keys from the user object, current
   * private keys:
   * rbac
   * @returns {Promise<object[]>} obj.cachedUsers {object[]} list of object that contains
   * the cached user objects
   * obj.usersNotInCache {string[]} list of signums that were not found in the cache.
   */
  getUsersFromCache(userSignums, showHiddenInfo = false) {
    const promiseArr = [];
    userSignums.forEach((signum) => {
      promiseArr.push(global.adp.masterCache.get(this.allUserCacheKey, null, signum));
    });

    return adp.promiseAllSettled(promiseArr).then((userCachePromResult) => {
      const cachedUsers = userCachePromResult.reduce((cachedUser, promiseRespObj) => {
        let userObjArr = [];
        if (promiseRespObj.status === 'fulfilled') {
          const { value: promisAllVal } = promiseRespObj;
          if (
            promisAllVal.value && promisAllVal.value.docs && Array.isArray(promisAllVal.value.docs)
          ) {
            userObjArr = promisAllVal.value.docs;
          }
        }

        if (userObjArr.length) {
          const userObj = userObjArr[0];
          if (!showHiddenInfo && userObj.rbac) {
            delete userObj.rbac;
          }
          cachedUser.push(userObj);
        }
        return cachedUser;
      }, []);

      const usersNotInCache = userSignums.reduce((usersNotFound, signum) => {
        const matchUser = cachedUsers.find(userObj => userObj.signum === signum);
        if (!matchUser) {
          usersNotFound.push(signum);
        }
        return usersNotFound;
      }, []);

      return { cachedUsers, usersNotInCache };
    });
  }

  /**
   * Fetch users by signum DB only, bypass cache
   * @param {string[]} userSignums list of signums
   * @param {boolean} [showHiddenInfo=false] remove any private keys from the user object, current
   * private keys:
   * rbac
   * @returns {Promise<objects[]>} list of matched user objects
   * @author Cein
   */
  dbGetBySignum(userSignums, showHiddenInfo = false) {
    return new Promise((res, rej) => {
      const adpModel = new adp.models.Adp();

      adpModel.getUsersById(userSignums, showHiddenInfo).then((respUser) => {
        if (Array.isArray(respUser.docs)) {
          res(respUser.docs);
        } else {
          const err = {
            message: 'Database response for users fetch incorrect structure, must be an array.',
            code: 500,
            data: {
              origin: 'getBySignum',
              userSignums,
              respUser,
            },
          };
          adp.echoLog(err.message, err.data, err.code, this.packName);
          rej(err);
        }
      }).catch((errUser) => {
        const err = {
          message: 'Model failure to fetch users by signum',
          code: 500,
          data: {
            error: errUser,
            origin: 'getBySignum',
            userSignums,
          },
        };
        adp.echoLog(err.message, err.data, err.code, this.packName);
        rej(err);
      });
    });
  }

  /**
   * Update allusers cache with one or more user object
   * @param {object[]} userObjArr list of user objects to set to allusers cache
   * @returns {Promise<boolean[]>} array of cache set responses
   * @author Cein
   */
  async addUsersToAllUsersCache(userObjArr) {
    const cacheTimeoutMs = global.adp.masterCacheTimeOut.allusers * 1000;
    const schema = joi.array().items(
      joi.object({
        _id: joi.string().label('User Id').required(),
        signum: joi.string().label('User Signum').required(),
      }).label('User object list').unknown(true).required(),
    ).label('User object Array');

    const { error: validErr } = schema.validate(userObjArr);
    if (typeof validErr !== 'undefined') {
      const error = { message: validErr.message, code: 500, data: { error: validErr, userObjArr, origin: 'addUsersToAllUsersCache' } };
      adp.echoLog(validErr.message, error.data, error.code, this.packName);
      return Promise.reject(error);
    }

    const promiseArr = userObjArr.map(
      (userObj) => {
        const correctObj = { value: { docs: [userObj] } };
        return global.adp.masterCache.set(
          this.allUserCacheKey, null, userObj._id, correctObj, cacheTimeoutMs,
        );
      },
    );

    return Promise.all(promiseArr).then(respCache => respCache).catch((ErrUserCache) => {
      const error = { message: `Failure to set a user to ${this.allUserCacheKey} cache.`, code: 500, data: { error: ErrUserCache, userObjArr, origin: 'addUsersToAllUsersCache' } };
      adp.echoLog(error.message, error.data, error.code, this.packName);
      return Promise.reject(error);
    });
  }

  /**
   * Get User/s by signum
   * @param {string[]} userSignums array of signums
   * @param {boolean} [showHiddenInfo=false] remove any private keys from the user object, current
   * private keys:
   * rbac
   * @returns {Promise<Object[]>} list of match users
   * @author Cein
   */
  async getBySignum(userSignums, showHiddenInfo = false) {
    const signumLookup = {};
    const uniqueSignums = userSignums.filter((signum) => {
      const signumToMatch = signum.toLowerCase();
      if (signum.trim() === '' || signumLookup[signumToMatch]) {
        return false;
      }
      signumLookup[signumToMatch] = true;
      return true;
    });
    const { cachedUsers: users, usersNotInCache } = await this.getUsersFromCache(uniqueSignums);

    if (usersNotInCache.length) {
      try {
        const dbUserArr = await this.dbGetBySignum(usersNotInCache, true);
        if (!Array.isArray(dbUserArr) || dbUserArr.length === 0) {
          return users;
        }

        await this.addUsersToAllUsersCache(dbUserArr);

        if (!showHiddenInfo) {
          const privateUserArr = dbUserArr.map((userObj) => {
            const updateUser = { ...userObj };
            delete updateUser.rbac;
            return updateUser;
          });
          users.push(...privateUserArr);
        } else {
          users.push(...dbUserArr);
        }
      } catch (errDbUsers) {
        return Promise.reject(errDbUsers);
      }
    }
    return users;
  }
}

module.exports = UsersController;
