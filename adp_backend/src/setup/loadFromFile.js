// ============================================================================================= //
/**
* [ global.adp.setup.loadFromFile ]
* Read the <b>config.json</b> and apply the values for the Backend work.
* Also reads the <b>Schema JSON Files</b> for the <b>Schema Validation</b>.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => {
  const packName = 'global.adp.setup.loadFromFile';
  const configJSONPath = `${global.adp.path}/config/config.json`;
  const configJSON = JSON.parse(global.fs.readFileSync(configJSONPath, 'utf-8'));
  try {
    global.adp.config.siteAddress = configJSON.siteAddress;
    global.adp.config.baseSiteAddress = configJSON.siteAddress.replace('/api', '');
    global.adp.config.runnerMode = process.env.BACKEND_TYPE === 'WORKER' ? 'WORKER' : 'MAIN';
    global.adp.config.workerInstance = process.env.BACKEND_TYPE === 'WORKER';

    global.adp.config.environmentID = configJSON
      && configJSON.environmentID
      ? configJSON.environmentID
      : 'localhost';

    adp.config.integrationTestsPassword = null;
    if (adp.config.siteAddress.indexOf('adp.ericsson.se') === -1) {
      const timestampNumbers = (new Date()).getTime();
      const randomNumbers = `${Math.floor(Math.random() * 99999)}${Math.floor(Math.random() * 88888)}`;
      const randomInternalPassword = `${Buffer.from(`${timestampNumbers}_${randomNumbers}`).toString('base64')}`;
      adp.config.integrationTestsPassword = `ITP_${randomInternalPassword}`;
    }

    if (global.adp.config.siteAddress === 'https://localhost:9999'
    && global.adp.config.workerInstance) {
      global.adp.config.regularPort = configJSON.httpPort - 1;
      global.adp.config.securityPort = configJSON.httpsPort - 1;
    } else {
      global.adp.config.regularPort = configJSON.httpPort;
      global.adp.config.securityPort = configJSON.httpsPort;
    }

    global.adp.config.mongodb = configJSON.mongoDB;
    global.adp.config.mssqldb = configJSON.mssqlDB;
    global.adp.config.asciidoctorService = configJSON.asciidoctorService;
    global.adp.config.azure = configJSON.azure || {};
    const functionalUser = process.env.PORTAL_FUNC_USER || '';
    const functionalPassword = process.env.PORTAL_FUNC_USER_PASSWORD || '';
    global.adp.config.functionalUserPassword = functionalPassword;
    adp.echoLog(`[+${global.adp.timeStepNext()}] INFO: PORTAL_FUNC_USER length: ${functionalUser.length}.`);
    adp.echoLog(`[+${global.adp.timeStepNext()}] INFO: PORTAL_FUNC_USER_PASSWORD length: ${functionalPassword.length}.`);
    global.adp.config.eadpusersPassword = `${functionalUser}:${functionalPassword}`;
    global.adp.config.functionalUser = functionalUser;
    global.adp.config.azure.client_secret = process.env.AZURE_CLIENT_SECRET || '';
    global.adp.config.azure.client_id = process.env.AZURE_CLIENT_ID || '';
    global.adp.config.peopleFinderApiUrl = configJSON.peopleFinderApiUrl;
    global.adp.config.peopleFinderApiUrl = configJSON.peopleFinderApiUrl || '';

    global.adp.config.egs = {};
    global.adp.config.egs.clientId = process.env.EGS_CLIENTID || '';
    global.adp.config.egs.clientSecret = process.env.EGS_CLIENTSECRET || '';
    global.adp.config.egs.scope = process.env.EGS_SCOPE || '';
    global.adp.config.egs.grant = process.env.EGS_GRANT || '';
    global.adp.config.egs.accessTokenURL = process.env.EGS_ACCESSTOKENURL || '';

    global.adp.config.mockServerAddress = configJSON.mockServerAddress || 'seliius18473.seli.gic.ericsson.se';
    global.adp.config.mockServerPort = configJSON.mockServerPort || 56064;

    global.adp.config.mimerServer = configJSON.mimerServer || 'https://mimer.internal.ericsson.com/';
    global.adp.config.muninServer = configJSON.muninServer || 'https://munin.internal.ericsson.com/';
    global.adp.config.eridocServer = configJSON.eridocServer || 'https://erid2rest.internal.ericsson.com/';
    global.adp.config.eridocPublicServer = configJSON.eridocPublicServer || 'https://document.internal.ericsson.com/';
    global.adp.config.primDDServer = configJSON.primDDServer || 'https://rsb.internal.ericsson.com/REST/G3/CICD/Document/M/';

    global.adp.config.mockServer = configJSON.mockServer || 'http://localhost:1080';

    global.adp.config.showPerformanceConsoleLogs = configJSON.showPerformanceConsoleLogs
      ? configJSON.showPerformanceConsoleLogs : false;
    global.adp.config.innersourceLaunchDate = configJSON.innersourceLaunchDate || '';
    if (configJSON.eadpusersPassword !== undefined) {
      global.adp.config.eadpusersPassword = configJSON.eadpusersPassword;
    }
    if (configJSON.mockArtifactoryAddress !== undefined) {
      global.adp.config.mockArtifactoryAddress = configJSON.mockArtifactoryAddress;
    } else {
      global.adp.config.mockArtifactoryAddress = 'https://seliius18473.seli.gic.ericsson.se:58090/notify/mockartifactory/';
    }
    global.adp.config.mockArtifactoryEnvTag = process.env.ENV_TAG || 'local';

    // Set as Zero to use the process time as waiting time for each Job.
    // Set as 1 to not wait between jobs. Recommended for Test Environment.
    // Set a number bigger than 1 in milliseconds to use as waiting time for each Job.
    global.adp.config.masterQueueBetweenJobsTime = configJSON.masterQueueBetweenJobsTime
      ? configJSON.masterQueueBetweenJobsTime
      : 1;

    global.adp.config.playgroundAddress = configJSON.playgroundAddress ? configJSON.playgroundAddress : 'https://playground-server.hoff061.rnd.gic.ericsson.se/playground';

    global.adp.cache.timeInSeconds = configJSON.holdDocumentCacheInMemoryForXSeconds
      ? configJSON.holdDocumentCacheInMemoryForXSeconds : 30;

    global.adp.cache.timeInSecondsForDatabase = configJSON.holdCacheFromDatabaseForXSeconds
      ? configJSON.holdCacheFromDatabaseForXSeconds : 10;

    global.adp.config.displayPackagesSizeOnLoad = configJSON.displayPackagesSizeOnLoad;
    global.adp.config.nodeMailer = configJSON.nodeMailer ? configJSON.nodeMailer : 'https://seliius18473.seli.gic.ericsson.se:58083/notify/send-email';
    global.adp.config.ldap = configJSON.ldap;
    if (!global.adp.config.ldap.bindCredentials) {
      global.adp.config.ldap.bindCredentials = functionalPassword;
    }
    if (global.adp.config.ldap.searchFilter === null
      || global.adp.config.ldap.searchFilter === undefined
      || global.adp.config.ldap.searchFilter === '') {
      global.adp.config.ldap.searchFilter = '(cn={{username}})';
    }
    global.adp.config.ldapSearchConstraints = configJSON.ldapSearchConstraints ? configJSON.ldapSearchConstraints : ['cn', 'uid'];
    global.adp.config.adpHelmDataFile = configJSON.adpHelmDataFile ? configJSON.adpHelmDataFile : 'https://arm.rnd.ki.sw.ericsson.se/artifactory/proj-adp-gs-all-helm/index.yaml';
    if (configJSON.MAIL_OPTIONS !== undefined && configJSON.MAIL_OPTIONS !== null) {
      global.adp.config.devModeMail = configJSON.MAIL_OPTIONS.devMode
        ? configJSON.MAIL_OPTIONS.devMode : false;
    }
    global.adp.config.jwt = {};
    global.adp.config.jwt.secret = configJSON.jwt.secret;
    global.adp.config.jwtIntegration = {};
    global.adp.config.jwtIntegration.secret = configJSON.jwtIntegration.secret;
    global.adp.config.saveConsoleLogInFile = false;
    if (configJSON.saveConsoleLogInFile === true) {
      global.adp.config.saveConsoleLogInFile = true;
      adp.echoLog(`[+${global.adp.timeStepNext()}] INFO: App Logs will be saved on log files.`);
    }
  } catch (ERROR) {
    const errorText = 'Error in (the first) try/catch block';
    const errorOBJ = {
      error: ERROR,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
  }

  try {
    global.adp.config.elasticSearchAddress = configJSON
                                          && configJSON.elasticSearch
                                          && configJSON.elasticSearch.address
      ? configJSON.elasticSearch.address
      : null;
    if (!adp.config.elasticSearchAddress) {
      throw new Error('No setup data for Elastic Search: address');
    } else {
      const message = `Elastic Search address [ ${adp.config.elasticSearchAddress} ]`;
      adp.echoLog(message, null, 200, 'adp.setup.loadFromFile', false);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.config.elasticSearchWordpressIndex = configJSON
                                                 && configJSON.elasticSearch
                                                 && configJSON.elasticSearch.indexes
                                                 && configJSON.elasticSearch.indexes.wordpress
      ? configJSON.elasticSearch.indexes.wordpress
      : null;
    if (!adp.config.elasticSearchWordpressIndex) {
      throw new Error('No setup data for Elastic Search: wordpress index');
    } else {
      const message = `Elastic Search Index for Wordpress [ ${adp.config.elasticSearchWordpressIndex} ]`;
      adp.echoLog(message, null, 200, 'adp.setup.loadFromFile', false);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.config.elasticSearchMicroservicesIndex = configJSON
                                                 && configJSON.elasticSearch
                                                 && configJSON.elasticSearch.indexes
                                                 && configJSON.elasticSearch.indexes.microservices
      ? configJSON.elasticSearch.indexes.microservices
      : null;
    if (!adp.config.elasticSearchMicroservicesIndex) {
      throw new Error('No setup data for Elastic Search: microservices index');
    } else {
      const message = `Elastic Search Index for MS [ ${adp.config.elasticSearchMicroservicesIndex} ]`;
      adp.echoLog(message, null, 200, 'adp.setup.loadFromFile', false);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.config.elasticSearchMsDocumentationIndex = (
      configJSON
      && configJSON.elasticSearch
      && configJSON.elasticSearch.indexes
      && configJSON.elasticSearch.indexes.msDocumentation
    ) ? configJSON.elasticSearch.indexes.msDocumentation : null;
    if (!adp.config.elasticSearchMsDocumentationIndex) {
      throw new Error('No setup data for Elastic Search: microservice documentation index');
    } else {
      const message = `Elastic Search Index for MS Documentation [ ${adp.config.elasticSearchMsDocumentationIndex} ]`;
      adp.echoLog(message, null, 200, 'adp.setup.loadFromFile', false);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.config.elasticSearchMsDocumentationIndex = configJSON
                                                 && configJSON.elasticSearch
                                                 && configJSON.elasticSearch.indexes
                                                 && configJSON.elasticSearch.indexes.msDocumentation
      ? configJSON.elasticSearch.indexes.msDocumentation
      : null;
    if (!adp.config.elasticSearchMsDocumentationIndex) {
      throw new Error('No setup data for Elastic Search: microservices documentation index');
    } else {
      const message = `Elastic Search Index [ ${adp.config.elasticSearchMsDocumentationIndex} ]`;
      adp.echoLog(message, null, 200, 'adp.setup.loadFromFile', false);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  } catch (ERROR) {
    global.adp.config.elasticSearchAddress = 'http://localhost:48200';
    global.adp.config.elasticSearchWordpressIndex = '1921685610223309-post-1';
    global.adp.config.elasticSearchMicroservicesIndex = 'microservices';
    global.adp.config.elasticSearchMsDocumentationIndex = 'microservice-documentation';
    const errorMessage = 'The setup data for Elastic Search not found in config.json! Using default values:';
    const errorObject = {
      elasticSearchAddress: adp.config.elasticSearchAddress,
      elasticSearchWordpressIndex: adp.config.elasticSearchWordpressIndex,
      elasticSearchMicroservicesIndex: adp.config.elasticSearchMicroservicesIndex,
      elasticSearchMsDocumentationIndex: adp.config.elasticSearchMsDocumentationIndex,
      error: ERROR,
    };
    adp.echoLog(errorMessage, errorObject, 500, 'adp.setup.loadFromFile', false);
  }

  try {
    const lockFileExists = global.fs.existsSync(`${adp.path}/mongoLock/lock.json`);
    if (lockFileExists) {
      global.adp.config.defaultDB = 'mongoDB';
      adp.echoLog('The \'defaultDB\' set as \'mongoDB\' because the mongoLock file was found!');
    } else {
      global.adp.config.defaultDB = configJSON.defaultDB;
    }
  } catch (ERROR) {
    global.adp.echoLog('Error on \'defaultDB\' definition in [ global.adp.setup.loadFromFile ] ERROR :: ', ERROR);
  }

  try {
    const microserviceSchemaJSONPath = `${global.adp.path}/setup/schema_microservice.json`;
    const BaseAssetSchemaJSONPath = `${global.adp.path}/setup/schema_base.json`;
    const BaseAssemblySchemaJSONPath = `${global.adp.path}/setup/schema_base_assembly.json`;
    const BaseMicroserviceSchemaJSONPath = `${global.adp.path}/setup/schema_base_microservice.json`;
    const userSchemaJSONPath = `${global.adp.path}/setup/schema_user.json`;
    const listOptionsSchemaJSONPath = `${global.adp.path}/setup/schema_listoptions.json`;
    const complianceOptionsSchemaJSONPath = `${global.adp.path}/setup/schema_complianceoptions.json`;
    const rbacGroupSchemaJSONPath = `${global.adp.path}/setup/schema_rbacgroup.json`;
    const rbacPermissionGroupListSchemaPath = `${global.adp.path}/setup/schema_rbacpermissiongrouplist.json`;

    const microserviceSchemaJSON = JSON.parse(global.fs.readFileSync(microserviceSchemaJSONPath, 'utf-8'));
    const baseAssetSchemaJSON = JSON.parse(global.fs.readFileSync(BaseAssetSchemaJSONPath, 'utf-8'));
    const baseMicroserviceSchemaJSON = JSON.parse(global.fs.readFileSync(BaseMicroserviceSchemaJSONPath, 'utf-8'));
    const baseAssemblySchemaJSON = JSON.parse(global.fs.readFileSync(BaseAssemblySchemaJSONPath, 'utf-8'));
    const userSchemaJSON = JSON.parse(global.fs.readFileSync(userSchemaJSONPath, 'utf-8'));
    const listOptionsSchemaJSON = JSON.parse(global.fs.readFileSync(listOptionsSchemaJSONPath, 'utf-8'));
    const complianceOptionsSchemaJSON = JSON.parse(global.fs.readFileSync(complianceOptionsSchemaJSONPath, 'utf-8'));
    const rbacGroupSchemaJSON = JSON.parse(global.fs.readFileSync(rbacGroupSchemaJSONPath, 'utf-8'));
    const rbacPermissionGroupListSchema = JSON.parse(global.fs.readFileSync(rbacPermissionGroupListSchemaPath, 'utf-8'));

    global.adp.config.schema = {};
    global.adp.config.schema.baseAssemblySchema = baseAssemblySchemaJSON;
    global.adp.config.schema.baseAssetSchema = baseAssetSchemaJSON;
    global.adp.config.schema.baseMicroserviceSchema = baseMicroserviceSchemaJSON;
    global.adp.config.schema.microservice = microserviceSchemaJSON.microserviceSchema;
    global.adp.config.schema.document = microserviceSchemaJSON
      .microserviceSchema.definitions.menu_item;
    global.adp.config.schema.user = userSchemaJSON.userSchema;
    global.adp.config.schema.listOptions = listOptionsSchemaJSON.listOptionsSchema;
    global.adp.config.schema.complianceOptions = complianceOptionsSchemaJSON
      .complianceOptionsSchema;
    global.adp.config.schema.rbacGroup = rbacGroupSchemaJSON.rbacGroupSchema;
    global.adp.config.schema.rbacGroupListSchemaJSON = rbacPermissionGroupListSchema
      .rbacPermissionGroupListSchema;
  } catch (ERROR) {
    const errorText = 'Error in (the second) try/catch block';
    const errorOBJ = {
      error: ERROR,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
  }
  // ------------------------------------------------------------------------------------------- //
  try {
    global.adp.config.wordpress = {};
    global.adp.config.wordpress.url = configJSON.wordpress.url;
    global.adp.config.wordpress.tutorials = {};
    global.adp.config.wordpress.tutorials.link = configJSON
      .wordpress.tutorials.link;
    global.adp.config.wordpress.tutorials.requestTimeOutInSeconds = configJSON
      .wordpress.tutorials.requestTimeOutInSeconds;
    global.adp.config.wordpress.tutorials.cacheTimeOutInSeconds = configJSON
      .wordpress.tutorials.cacheTimeOutInSeconds;
    global.adp.config.wordpress.menus = {};
    global.adp.config.wordpress.menus.cacheTimeOutInSeconds = configJSON
      .wordpress.menus.cacheTimeOutInSeconds;
    global.adp.config.wordpress.menus.cacheOfModifiedDateTimeOutInSeconds = configJSON
      .wordpress.menus.cacheOfModifiedDateTimeOutInSeconds;
  } catch (ERROR) {
    global.adp.config.wordpress = {};
    global.adp.config.wordpress.url = 'https://adp.ericsson.se/wordpress/wp-json/wp/v2/';
    global.adp.config.wordpress.tutorials = {};
    global.adp.config.wordpress.tutorials.link = 'https://adp.ericsson.se/wordpress/wp-json/wp/v2/menu/tutorials';
    global.adp.config.wordpress.tutorials.requestTimeOutInSeconds = 3;
    global.adp.config.wordpress.tutorials.cacheTimeOutInSeconds = 0.5;
    global.adp.config.wordpress.menus = {};
    global.adp.config.wordpress.menus.cacheTimeOutInSeconds = 86400;
    global.adp.config.wordpress.menus.cacheOfModifiedDateTimeOutInSeconds = 60;
    const errorText = 'Error in (the third) try/catch block';
    const errorOBJ = {
      error: ERROR,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
  }
  // ------------------------------------------------------------------------------------------- //
  try {
    global.adp.config.artifactoryDiskCacheTimeOutInSeconds = configJSON
      .artifactoryDiskCacheTimeOutInSeconds ? configJSON
        .artifactoryDiskCacheTimeOutInSeconds : 60;
  } catch (ERROR) {
    const errorText = 'Error in (the fourth) try/catch block';
    const errorOBJ = {
      error: ERROR,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
    global.adp.config.artifactoryDiskCacheTimeOutInSeconds = 60;
  }
  // ------------------------------------------------------------------------------------------- //
  try {
    global.adp.config.artifactoryCheckDiskCacheTimeOutInSeconds = configJSON
      .artifactoryCheckDiskCacheTimeOutInSeconds ? configJSON
        .artifactoryCheckDiskCacheTimeOutInSeconds : 120;
  } catch (ERROR) {
    const errorText = 'Error in (the fifth) try/catch block';
    const errorOBJ = {
      error: ERROR,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
    global.adp.config.artifactoryCheckDiskCacheTimeOutInSeconds = 120;
  }
  // ------------------------------------------------------------------------------------------- //
  global.adp.config.contributorsStatistics = {};

  global.adp.config.contributorsStatistics.gerritApi = configJSON
    && configJSON.contributorsStatistics
    && configJSON.contributorsStatistics.gerritApi
    ? configJSON.contributorsStatistics.gerritApi
    : 'https://gerrit-gamma.gic.ericsson.se/a/changes/?o=DETAILED_ACCOUNTS&q=status:merged+branch:"master"+after:"|||:AFTERDATE:|||+00:00:00"+before:"|||:BEFOREDATE:|||+23:59:59"+project:"|||:PROJECTNAME:|||"';

  global.adp.config.contributorsStatistics.gerritPotentialTag = configJSON
    && configJSON.contributorsStatistics
    && configJSON.contributorsStatistics.gerritPotentialTag
    ? configJSON.contributorsStatistics.gerritPotentialTag
    : 'https://gerrit-gamma.gic.ericsson.se/a/changes/?o=DETAILED_ACCOUNTS&o=CURRENT_REVISION&q=status:merged+branch:"master"+after:"|||:AFTERDATE:|||+00:00:00"+before:"|||:BEFOREDATE:|||+23:59:59"+message:"innersource"+project:"|||:PROJECTNAME:|||"';

  global.adp.config.contributorsStatistics.gerritApiRevisionDetail = configJSON
    && configJSON.contributorsStatistics
    && configJSON.contributorsStatistics.gerritApiRevisionDetail
    ? configJSON.contributorsStatistics.gerritApiRevisionDetail
    : 'https://gerrit-gamma.gic.ericsson.se/a/changes/|||:COMMITID:|||/revisions/|||:COMMITREVISION:|||/commit/';
  // ------------------------------------------------------------------------------------------- //
  if (typeof configJSON.innersourceLaunchDate === 'string') {
    global.adp.config.innersourceLaunchDate = configJSON.innersourceLaunchDate;
  } else {
    global.adp.config.innersourceLaunchDate = '2020-12-12';
  }
  // ------------------------------------------------------------------------------------------- //
  /**
  * Internal. Retrieve values from masterCacheTimeOutInSeconds object.
  * @param {String} NAME The name of the object.
  * @param {Integer} DEFAULT Default value, if none was found.
  * @returns {Number} Returns the value to be used.
  * @author Armando Dias [zdiaarm]
  */
  const getTimeOutMasterCache = (NAME, DEFAULT) => {
    try {
      const value = configJSON.masterCacheTimeOutInSeconds[NAME];
      if (value <= 0) {
        return 0.1;
      }
      if (value > 0) {
        return value;
      }
      return DEFAULT;
    } catch (ERROR) {
      const errorText = 'Error in try/catch block in [ getTimeOutMasterCache ]';
      const errorOBJ = {
        name: NAME,
        defaultValue: DEFAULT,
        message: 'Using default value because the value was not found in config.json',
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      return DEFAULT;
    }
  };
  // ------------------------------------------------------------------------------------------- //
  /**
  * Internal. Retrieve values from requestTimeoutsInSeconds object.
  * @param {String} NAME The name of the object.
  * @param {Integer} DEFAULT Default value, if none was found.
  * @returns {Number} Returns the value to be used.
  * @author Armando Dias [zdiaarm]
  */
  const getTimeOut = (NAME, DEFAULT) => {
    try {
      const value = configJSON.requestTimeoutsInSeconds[NAME];
      if (value <= 0) {
        return 0.1;
      }
      if (value > 0) {
        return value;
      }
      return DEFAULT;
    } catch (ERROR) {
      const errorText = 'Error in try/catch block in [ getTimeOut ]';
      const errorOBJ = {
        name: NAME,
        defaultValue: DEFAULT,
        message: 'Using default value because the value was not found in config.json',
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      return DEFAULT;
    }
  };
  // ------------------------------------------------------------------------------------------- //
  global.adp.masterCacheTimeOut = {};
  global.adp.masterCacheTimeOut.JWTStrategyHandler = getTimeOutMasterCache('JWTStrategyHandler', 60);
  global.adp.masterCacheTimeOut.listOptions = getTimeOutMasterCache('listOptions', 86400);
  global.adp.masterCacheTimeOut.listOptionsNormalised = getTimeOutMasterCache('listOptionsNormalised', 86400);
  global.adp.masterCacheTimeOut.listOptionsAdminOnly = getTimeOutMasterCache('listOptionsAdminOnly', 86400);
  global.adp.masterCacheTimeOut.allAssets = getTimeOutMasterCache('allAssets', 86400);
  global.adp.masterCacheTimeOut.allAssetsNormalised = getTimeOutMasterCache('allAssetsNormalised', 60);
  global.adp.masterCacheTimeOut.msAnalytics = getTimeOutMasterCache('msAnalytics', 60);
  global.adp.masterCacheTimeOut.PRAVersion = getTimeOutMasterCache('PRAVersion', 60);
  global.adp.masterCacheTimeOut.marketPlaceSearch = getTimeOutMasterCache('marketPlaceSearch', 0.5);
  global.adp.masterCacheTimeOut.innersourceContribsSearch = getTimeOutMasterCache('innersourceContribsSearch', 0.5);
  global.adp.masterCacheTimeOut.innersourceContribs = getTimeOutMasterCache('innersourceContribs', 0.5);
  global.adp.masterCacheTimeOut.msListByOwner = getTimeOutMasterCache('msListByOwner', 0.5);
  global.adp.masterCacheTimeOut.searchLDAPUser = getTimeOutMasterCache('searchLDAPUser', 60);
  global.adp.masterCacheTimeOut.tagsReload = getTimeOutMasterCache('tagsReload', 86400);
  global.adp.masterCacheTimeOut.thisUserShouldBeInDatabase = getTimeOutMasterCache('thisUserShouldBeInDatabase', 60);
  global.adp.masterCacheTimeOut.documents = getTimeOutMasterCache('documents', 60);
  global.adp.masterCacheTimeOut.minimumGarbageCollectorCall = getTimeOutMasterCache('minimumGarbageCollectorCall', 60);
  global.adp.masterCacheTimeOut.userProgressTutorials = getTimeOutMasterCache('userProgressTutorials', 0.5);
  global.adp.masterCacheTimeOut.allusers = getTimeOutMasterCache('allusers', 30);
  global.adp.masterCacheTimeOut.rbacPermissionIds = getTimeOutMasterCache('rbacPermissionIds', 60);
  global.adp.masterCacheTimeOut.releaseSettings = getTimeOutMasterCache('releaseSettings', 30);

  // ------------------------------------------------------------------------------------------- //
  global.adp.requestTimeoutsInSeconds = {};
  global.adp.requestTimeoutsInSeconds.artifactoryRepo = getTimeOut('artifactoryRepo', 3);
  // ------------------------------------------------------------------------------------------- //

  const tutorialsMessage = `WPTutorials [ ${adp.config.wordpress.tutorials.link} ]`;
  adp.echoLog(tutorialsMessage, null, 200, packName, false);

  let mongoMessage = `MongoDB [ ${adp.config.mongodb} ]`;
  mongoMessage = mongoMessage.replace(/\/\/([\S])+@/gim, '//<< HIDDEN-USER >>:<< HIDDEN-PASSWORD >>@');
  adp.echoLog(mongoMessage, null, 200, packName, false);

  // ------------------------------------------------------------------------------------------- //
  adp.config.database = require('./dataBaseSetup.json').dataBaseSetup;
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
