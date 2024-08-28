// ============================================================================================= //
/**
* [ adp.backendStarted ]
* Creates an Entry on AdpLog
* to register the start of the
* Backend in the Database.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = async () => {
  const adpLogModel = new adp.models.AdpLog();
  const adpLogStart = {
    type: 'server',
    backend_mode: adp && adp.config && adp.config.runnerMode ? adp.config.runnerMode : 'Not Available',
    datetime: new Date(),
    desc: `${global.version}`,
    environmentSetup: {
      url: adp
        && adp.config
        && adp.config.siteAddress
        ? adp.config.siteAddress : 'Not Available',
      functionalSecrets: {
        userLength: process.env.PORTAL_FUNC_USER
          ? process.env.PORTAL_FUNC_USER.length : 0,
        passwordLength: process.env.PORTAL_FUNC_USER_PASSWORD
          ? process.env.PORTAL_FUNC_USER_PASSWORD.length : 0,
      },
      LDAP: adp && adp.config && adp.config.ldap
        ? {
          url: adp.config.ldap.url ? adp.config.ldap.url : 'Not Available',
          bindDN: adp.config.ldap.bindDN ? adp.config.ldap.bindDN : 'Not Available',
          searchBase: adp.config.ldap.searchBase ? adp.config.ldap.searchBase : 'Not Available',
          searchFilter: adp.config.ldap.searchFilter ? adp.config.ldap.searchFilter : 'Not Available',
          timeout: adp.config.ldap.timeout ? adp.config.ldap.timeout : 'Not Available',
          connectTimeout: adp.config.ldap.connectTimeout ? adp.config.ldap.connectTimeout : 'Not Available',
          reconnect: adp.config.ldap.reconnect ? adp.config.ldap.reconnect : 'Not Available',
          bindCredentialsLength: adp.config.ldap.bindCredentials ? adp.config.ldap.bindCredentials.length : 'Not Available',
        } : 'Not Available',
      MongoDB: {
        connection: adp && adp.config && adp.config.mongodb
          ? adp.config.mongodb.replace(/\/\/([\S])+@/gim, '//<< HIDDEN-USER >>:<< HIDDEN-PASSWORD >>@') : 'Not Available',
      },
      ElasticSearch: {
        url: adp
        && adp.config
        && adp.config.elasticSearchAddress
          ? adp.config.elasticSearchAddress : 'Not Available',
        contentIndex: adp
        && adp.config
        && adp.config.elasticSearchWordpressIndex
          ? adp.config.elasticSearchWordpressIndex : 'Not Available',
        microservicesIndex: adp
        && adp.config
        && adp.config.elasticSearchMicroservicesIndex
          ? adp.config.elasticSearchMicroservicesIndex : 'Not Available',
        microserviceDocumentationIndex: adp
        && adp.config
        && adp.config.elasticSearchMsDocumentationIndex
          ? adp.config.elasticSearchMsDocumentationIndex : 'Not Available',
      },
      MySQL: adp
        && adp.config
        && adp.config.mssqldb
        ? {
          userLength: adp.config.mssqldb.user
            ? adp.config.mssqldb.user.length : 'Not Available',
          passwordLength: adp.config.mssqldb.password
            ? adp.config.mssqldb.password.length : 'Not Available',
          server: adp.config.mssqldb.server,
          encrypt: adp.config.mssqldb.encrypt,
          database: adp.config.mssqldb.database,
          trustServerCertificate: adp.config.mssqldb.trustServerCertificate,
        } : 'Not Available',
      Wordpress: {
        url: adp
        && adp.config
        && adp.config.wordpress
        && adp.config.wordpress.url
          ? adp.config.wordpress.url : 'Not Available',
        tutorialsLink: adp
        && adp.config
        && adp.config.wordpress
        && adp.config.wordpress.tutorials
        && adp.config.wordpress.tutorials.link
          ? adp.config.wordpress.tutorials.link : 'Not Available',
      },
      contributorsStatistics: {
        gerritAPI: adp
        && adp.config
        && adp.config.contributorsStatistics
        && adp.config.contributorsStatistics.gerritApi
          ? adp.config.contributorsStatistics.gerritApi : 'Not Available',
        gerritPotentialTag: adp
        && adp.config
        && adp.config.contributorsStatistics
        && adp.config.contributorsStatistics.gerritPotentialTag
          ? adp.config.contributorsStatistics.gerritPotentialTag : 'Not Available',
        gerritApiRevisionDetail: adp
        && adp.config
        && adp.config.contributorsStatistics
        && adp.config.contributorsStatistics.gerritApiRevisionDetail
          ? adp.config.contributorsStatistics.gerritApiRevisionDetail : 'Not Available',
      },
      asciiDoctorService: {
        url: adp
        && adp.config
        && adp.config.asciidoctorService
          ? adp.config.asciidoctorService : 'Not Available',
      },
      AzureSetup: adp
        && adp.config
        && adp.config.azure
        ? {
          url: adp.config.azure.url,
          grant_type: adp.config.azure.grant_type,
          resource: adp.config.azure.resource,
        } : 'Not Available',
      PeopleFinder: {
        url: adp
        && adp.config
        && adp.config.peopleFinderApiUrl
          ? adp.config.peopleFinderApiUrl : 'Not Available',
      },
      ADPHelmDataFile: adp
        && adp.config
        && adp.config.adpHelmDataFile
        ? adp.config.adpHelmDataFile : 'Not Available',

    },
  };
  await adpLogModel.createOne(adpLogStart)
    .then(() => {})
    .catch((ERROR) => {
      adp.echoLog(`[+${adp.timeStepNext()}] Error on creating the start adpLog!`, ERROR, 500, null, false);
    });
  return true;
};
// ============================================================================================= //
