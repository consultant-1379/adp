/**
* [ adp.models.Adp ]
* adp Database Model
* @author Cein-Sven Da Costa [edaccei]
*/
adp.docs.list.push(__filename);

class Adp {
  constructor(MODE = null) {
    this.dbMongoCollection = 'adp';
    if (MODE === null) {
      this.type = ['assembly', 'microservice'];
    } else if (Array.isArray(MODE)) {
      this.type = MODE;
    }
  }

  /**
  * Fetch a object by _id
  * @param {string} id A simple string with an unique id
  * @returns {promise} response of the request
  * @author Vinod [zvinrac]
  */
  getLatestVersionByMSId(id) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        _id: { $eq: id }, deleted: { $exists: false },
      };
      const mongoOptions = { limit: 1, skip: 0 };
      const mongoProjection = {
        _id: 0, menu_auto: 1, menu: 1,
      };
      adp.db.find(
        this.dbMongoCollection, mongoQuery, mongoOptions, mongoProjection,
      )
        .then((RESULT) => {
          if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length === 1) {
            const msResult = RESULT && Array.isArray(RESULT.docs) && RESULT.docs[0]
              ? RESULT.docs[0] : null;
            let latestVersion;
            if (msResult.menu_auto) {
              if (msResult && msResult.menu && msResult.menu.auto
                && msResult.menu.auto.release.length > 0) {
                latestVersion = msResult.menu.auto.release[0].version;
              }
            } else {
              /* eslint-disable no-lonely-if */
              if (msResult && msResult.menu && msResult.menu.manual
                && msResult.menu.manual.release.length > 0) {
                latestVersion = msResult.menu.manual.release[0].version;
              }
            }
            RESOLVE(latestVersion);
            return;
          }
          const errorObject = {
            code: 500,
            message: 'Unexpected result from database',
            result: RESULT,
          };
          REJECT(errorObject);
        })
        .catch(ERROR => REJECT(ERROR));
    });
  }

  /**
   * Update emails in teamMails from Microservices
   * @param {string} PREVIOUSEMAIL The old email
   * @param {string} PREVIOUSEMAIL The new email
   * @returns {promise} response of the action
   * @author Armando Dias [zdiaarm]
   */
  updateTeamMails(PREVIOUSEMAIL, NEWEMAIL) {
    const filter = {
      type: {
        $in: this.type,
      },
      teamMails: PREVIOUSEMAIL,
    };
    const toUpdate = {
      $set: { 'teamMails.$': NEWEMAIL },
    };
    return adp.db.updateMany(this.dbMongoCollection, filter, toUpdate);
  }


  /**
   * Fetch a adp object by _id
   * @param {array} idArr array of id strings or simple string with an unique id
   * @returns {promise} response of the request
   * @author Cein-Sven Da Costa [edaccei], Armando Dias [zdiaarm]
   */
  getById(idArr) {
    let toSearch = idArr;
    if (!Array.isArray(idArr)) {
      toSearch = [idArr];
    }
    const mongoQuery = {
      _id: {
        $in: toSearch,
      },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * Fetch a unique object by _id
   * @param {string} id A simple string with an unique id
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getOneById(id) {
    const mongoQuery = {
      _id: { $eq: id },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * getJustTheMimerVersionStarterFromAsset
   * Retrieve only the mimer_version_starter from Asset
   * @param {string} id A simple string with an unique id
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getJustTheMimerVersionStarterFromAsset(id) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        _id: { $eq: id },
        deleted: { $exists: false },
      };
      const mongoOptions = { limit: 1, skip: 0 };
      const mongoProjection = { _id: 0, mimer_version_starter: 1 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length === 1) {
            RESOLVE(`${RESULT.docs[0].mimer_version_starter}`);
            return;
          }
          const errorObject = {
            code: 500,
            message: 'Unexpected result from database',
            result: RESULT,
          };
          REJECT(errorObject);
        })
        .catch(ERROR => REJECT(ERROR));
    });
  }


  /**
   * getAssetSlugUsingID
   * Retrieve only the slug from Asset
   * @param {string} id A simple string with an unique id
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getAssetSlugUsingID(id, force = false) {
    const cacheRootObject = 'ASSETSSLUG';
    return new Promise((RESOLVE, REJECT) => {
      if (force === false) {
        adp.masterCache.get(cacheRootObject, null, id)
          .then(ASSET => RESOLVE(ASSET))
          .catch(() => {
            // Not an error...
            // Data will retrieved from
            // database and cached.
          });
      }
      const mongoQuery = {
        _id: { $eq: id },
        deleted: { $exists: false },
      };
      const mongoOptions = { limit: 1, skip: 0 };
      const mongoProjection = { _id: 0, slug: 1 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length === 1) {
            const theSlug = `${RESULT.docs[0].slug}`;
            adp.masterCache.set(
              cacheRootObject,
              null,
              id,
              theSlug,
              adp.masterCacheTimeOut.allAssets,
            );
            RESOLVE(theSlug);
            return;
          }
          const errorObject = {
            code: 500,
            message: 'Unexpected result from database',
            result: RESULT,
          };
          REJECT(errorObject);
        })
        .catch(ERROR => REJECT(ERROR));
    });
  }


  /**
   * getAssetSlugAndNameUsingID
   * Retrieve the slug and name from Asset
   * @param {string} id A simple string with an unique id
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getAssetSlugAndNameUsingID(id, force = false) {
    const cacheRootObject = 'ASSETSSLUGANDNAME';
    return new Promise((RESOLVE, REJECT) => {
      if (force === false) {
        adp.masterCache.get(cacheRootObject, null, id)
          .then(ASSET => RESOLVE(ASSET))
          .catch(() => {
            // Not an error...
            // Data will retrieved from
            // database and cached.
          });
      }
      const mongoQuery = {
        _id: { $eq: id },
        deleted: { $exists: false },
      };
      const mongoOptions = { limit: 1, skip: 0 };
      const mongoProjection = { _id: 0, slug: 1, name: 1 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length === 1) {
            const theSlug = `${RESULT.docs[0].slug}`;
            const theName = `${RESULT.docs[0].name}`;
            adp.masterCache.set(
              cacheRootObject,
              null,
              id,
              { slug: theSlug, name: theName },
              adp.masterCacheTimeOut.allAssets,
            );
            RESOLVE({ slug: theSlug, name: theName });
            return;
          }
          const errorObject = {
            code: 500,
            message: 'Unexpected result from database',
            result: RESULT,
          };
          REJECT(errorObject);
        })
        .catch(ERROR => REJECT(ERROR));
    });
  }


  /**
   * getARMMenu
   * Retrieve only the arm menu from Asset
   * @param {string} id A simple string with an unique id
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getARMMenu(id) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        _id: { $eq: id },
        deleted: { $exists: false },
      };
      const mongoOptions = { limit: 1, skip: 0 };
      const mongoProjection = {
        _id: 0,
        menu_auto: 1,
        menu: 1,
        repo_urls: 1,
      };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length === 1) {
            RESOLVE(RESULT.docs[0]);
            return;
          }
          const errorObject = {
            code: 500,
            message: 'Unexpected result from database',
            result: RESULT,
          };
          REJECT(errorObject);
        })
        .catch(ERROR => REJECT(ERROR));
    });
  }


  /**
   * Get all Admin Dev Team Members
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getAllAdminDevTeam() {
    const mongoQuery = {
      $and: [
        { role: { $eq: 'admin' } },
        { devteam: { $exists: true, $ne: null } },
        { deleted: { $exists: false } },
      ],
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * Get all with valid mimer_version_starter
   * @returns {promise} response of the request
   * @author Tirth [zpiptir]
   */
  getAllWithMimerVersionStarter() {
    const mongoQuery = {
      mimer_version_starter: { $nin: [null, ''] },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * Get all Admin which are not Dev Team Members
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getAllAdminNotDevTeam() {
    const mongoQuery = {
      $and: [
        { role: { $eq: 'admin' } },
        { devteam: { $exists: false } },
        { deleted: { $exists: false } },
      ],
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get all Admins ( ignores Dev Team Status )
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getAllAdmin() {
    const mongoQuery = {
      $and: [
        { role: { $eq: 'admin' } },
        { deleted: { $exists: false } },
      ],
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get all Assets which belongs to a specific Domain
   * @param {string} DOMAIN String with Domain ID
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getAllAssetsByDomain(DOMAIN) {
    const mongoQuery = {
      domain: { $eq: DOMAIN },
      type: { $in: this.type },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get name and ID of all the Microservices
   * @returns {promise} response of the request
   * @author Tirth [zpiptir]
   */
  getAllMSNaemandID() {
    const mongoQuery = {
      type: { $in: this.type },
      deleted: { $exists: false },
    };
    const mongoProjection = {
      _id: 1,
      name: 1,
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    );
  }


  /**
   * Get all Assets IDs and the Domains
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getAllAssetsIDsByDomain() {
    const mongoQuery = {
      type: { $in: this.type },
      deleted: { $exists: false },
    };
    const mongoProjection = { slug: 1, domain: 1 };
    const mongoOptions = { limit: 999999, skip: 0, sort: { domain: 1 } };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    );
  }


  /**
   * Get all Assets IDs by Service Onwer
   * @param {string} SIGNUM String with the Service Owner
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getAllAssetsIDsByServiceOwner(SIGNUM) {
    let signum = SIGNUM;
    if (!Array.isArray(SIGNUM)) {
      signum = [SIGNUM];
    }
    const mongoQuery = {
      $and: [
        { 'team.signum': { $in: signum } },
        { 'team.serviceOwner': true },
        { type: { $in: this.type } },
        { deleted: { $exists: false } },
      ],
    };
    const mongoProjection = { _id: 1, team: 1 };
    const mongoOptions = { limit: 999999, skip: 0, sort: { 'team.signum': 1 } };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    );
  }


  /**
   * Temporary access for Marketplace Search
   * @param {object} QUERY Object built by Search System
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  assetSearchByQuery(QUERY) {
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      QUERY,
      mongoOptions,
    );
  }

  /**
   * Check if Permission Groups are not real ( If the ID is invalid )
   * @param {Array} REALIDS List of real IDs ( Array of adp.MongoObjectID )
   * @returns {promise} response of the request containing all the users
   * which belongs to a nonexistent permission groups.
   * @author Armando Dias [zdiaarm]
   */
  checkIfPermissionGroupsAreNotReal(REALIDS) {
    const mongoQuery = {
      $and: [
        { 'rbac._id': { $nin: REALIDS } },
        { type: 'user' },
      ],
    };
    const mongoProjection = {};
    const mongoOptions = { limit: 999999, skip: 0, sort: { signum: 1 } };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    );
  }


  /**
   * Get the name ( to check if this already exists ) if this
   * not belongs to the optional ID
   * @param {string} NAME Name of microservice to search if already exists
   * @param {string} ID Unique ID of the Microservice ( To not return itself )
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getByNameIfIsNotTheID(NAME, ID = null) {
    const mongoQuery = {
      $and: [
        { name: { $eq: `${NAME}` } },
        { deleted: { $exists: false } },
      ],
    };
    if (ID !== null && ID !== undefined) {
      mongoQuery.$and.push({ _id: { $ne: ID } });
    }
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * Get the name ( to check if this already exists ) if this
   * not belongs to the optional ID by type
   * @param {string} NAME Name of microservice to search if already exists
   * @param {string} ID Unique ID of the Microservice ( To not return itself )
   * @returns {promise} response of the request
   * @author Tirth [zpiptir]
   */
  getByNameIfIsNotTheIDByType(ID = null) {
    const mongoQuery = {
      type: { $in: this.type },
      deleted: { $exists: false },
      $and: [
        { _id: { $in: ID } },
      ],
    };
    const mongoProjection = {
      _id: 1,
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    );
  }


  /**
   * Get Asset by ID or Slug
   * @param {string} ID Unique ID of the Microservice
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getAssetByIDorSLUG(ID) {
    const mongoQuery = {
      type: { $in: this.type },
      deleted: { $exists: false },
    };
    if (ID !== null && ID !== undefined) {
      mongoQuery.$or = [{ _id: ID }, { slug: ID }];
    }
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * Fetch a adp object by _id/slug
   * @param {array} idArr array of assembly id/slug strings
   * @returns {promise} response of the request
   * @author Tirth [zpiptir]
   */
  getAssemblyByIDorSLUG(IDORSLUGARRAY) {
    let toSearch = IDORSLUGARRAY;
    if (Array.isArray(IDORSLUGARRAY)) {
      toSearch = IDORSLUGARRAY;
    }
    const mongoQuery = {
      type: { $eq: 'assembly' },
      deleted: { $exists: false },
    };
    mongoQuery.$or = [
      {
        _id: {
          $in: toSearch,
        },
      },
      {
        slug: {
          $in: toSearch,
        },
      },
    ];
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * Fetch a microservice by _id
   * @param {array} idArr array of strings, the microservice id
   * @param {boolean} [showDeletedItems=false] show deleted items
   * @returns {promise} response obj containing an array with
   * the related microservice object
   * @author Cein-Sven Da Costa [edaccei]
   */
  getMsById(idArr, showDeletedItems = false) {
    const mongoQuery = {
      _id: {
        $in: idArr,
      },
      type: { $in: this.type },
      deleted: { $exists: false },
    };

    if (showDeletedItems) {
      delete mongoQuery.deleted;
    }

    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * Fetch microservices following RBAC Rules
   * @param {array} ASSETS List of microservices the user
   * wants to access
   * @param {string} ROLE of the operating user
   * @param {boolean} REDUCEITFORADMINAREA if you need
   * to remove unecessary fields ( Admin Area List )
   * just set this to true.
   * Default is false ( All fields ).
   * @param {boolean} MSIDNAME if you need Only microservice ID and Name
   * @returns {promise} response of the request
   * @author Armando Dias [ zdiaarm ]
   */
  allAssetsForRBAC(ASSETS, ROLE, REDUCEITFORADMINAREA = false, MSIDNAME = false, ASSETTYPE) {
    if (!Array.isArray(ASSETS)) {
      const errorObject = { code: 400, msg: `Bad Request - Expecting ARRAY for ASSETS, got ${typeof ASSETS}` };
      return new Promise((RES, REJ) => REJ(errorObject));
    }
    if (typeof ROLE !== 'string') {
      const errorObject = { code: 400, msg: `Bad Request - Expecting STRING for ROLE, got ${typeof ROLE}` };
      return new Promise((RES, REJ) => REJ(errorObject));
    }
    if (ROLE.trim().toLowerCase() !== 'admin' && ASSETS.length === 0) {
      const errorObject = { code: 400, msg: 'Bad Request - Array cannot be empty for non-admin role' };
      return new Promise((RES, REJ) => REJ(errorObject));
    }
    const mongoOptions = {};
    let mongoProjection = {};
    this.type = ASSETTYPE;
    const isAssembly = (ASSETTYPE.includes('assembly'));

    if (REDUCEITFORADMINAREA && !MSIDNAME) {
      mongoProjection = {
        _id: 1,
        name: 1,
        service_category: 1,
        serviceArea: 1,
        reusability_level: 1,
        service_maturity: 1,
        date_modified: 1,
        slug: 1,
        access_token: 1,
        team: 1,
        domain: 1,
        inval_secret: 1,
        menu_auto: 1,
      };
    }

    if (REDUCEITFORADMINAREA && !MSIDNAME && isAssembly) {
      mongoProjection = {
        _id: 1,
        name: 1,
        assembly_category: 1,
        assembly_maturity: 1,
        date_modified: 1,
        slug: 1,
        access_token: 1,
        team: 1,
        domain: 1,
        inval_secret: 1,
        menu_auto: 1,
      };
    }

    if (REDUCEITFORADMINAREA && MSIDNAME) {
      mongoProjection = {
        _id: 1,
        name: 1,
        team: 1,
        domain: 1,
      };
    }

    const mongoQuery = {};
    mongoQuery.$and = [
      { type: { $in: this.type } },
      { deleted: { $exists: false } },
    ];
    if (ASSETS.length) {
      mongoQuery.$and.push({ _id: { $in: ASSETS } });
    }
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    );
  }


  /**
   * Lists all documents
   * @returns {promise} response of the resquest
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  index() {
    const mongoQuery = {
      deleted: { $exists: false },
    };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
    );
  }

  /**
   * Lists all Assets
   * @returns {promise} response of the resquest
   * @author Cein-Sven Da Costa [edaccei]
   */
  indexAssets() {
    const mongoQuery = {
      type: { $in: this.type },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Lists all Assets but returns only the IDs
   * @returns {promise} response of the resquest
   * @author Armando Dias [zdiaarm]
   */
  indexAssetsGetOnlyIDs(showDeleted = false) {
    const mongoQuery = {
      type: { $in: this.type },
      deleted: { $exists: false },
    };
    if (showDeleted) {
      delete mongoQuery.deleted;
    }
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      { limit: 999999, skip: 0 },
      { _id: 1 },
    );
  }


  /**
   * Lists all Assets but returns only the IDs and Slugs
   * @returns {promise} response of the resquest
   * @author Armando Dias [zdiaarm]
   */
  indexAssetsGetOnlyIDsAndSlugs(showDeleted = false) {
    const mongoQuery = {
      type: { $in: this.type },
      deleted: { $exists: false },
    };
    if (showDeleted) {
      delete mongoQuery.deleted;
    }
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      { limit: 999999, skip: 0 },
      { _id: 1, slug: 1 },
    );
  }


  /**
   * Returns the slug of the microservice by ID
   * @returns {promise} response of the resquest
   * @author Armando Dias [zdiaarm]
   */
  justAMicroserviceSlug(ID) {
    const mongoQuery = {
      _id: { $eq: ID },
      deleted: { $exists: false },
    };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      { limit: 1, skip: 0 },
      { _id: 1, slug: 1 },
    );
  }


  /**
   * Fetch a microservice by the microservice slug
   * @param {string} slug the microservice slug
   * @returns {promise} response obj containing an array with
   * the related microservice object
   * @author Cein-Sven Da Costa [edaccei]
   */
  getByMSSlug(slug) {
    const mongoQuery = { slug, deleted: { $exists: false } };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * List all microservices
   * @returns {array} response obj containing an array of microservices
   * @author Cein-Sven Da Costa [edaccei]
   */
  indexMicroservices() {
    const mongoQuery = { type: { $in: this.type }, deleted: { $exists: false } };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * List all users
   * @returns {array} response obj containing an array of users
   * @author Cein-Sven Da Costa [edaccei]
   */
  indexUsers(removePrivateKeys = true) {
    const mongoQuery = { type: { $eq: 'user' }, deleted: { $exists: false } };
    const mongoOptions = { limit: 999999, skip: 0 };
    let projection = {
      'rbac.permission.dynamic': 0,
      'rbac.permission.static': 0,
      'rbac.permission.exception': 0,
    };
    if (!removePrivateKeys) {
      projection = {};
    }

    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      projection,
    );
  }


  /**
   * fetch one or more user from the db by id
   * @param {array} IDS Array of id strings OR simple string with an unique ID
   * @param {boolean} [showHiddenInfo=false] shows rbac object if true
   * @returns {Promise<array>} The list of users found by the given id list
   * @author Cein-Sven Da Costa [edaccei], Armando Dias [zdiaarm]
   */
  getUsersById(idArr, showHiddenInfo = false) {
    let toSearch = idArr;
    let projection = { rbac: 0 };
    if (!Array.isArray(idArr)) {
      toSearch = [idArr];
    }

    const mongoQuery = {
      _id: {
        $in: toSearch,
      },
      type: { $eq: 'user' },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 999999, skip: 0 };

    if (showHiddenInfo) {
      projection = {};
    }

    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      projection,
    );
  }


  /**
   * Retrieve from database one or more registers with name, email and signum
   * from a signum array. Used to check name, email and signum before update.
   * @param {array} SIGNUMS Array of Signums
   * @returns {array} The list of users found by the given signum list
   * but only _id ( for identification ), name, email and signum.
   * @author Armando Dias [zdiaarm]
   */
  getNameEmailAndSignumBySignum(SIGNUMS) {
    let signums = SIGNUMS;
    if (!Array.isArray(signums)) {
      signums = [signums];
    }
    const mongoQuery = {
      _id: {
        $in: signums,
      },
      type: { $eq: 'user' },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    const mongoProject = {
      _id: 1,
      name: 1,
      email: 1,
      signum: 1,
    };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProject,
    );
  }


  /**
   * Fetches a single microservice that could contain a document with url
   * @param {string} documentUrl document url within a microservice
   * @returns {array} list of a single microservice containing the found document url
   * @author Armando Schiavon Dias [escharm]
   */
  getMsByDocumentUrl(documentUrl) {
    const mongoQuery = {
      _documentation: {
        $elemMatch: { url: { $eq: documentUrl } },
      },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get a single microservice if everything is right with the secret value
   * @param {string} ID Asset unique ID
   * @param {string} SECRET The internal secret string
   * @returns {promise} With the request from database
   * @author Armando Dias [zdiaarm]
   */
  getMSByIdAndSecret(ID, SECRET) {
    const mongoQuery = { _id: `${ID}`, inval_secret: `${SECRET}`, deleted: { $exists: false } };
    const mongoOptions = { limit: 1, skip: 0 };
    const mongoProjection = {
      _id: 1, name: 1, slug: 1, menu_auto: 1, repo_urls: 1,
    };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    );
  }


  /**
   * Delete one register
   * @param {string} ID of the register that needs to be deleted
   * @returns {promise} db delete command
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  deleteOne(ID) {
    return adp.db.destroy(this.dbMongoCollection, ID);
  }


  /**
   * Update register. Case the register is type = 'user'
   * ( which cannot be detected only by the type field,
   * sometimes not present ) the rbac field is deleted
   * because who deals with this field is the RBAC
   * Controller represented by:
   * - updateUserPermissionGroup()
   * - updatePermissionGroupforMultipleUsers()
   * - updateUserPermissionGroupIfRbacGroupUpdated()
   * - deletePermissionGroupFromUsers()
   * - getUsersByPermissionGroup()
   * and others methods here, in this same file.
   * @param {object} OBJ that needs to be updated
   * @param {boolean} INCLUDERBAC If you know what you
   * are doing, you can force the update including the RBAC.
   * Default false.
   * @param {object} NOTCHECKID Set to true if you want to avoid
   * the automatic ID CouchDB x MongoDB check. Default is false.
   * @returns {promise} db update command
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [ zdiaarm ]
   */
  update(OBJ, INCLUDERBAC = false, NOTCHECKID = false) {
    const objToUpdate = OBJ;
    if ((objToUpdate.type === 'user'
    || objToUpdate.signum
    || objToUpdate.role
    || objToUpdate.marketInformationActive)
    && !INCLUDERBAC) {
      delete objToUpdate.rbac;
    }
    return adp.db.update(this.dbMongoCollection, objToUpdate, NOTCHECKID);
  }

  /** Update only the auto menu
   * @param {string} MSID Microservice ID
   * @param {object} AUTO The auto menu, including development and releases.
   * @returns {Promise}  A promise that returns the db response.
   * @author Armando Dias [ zdiaarm ]
   */
  updateOnlyAutoMenu(MSID, AUTO, SPECIFICVERSION = 'ALL') {
    const mongoQuery = { _id: MSID };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(this.dbMongoCollection, mongoQuery, mongoOptions)
      .then((RESULT) => {
        const objectToUpdate = RESULT
          && Array.isArray(RESULT.docs)
          && RESULT.docs[0]
          ? RESULT.docs[0]
          : null;
        if (objectToUpdate) {
          const specificVersion = SPECIFICVERSION === 'ALL'
            ? 'ALL'
            : SPECIFICVERSION.toLowerCase().trim();
          if (specificVersion === 'ALL') {
            objectToUpdate.menu.auto = AUTO;
          } else if (
            specificVersion === 'development'
            || specificVersion === 'indevelopment'
            || specificVersion === 'in-development'
          ) {
            objectToUpdate.menu.auto.development = AUTO.development;
          } else {
            let released = [];
            let found = false;
            objectToUpdate.menu.auto.release.forEach((RELEASE) => {
              if (`${RELEASE.version}` === `${specificVersion}`) {
                released.push(AUTO.release[0]);
                found = true;
              } else {
                released.push(RELEASE);
              }
            });
            if (!found) {
              released.push(AUTO.release[0]);
            }
            released = released.sort(adp.versionSort('-version'));
            objectToUpdate.menu.auto.release = released;
          }
          return adp.db.update(this.dbMongoCollection, objectToUpdate);
        }
        return { ok: false, msg: `Microservice ${MSID} not found!` };
      })
      .catch(ERROR => ERROR);
  }

  /**
   * Fetch all user objects by permission group id/s
   * If nothing is given, all users with no rbac permissions will be returned
   * @param {array} groupIds list of group permission ids, empty array can be given
   * @param {number} limit the query limit
   * @param {number} skip the skip limit
   * @returns {promise<object>} standard resp obj with Adp collection User objects matching
   * the given groupIds array
   * @author Cein
   */
  getUsersByPermissionGroup(groupIds = [], limit = 99999, skip = 0) {
    this.assetSearchByQuery();
    let mongoQuery = {};
    if (Array.isArray(groupIds) && groupIds.length) {
      mongoQuery = {
        type: 'user',
        'rbac._id': { $in: groupIds },
      };
    } else {
      mongoQuery = {
        $and: [
          { type: 'user' },
          {
            $or: [
              { rbac: { $exists: false } },
              { rbac: { $size: 0 } },
            ],
          },
        ],
      };
    }

    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      { limit, skip },
    );
  }

  /**
   * Updates single user register with group permissions
   * @param {string} id the user id.
   * @param {array} rbacGroup the group permissions.
   * @returns {Promise}  A promise that returns the db response.
   * @author Veerender Voskula[zvosvee]
   */
  updateUserPermissionGroup(id, rbacGroup) {
    const groupsList = [];
    rbacGroup.forEach((group) => {
      const item = group;
      if (item._id) {
        item._id = new adp.MongoObjectID(item._id);
      }
      groupsList.push(item);
    });
    const userObj = {
      _id: id,
      rbac: groupsList,
      modified: new Date(),
    };
    return adp.db.update(this.dbMongoCollection, userObj);
  }

  /** update multple users with one group
   * Does not check for duplicates
   * @param {array<string>} users array of user ids/signums
   * @param {object} group the rbac group object
   * @returns {Promise}  A promise that returns the db response.
   * @author Veerender Voskula[zvosvee]
   */
  updatePermissionGroupforMultipleUsers(users, group) {
    const filter = {
      type: 'user',
      _id: { $in: users },
    };
    const update = { $push: { rbac: group } };
    return this.updateMany(filter, update);
  }


  /**  Updates multiple user registers
  * @param {obj} filter the selection criteria for update
  * @param {obj} update document:modifications to apply
  * @returns {Promise}  A promise that returns the db response.
  * @author Veerender Voskula[zvosvee]
  */
  updateMany(filter, update) {
    return adp.db.updateMany(this.dbMongoCollection, filter, update);
  }


  /**  Returns all users where RBAC's
   * ID is String instead of ObjectId
  * @returns {Promise}  A promise that returns the db response.
  * @author Armando Dias [zdiaarm]
  */
  allUsersWhereRBACIDisString() {
    const mongoQuery = { 'rbac._id': { $type: 'string' } };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**  deletes permission group from multiple user registers
  * @param {string} GROUPID the rbac group id
  * @returns {Promise}  A promise that returns the db response.
  * @author Veerender Voskula[zvosvee]
  */
  deletePermissionGroupFromUsers(GROUPID) {
    const groupId = new adp.MongoObjectID(GROUPID);
    const filter = { type: 'user' };
    const update = { $pull: { rbac: { _id: groupId } } };
    return this.updateMany(filter, update);
  }

  /**  update permission group of multiple user registers
  * when assigned group is updated
  * @param {object} GROUP the rbac group object
  * @returns {Promise}  A promise that returns the db response.
  * @author Veerender Voskula[zvosvee]
  */
  updateUserPermissionGroupIfRbacGroupUpdated(GROUP) {
    const groupId = new adp.MongoObjectID(GROUP._id);
    const filter = { type: 'user', 'rbac._id': groupId };
    const update = { $set: { 'rbac.$': GROUP } };
    return this.updateMany(filter, update);
  }

  /**
   * Creates a MS entry into database
   * @param {object} OBJ JSON Object with details
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  createOne(OBJ) {
    return adp.db.create(this.dbMongoCollection, OBJ);
  }


  /**
   * Look for Duplicate Names/Slugs of Microservices
   * If NAME and ID are NULL:
   * ---- Returns a list of any duplicated name.
   * If NAME is not NULL:
   * ---- Returns a list of this name/slug, if duplicated.
   * If NAME and ID are not NULL:
   * ---- Returns a list of this name/slug, if duplicated, except
   *      the ID given as parameter. Is used to see if some
   *      other microservice is using the same name.
   * Keep in mind different names could generate the same slug:
   * Example: "Asset 1" x "Asset (1)" will be considerated
   * duplicates because the slug is the same.
   * @param {stringt} NAME Name you want to check, optional.
   * @param {stringt} ID Unique ID of the Microservice, optional.
   * @author Armando Dias [zdiaarm]
   */
  getAssetDuplicateNames(NAME = null, ID = null) {
    const collection = this.dbMongoCollection;
    const steps = [];
    if (NAME === null && ID === null) {
      steps.push({ $match: { type: { $in: this.type } } });
      steps.push({ $match: { deleted: { $ne: true } } });
      steps.push({ $group: { _id: { name: '$name' }, ids: { $addToSet: '$_id' }, count: { $sum: 1 } } });
      steps.push({ $match: { count: { $gt: 1 } } });
      steps.push({ $sort: { count: -1 } });
      return adp.db.aggregate(collection, steps);
    }
    const slugToCompare = adp.slugIt(NAME);
    const nameCaseInsesitive = { $regex: (`${NAME.toLowerCase()}`).trim(), $options: 'i' };
    if (NAME !== null && ID === null) {
      const matchObject = {
        $and: [
          {
            $or: [
              { type: { $in: this.type }, name: nameCaseInsesitive },
              { type: { $in: this.type }, slug: slugToCompare },
            ],
          },
          { deleted: { $exists: false } }],
      };
      steps.push({ $match: matchObject });
      steps.push({ $group: { _id: { name: '$name' }, ids: { $addToSet: '$_id' }, count: { $sum: 1 } } });
      steps.push({ $match: { count: { $gt: 0 } } });
      steps.push({ $sort: { count: -1 } });
      return adp.db.aggregate(collection, steps);
    }
    const matchObject = {
      $and: [
        {
          $or: [
            { type: { $in: this.type }, _id: { $ne: ID }, name: nameCaseInsesitive },
            { type: { $in: this.type }, _id: { $ne: ID }, slug: slugToCompare },
          ],
        },
        { deleted: { $exists: false } }],
    };
    steps.push({ $match: matchObject });
    steps.push({ $group: { _id: { name: '$name' }, ids: { $addToSet: '$_id' }, count: { $sum: 1 } } });
    steps.push({ $match: { count: { $gt: 0 } } });
    steps.push({ $sort: { count: -1 } });
    return adp.db.aggregate(collection, steps);
  }


  /**
   * private: msSearch denormalisation pipeline query
   * @returns {array} list of pipelines to denormalise required data
   * @author Cein, Michael
   */
  static _msSearchDenormPipelines() {
    return [
      {
        $lookup: {
          from: 'listoption',
          let: {
            reusability_level: '$reusability_level',
            service_category: '$service_category',
            domain: '$domain',
            serviceArea: '$serviceArea',
            service_maturity: '$service_maturity',
            restricted: '$restricted',
            assembly_category: '$assembly_category',
            assembly_maturity: '$assembly_maturity',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ['$group-id', 1] },
                        { $eq: ['$select-id', '$$reusability_level'] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ['$group-id', 2] },
                        { $eq: ['$select-id', '$$service_category'] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ['$group-id', 3] },
                        { $eq: ['$select-id', '$$domain'] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ['$group-id', 4] },
                        { $eq: ['$select-id', '$$serviceArea'] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ['$group-id', 5] },
                        { $eq: ['$select-id', '$$service_maturity'] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ['$group-id', 6] },
                        { $eq: ['$select-id', '$$restricted'] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ['$group-id', 13] },
                        { $eq: ['$select-id', '$$assembly_category'] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ['$group-id', 14] },
                        { $eq: ['$select-id', '$$assembly_maturity'] },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: 'denorm.listoptions_items',
        },
      },
      {
        $lookup: {
          from: 'adp',
          localField: 'team.signum',
          foreignField: '_id',
          as: 'denorm.team',
        },
      },
      {
        $unset: 'denorm.team.rbac',
      },
      {
        $lookup: {
          from: 'tag',
          localField: 'tags',
          foreignField: '_id',
          as: 'denorm.tags',
        },
      },
      {
        $addFields: {
          'denorm.reusability_level_item': { $filter: { input: '$denorm.listoptions_items', as: 'row', cond: { $eq: ['$$row.group-id', 1] } } },
          'denorm.service_category_item': { $filter: { input: '$denorm.listoptions_items', as: 'row', cond: { $eq: ['$$row.group-id', 2] } } },
          'denorm.domain_item': { $filter: { input: '$denorm.listoptions_items', as: 'row', cond: { $eq: ['$$row.group-id', 3] } } },
          'denorm.serviceArea_item': { $filter: { input: '$denorm.listoptions_items', as: 'row', cond: { $eq: ['$$row.group-id', 4] } } },
          'denorm.service_maturity_item': { $filter: { input: '$denorm.listoptions_items', as: 'row', cond: { $eq: ['$$row.group-id', 5] } } },
          'denorm.restricted_item': { $filter: { input: '$denorm.listoptions_items', as: 'row', cond: { $eq: ['$$row.group-id', 6] } } },
          'denorm.assembly_category_item': { $filter: { input: '$denorm.listoptions_items', as: 'row', cond: { $eq: ['$$row.group-id', 13] } } },
          'denorm.assembly_maturity_item': { $filter: { input: '$denorm.listoptions_items', as: 'row', cond: { $eq: ['$$row.group-id', 14] } } },
          'denorm.auto_menu': { $cond: [{ $eq: ['$menu_auto', true] }, 'Automated', 'Manual'] },
          tags: '$denorm.tags',
          team: '$denorm.team',
          name_lowercase: { $toLower: '$name' },
        },
      },
      { $unwind: '$denorm.reusability_level_item' },
      { $unwind: '$denorm.service_category_item' },
      { $unwind: '$denorm.domain_item' },
      { $unwind: '$denorm.serviceArea_item' },
      { $unwind: '$denorm.service_maturity_item' },
      { $unwind: '$denorm.restricted_item' },
      { $unwind: '$denorm.assembly_category_item' },
      { $unwind: '$denorm.assembly_maturity_item' },
      { $unwind: '$denorm.auto_menu' },
      {
        $addFields: {
          reusability_level_order: '$denorm.reusability_level_item.order',
          'denorm.reusability_level': '$denorm.reusability_level_item.name',
          service_category_order: '$denorm.service_category_item.order',
          'denorm.service_category': '$denorm.service_category_item.name',
          domain_order: '$denorm.domain_item.order',
          'denorm.domain': '$denorm.domain_item.name',
          serviceArea_order: '$denorm.serviceArea_item.order',
          'denorm.serviceArea': '$denorm.serviceArea_item.name',
          service_maturity_order: '$denorm.service_maturity_item.order',
          'denorm.service_maturity': '$denorm.service_maturity_item.name',
          'denorm.restricted': '$denorm.restricted_item.name',
          assembly_category_order: '$denorm.assembly_category_item.order',
          'denorm.assembly_category': '$denorm.assembly_category_item.name',
          assembly_maturity_order: '$denorm.assembly_maturity_item.order',
          'denorm.assembly_maturity': '$denorm.assembly_maturity_item.name',
        },
      },
    ];
  }

  /**
   * Private: msSearch pipelines for sorting, groupby, limit and skip
   * @param {object|null} sortBeforeGroupObj sortable key and order value that applies
   * before the groupby pipeline
   * @param {string|null} groupByKey the groupable value defined in the schema
   * @param {object|null} sortAfterGroupObj sortable key and order value that applies
   * after the groupby pipeline
   * @param {number|null} limit the limit of items to return before grouping
   * @param {number|null} skip the amount of entries to skip before grouping
   * @returns {array} list of pipelines for sorting, groupby, limit and skip
   * @author Cein
   */
  static _msSearchSortGroupPagination(
    sortBeforeGroupObj, groupByKey, sortAfterGroupObj, limit, skip,
  ) {
    const pipelines = [];

    // sort before groupby
    if (sortBeforeGroupObj) {
      pipelines.push({ $sort: sortBeforeGroupObj });
    } else {
      pipelines.push({ $sort: { service_maturity_order: -1, name_lowercase: 1 } });
    }

    if (limit !== null && skip !== null) {
      const skipPipeline = [{ $skip: skip }, { $limit: limit }];
      pipelines.push(...skipPipeline);
    } else if (limit !== null) {
      pipelines.push({ $limit: limit });
    }

    // groupBy
    if (groupByKey) {
      const groupByPipeline = [{
        $group: {
          _id: `$${groupByKey}`,
          groupHeader: { $first: `$denorm.${groupByKey}_item.name` },
          groupDescription: { $first: `$denorm.${groupByKey}_item.desc` },
          microservices: { $push: '$$ROOT' },
          total: { $sum: 1 },
        },
      },
      {
        $addFields: { groupType: true },
      }];
      pipelines.push(...groupByPipeline);
    } else {
      const groupByPipeline = [{
        $group: {
          _id: '$type',
          microservices: { $push: '$$ROOT' },
          total: { $sum: 1 },
        },
      },
      {
        $addFields: { groupHeader: null, groupDescription: null, groupType: false },
      }];

      pipelines.push(...groupByPipeline);
    }

    // sort after groupby
    if (sortAfterGroupObj) {
      pipelines.push({ $sort: sortAfterGroupObj });
    } else if (groupByKey) {
      pipelines.push({ $sort: { [`microservices.${groupByKey}_order`]: 1 } });
    }

    return pipelines;
  }

  /**
   * Microservice search
   * @param {array|null} [filterQuery=null] list of filter groups with $or filter items
   * example: [ { $or: [{ service_category: 1}, { service_category: 2} ] },
   * { $or: [{ domain: 1 }] } ]
   * @param {object|null} [sortBeforeGroupObj=null] sortable key and order value that applies
   * before the groupby pipeline
   * example: { service_maturity: 1, name: -1 }
   * @param {string|null} [groupByKey=null] will group by a given groupBy key
   * @param {object|null} [sortAfterGroupObj=null] sortable key and order value that applies
   * after the groupby pipeline
   * @param {number|null} [limit=null] the limit of items to return before grouping
   * @param {number} skip the amount of entries to skip before grouping
   * @param {boolean} [removePrivateKeys=true] removes private keys from the search
   * @param {boolean} getAllAttributes indicates whether or not the object should be trimmed
   * @returns {promise<array>} list of searched microservices
   * @author Cein, Michael
   */
  msSearch(
    filterQuery = null,
    sortBeforeGroupObj = null,
    groupByKey = null,
    sortAfterGroupObj = null,
    skip = null,
    limit = null,
    removePrivateKeys = true,
    getAllAttributes = true,
  ) {
    const pipelines = [];
    // filters
    const filterPipeline = {
      $match: {
        $and: [
          { type: { $in: this.type } },
          { deleted: { $exists: false } },
        ],
      },
    };
    if (filterQuery) {
      filterPipeline.$match.$and.push(...filterQuery);
    }
    pipelines.push(filterPipeline);

    if (removePrivateKeys) {
      pipelines.push(
        { $unset: 'inval_secret' },
      );
    }

    // Remove the attributes the frontend doesn't need for the marketplace
    if (!getAllAttributes) {
      pipelines.push(
        {
          $unset: [
            'menu',
            'repo_urls',
            'menu_auto',
            'approval',
            'owner',
            'additional_info',
            'adp_organization',
            'adp_realization',
            'adp_strategy',
            'backlog',
            'domain',
            'report_service_bugs',
            'request_service_support',
          ],
        },
      );
    }

    const denormPipelines = Adp._msSearchDenormPipelines();
    pipelines.push(...denormPipelines);

    const sortGrpPagePipelines = Adp._msSearchSortGroupPagination(
      sortBeforeGroupObj, groupByKey, sortAfterGroupObj, limit, skip,
    );
    pipelines.push(...sortGrpPagePipelines);
    return adp.db.aggregate(this.dbMongoCollection, pipelines)
      .then((RESULT) => {
        const result = RESULT;
        if (Array.isArray(RESULT.docs)) {
          RESULT.docs.forEach((GROUPS) => {
            if (Array.isArray(GROUPS.microservices)) {
              GROUPS.microservices.forEach((MS) => {
                const ms = MS;
                delete ms.denorm.listoptions_items;
              });
            }
          });
        }
        return result;
      })
      .catch((ERROR) => {
        adp.echoLog('Error on [ adp.db.aggregate ]', { origin: 'msSearch', error: ERROR }, 500, 'adp.models.Adp');
      });
  }

  /**
   * Removes the given list of ObjectIds from all user permission type content static arrays
   * This will affect all permission groups within the adp user objects.
   * @param {string[]} wordpressIdsToDelete list of objectIds to remove
   * @returns {Promise<object>} the standard mongo updateMany response object
   * @author Cein, Omkar
   */
  cleanContentPermissions(wordpressIdsToDelete) {
    const filter = { type: 'user', 'rbac.permission.type': 'content', 'rbac.permission.static': { $in: wordpressIdsToDelete } };
    const update = { $pullAll: { 'rbac.$[].permission.$[elem].static': wordpressIdsToDelete } };
    const options = { arrayFilters: [{ 'elem.type': 'content' }] };
    return adp.db.updateMany(this.dbMongoCollection, filter, update, options);
  }

  /**
   * Adds the given EID Object for all the XID users permission
   * This will not add EID Object if XID users already have EID group.
   * @param {Object} eidGroupObject EID group objectId to add
   * @param {String} xid group _id of XID to fetch users with the XID group.
   * @returns {Promise<object>} the standard mongo updateMany response object
   * @author Ravikiran, Armando
   */
  addEidGroupToXidUsers(eidGroupObject, xid) {
    const filter = {
      $and: [
        { type: 'user', rbac: { $elemMatch: { _id: xid } } },
        { type: 'user', rbac: { $not: { $elemMatch: { _id: eidGroupObject._id } } } },
      ],
    };
    const update = { $push: { rbac: eidGroupObject } };
    return adp.db.updateMany(this.dbMongoCollection, filter, update);
  }


  /**
   * Removes the given permission from all XID user
   * @param {String} xid group _id of XID group
   * @returns {Promise<object>} the standard mongo updateMany response object
   * @author Ravikiran, Armando
   */
  removeXidPermissionsFromUsers(xid) {
    const filter = { type: 'user', rbac: { $elemMatch: { _id: xid } } };
    const update = { $pull: { rbac: { _id: xid } } };
    return adp.db.updateMany(this.dbMongoCollection, filter, update);
  }


  updateLastSyncDate(ASSETID) {
    const newDate = new Date();
    const filter = { _id: ASSETID };
    const toUpdate = { $set: { last_sync_date: newDate } };
    return adp.db.updateMany(this.dbMongoCollection, filter, toUpdate);
  }

  setMimerDevelopmentVersionFromYAML(ASSETID, VERSION) {
    const filter = { _id: ASSETID };
    const toUpdate = { $set: { mimer_development_version: VERSION } };
    return adp.db.updateMany(this.dbMongoCollection, filter, toUpdate);
  }

  getMimerDevelopmentVersionFromYAML(ASSETID) {
    const mongoQuery = {
      _id: { $eq: ASSETID },
    };
    const mongoOptions = { limit: 1, skip: 0 };
    const mongoProjection = { _id: 0, mimer_development_version: 1 };

    return new Promise((RESOLVE, REJECT) => {
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          if (RESULT
            && RESULT.docs
            && RESULT.docs[0]
            && RESULT.docs[0].mimer_development_version) {
            RESOLVE(RESULT.docs[0].mimer_development_version);
          }
          RESOLVE(undefined);
        })
        .catch((ERROR) => {
          REJECT(ERROR);
        });
    });
  }

  getMicroserviceList() {
    const mongoProjection = { _id: 1, name: 1 };
    const mongoQuery = {
      type: { $eq: 'microservice', $ne: null, $exists: true },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    );
  }

  /**
   * Get MS by ID For Assembly
   * @param {string} ID Unique ID of the Microservice
   * @returns {promise} response of the request
   * @author Anil Chaurasiya [zchiana]
   */
  getMSByIdForAssembly(ID) {
    const mongoProjection = {
      name: 1,
      slug: 1,
      assembly_id: 1,
      assembly_name: 1,
      based_on: 1,
      check_cpi: 1,
      description: 1,
      giturl: 1,
      helmurl: 1,
      helm_chartname: 1,
      reusability_level: 1,
      serviceArea: 1,
      service_category: 1,
      service_maturity: 1,
    };
    const mongoQuery = {
      _id: { $eq: ID },
      type: { $in: this.type },
      deleted: { $exists: false },
    };

    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    );
  }
}

module.exports = Adp;
