// ============================================================================================= //
/**
* [ global.adp.routes ]
* Set [ global.express ] before and then call [ global.adp.routes ] and he will take care of the
* HTTP/HTTPS routes, calling the right methods/functions and answering the requests.
* @author Armando Schiavon Dias [escharm], Veerender Voskula [zvosvee]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const { errors, celebrate } = require('celebrate');
// const validateField = require('./endpoints/validateField/validate');
const {
  hasRole, isUserInDB, rbac, frontEndVersionSync, isMicroserviceValidBySlug,
} = require('../middleware');
const { ROLE } = require('../library/utils/constants');
const userPermissionGroupUpdate = require('./endpoints/userPermissionGroup/update');
const innerSourceContributions = require('./endpoints/innersource/contributions');
const listoptionsCleanGet = require('./endpoints/listOptions/getClean');
const getReleaseSettings = require('./endpoints/releaseSettings/get');

const assignUserWithRbacSchema = require('../schemas/assignUserWithRBAC');
const listoptionsCleanGetSchema = require('../schemas/listoptions');
const innerSourceContributorsSchema = require('../schemas/innerSourceContributorsSchema');
const innerSourceChangeBehavior = require('../schemas/innerSourceChangeBehavior');
const fetchUsersBySignumSchema = require('../schemas/users/fetchUsersBySignum');
const microserviceElasticsearchDocumentationSyncSchema = require('../schemas/microserviceElasticsearchDocumentationSyncSchema');
const getComponentServicesFromAssemblySchema = require('../schemas/getComponentServicesFromAssemblySchema');
const reportAssemblySchema = require('../schemas/reportAssemblySchema');
const reportAssetsSchema = require('../schemas/reportAssetsSchema');
const { microserviceDocumentVersionCpiDefault } = require('../schemas/microserviceSchema');
const { joiValidator } = require('../middleware/validations/joi.validator');
const HeaderInterceptor = require('../middleware/HeaderInterceptor');

module.exports = async () => {
  await global.adp.access.setupPassport();

  global.express.use(global.bodyParser.json());
  global.express.use(global.bodyParser.urlencoded({ extended: false }));
  global.express.use(global.passport.initialize());

  // Compress the response from request which contain the header
  global.express.use(global.compression({
    filter: (req, res) => {
      if (req.headers['x-compression']) {
        return global.compression.filter(req, res);
      }
      return false;
    },
  }));

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  await adp.swaggerSetup.clientOptions();
  global.express.use(
    '/client-docs',
    global.swaggerUiClient.serveFiles(global.swaggerClient),
    global.swaggerUiClient.setup(global.swaggerClient),
  );
  await adp.swaggerSetup.options();
  global.express.use(
    '/api-docs',
    global.swaggerUi.serveFiles(global.swagger),
    global.swaggerUi.setup(global.swagger),
  );
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

  global.express.use(async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Max-Age', '-1');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, remember-me, cache-control, expires, pragma, api-deployment-version, X-Compression, X-Prune-Microservice');
    const headerInterceptor = new HeaderInterceptor(res);
    await headerInterceptor.setBanner();

    const frontEndVersionSyncReset = frontEndVersionSync(req, res);
    if (frontEndVersionSyncReset) {
      res.sendStatus(426);
    } else if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  global.express.use(global.apiMetrics({ metricsPath: '/nativemetrics', metricsPrefix: 'api_gateway_metrics' }));

  global.express.use('/dump',
    (REQ, RES) => global.adp.endpoints.dump.anything(REQ, RES));

  global.express.get('/tagsCounter/:searchLevel1?/:searchLevel2?',
    (REQ, RES) => global.adp.endpoints.tagsCounter.get(REQ, RES));

  // global.express.use(logger(':remote-addr - :remote-user [:date[clf]] ":method
  // :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'))
  /*
  global.express.use('/login',
    global.passport.authenticate('ldapauth', { session: false }),
    global.adp.endpoints.login.post);
  */

  global.express.use('/diskcachefiles',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.diskcachefiles.get(REQ, RES));

  global.express.use('/cleardiskcachefiles',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.diskcachefiles.clear(REQ, RES));

  global.express.use('/cache/:obj?/:item?',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    (REQ, RES) => global.adp.endpoints.cache.get(REQ, RES, false));

  global.express.get('/clearDocumentsElasticSearch/:id?',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    (REQ, RES) => adp.endpoints.clearDocumentsElasticSearch.clear(REQ, RES));

  global.express.use('/fullcache/:obj?/:item?',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    (REQ, RES) => global.adp.endpoints.cache.get(REQ, RES, true));

  global.express.use('/clearcache/:obj?',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    (REQ, RES) => global.adp.endpoints.cache.clear(REQ, RES));

  global.express.use('/contributions/mode/:tag?',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    joiValidator(innerSourceChangeBehavior, 'params'),
    (REQ, RES) => adp.endpoints.contributions.change(REQ, RES));

  global.express.use('/innersourcebytagstatus',
    (REQ, RES) => adp.endpoints.innersourcebytagstatus.get(REQ, RES));

  global.express.use('/login',
    (REQ, RES) => global.adp.endpoints.login.post(REQ, RES));

  global.express.use('/clientDocs/login',
    (REQ, RES) => global.adp.endpoints.clientDocs.login(REQ, RES));

  global.express.get('/metrics', (REQ, RES) => global.adp.endpoints.metrics.register(REQ, RES));

  global.express.get('/logged',
    global.passport.authenticate('jwt', { session: false }),
    global.adp.endpoints.logged.get);

  global.express.post('/logged',
    global.passport.authenticate('jwt', { session: false }),
    global.adp.endpoints.logged.post);

  global.express.get('/',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.root.get(REQ, RES));

  global.express.get('/version',
    (REQ, RES) => global.adp.endpoints.version.get(REQ, RES));

  global.express.get('/doc/:a?/:p?/:s?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.doc.get(REQ, RES));

  global.express.get('/document/:msSlug/:ver/:cat/:doc/:sub?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.document.get(REQ, RES));

  global.express.post('/microservice',
    global.passport.authenticate('jwt', { session: false }),
    celebrate(microserviceDocumentVersionCpiDefault),
    global.adp.endpoints.microservice.create);

  global.express.get('/microservice/checkname/:name?/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.microservice.checkname(REQ, RES));

  global.express.get('/microservice/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.microservice.read(REQ, RES));

  global.express.get('/microservice/integration-token/:id',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.microservice.integrationToken(REQ, RES));

  global.express.put('/microservice/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    celebrate(microserviceDocumentVersionCpiDefault),
    global.adp.endpoints.microservice.update);

  global.express.delete('/microservice/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    global.adp.endpoints.microservice.delete);

  global.express.get('/microservices',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT, true),
    (REQ, RES, NEXT) => (new adp.middleware
      .RBACContentPermissionAsEndpointPermissionClass('/marketplace'))
      .process(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.microservices.get(REQ, RES));

  // ======= Get List of Microservices with name and Ids ================= //
  global.express.get('/microserviceList',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.microservices.getMicroserviceList(REQ, RES));

  global.express.get('/documentSyncStatus',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => adp.endpoints.documentSyncStatus.get(REQ, RES));

  global.express.get('/documentSyncStatusDetails',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => adp.endpoints.documentSyncStatusDetails.get(REQ, RES));

  global.express.get('/contentsearch',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT, true),
    (REQ, RES) => adp.endpoints.contentSearch.get(REQ, RES));

  global.express.get('/realtime-contentsearch',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac.cache(REQ, RES, NEXT),
    (REQ, RES) => adp.endpoints.realtimeContentSearch.get(REQ, RES));

  global.express.post('/microservices-by-owner',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    global.adp.endpoints.microservices.getByOwner);

  global.express.post('/assemblies-by-owner',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    global.adp.endpoints.microservices.getByOwner);

  global.express.post('/elasticSearchSync/msDocForceSync',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    joiValidator(microserviceElasticsearchDocumentationSyncSchema),
    (REQ, RES) => adp.endpoints.elasticSync.msDocForceSync(REQ, RES));

  global.express.get('/user/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.user.read(REQ, RES));

  global.express.post('/fetchUsersBySignum',
    global.passport.authenticate('jwt', { session: false }),
    joiValidator(fetchUsersBySignumSchema),
    (REQ, RES) => adp.endpoints.users.fetchUsersBySignum(REQ, RES));

  global.express.post('/user/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.user.create(REQ, RES));

  global.express.post('/userprogress/:wid?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.userProgress.post(REQ, RES));

  global.express.delete('/userprogress/:wid?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.userProgress.delete(REQ, RES));

  global.express.get('/tutorialsmenu',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.tutorialsMenu.get(REQ, RES));

  global.express.get('/tutorialBySlug/:slug?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.tutorials.getBySlug(REQ, RES));

  global.express.put('/user/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.user.update(REQ, RES));

  global.express.post('/playground',
    global.passport.authenticate('jwt', { session: false }),
    global.adp.endpoints.playground.post);

  global.express.get('/auditlog/:id',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.auditlog.get(REQ, RES));

  global.express.get('/auditlogs/:typeoroption?/:id?/:optiontype?/:optiontypeid?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.auditlogs.get(REQ, RES));

  global.express.get('/searchldapuser/:user?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.searchLdapUser.get(REQ, RES));

  global.express.get('/userbysignum/:uid?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.userbysignum.get(REQ, RES));

  global.express.get('/tags/:searchLevel1?/:searchLevel2?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.tags.get(REQ, RES));

  // global.express.get('/restdoc',
  //  (REQ, RES) => global.adp.endpoints.restdoc.get(REQ, RES));

  global.express.get('/users',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.users.get(REQ, RES));

  global.express.get('/usersWithPermissions',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.users.getUsersWithPermissions(REQ, RES));

  global.express.put('/users/:id/permissions',
    global.passport.authenticate('jwt', { session: false }),
    joiValidator(assignUserWithRbacSchema),
    hasRole(ROLE.ADMIN),
    (REQ, RES, NEXT) => isUserInDB(REQ.params.id, RES, NEXT),
    userPermissionGroupUpdate);

  // Image Static Folder, using Express
  // global.express.use('/images', global.expressClass.static(`${global.adp.path}/static/images/`));

  // HTML Static Folder, using own Method
  global.express.get('/html/:folder/:filename',
    (REQ, RES) => global.adp.endpoints.html.get(REQ, RES));

  // HTML Preview Static Folder, using own Method
  global.express.get('/html/preview/:folder/:filename',
    (REQ, RES) => global.adp.endpoints.html.get(REQ, RES));

  // Image Static Folder, using own Method
  global.express.get('/images/:filename',
    (REQ, RES) => global.adp.endpoints.images.get(REQ, RES));

  // Image Static Folder, using own Method
  global.express.get('/images/:folder/:filename',
    (REQ, RES) => global.adp.endpoints.images.get(REQ, RES));

  global.express.get('/microserviceAnalytics/:msSlug?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.microserviceAnalytics.get(REQ, RES));

  global.express.get('/getPraVersion/:msSlug?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.microserviceAnalytics.getPraVersion(REQ, RES));

  global.express.get('/report/serviceowners',
    (REQ, RES) => global.adp.endpoints.report.getServiceOwners(REQ, RES));

  global.express.get('/report/teammembers',
    (REQ, RES) => global.adp.endpoints.report.getTeamMembers(REQ, RES));

  global.express.get('/report/getErrorsFromContributors',
    (REQ, RES) => global.adp.endpoints.report.getErrorsFromContributors(REQ, RES));

  global.express.post('/report/assets/:format',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    joiValidator(reportAssetsSchema),
    (REQ, RES) => global.adp.endpoints.report.assets(REQ, RES));

  global.express.post('/report/assembly/:format',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    joiValidator(reportAssemblySchema),
    (REQ, RES) => global.adp.endpoints.report.assembly(REQ, RES));

  global.express.get('/report/creatorbydomain/:domaincode',
    (REQ, RES) => global.adp.endpoints.report.creatorByDomain(REQ, RES));

  global.express.get('/report/innersourceData/:fromDate/:toDate?',
    (REQ, RES) => global.adp.endpoints.report.innersourceData(REQ, RES));

  global.express.get('/migrationscripts',
    (REQ, RES) => global.adp.endpoints.migrationscripts.get(REQ, RES));

  global.express.get('/listoptions',
    (REQ, RES) => global.adp.endpoints.listOptions.get(REQ, RES));

  global.express.post('/listoptionsclean',
    joiValidator(listoptionsCleanGetSchema),
    listoptionsCleanGet);

  global.express.get('/complianceoptions',
    (REQ, RES) => global.adp.endpoints.complianceOptions.get(REQ, RES));

  global.express.get('/peoplefinder/person/:signum',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.peopleFinder.getPerson(REQ, RES));

  global.express.get('/peoplefinder/functionalUser/:signum',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.peopleFinder.getFunctionalUser(REQ, RES));

  global.express.get('/peoplefinder/pdl/:mailNickname',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.peopleFinder.getPdlDetails(REQ, RES));

  global.express.get('/peoplefinder/mailerTeam',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.peopleFinder.getPdlMembers(REQ, RES));

  global.express.post('/teamHistory/updateByMsList',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => adp.endpoints.teamHistory.checkTeamChanges(REQ, RES));

  global.express.get('/releaseSettings/:key?',
    global.passport.authenticate('jwt', { session: false }),
    getReleaseSettings);

  global.express.get('/clientDocs/microservice/:id?/:version?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => adp.endpoints.clientDocs.getDocumentList(REQ, RES));

  global.express.get('/clientDocs/test/:id?/:version?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => adp.endpoints.clientDocs.test(REQ, RES));

  global.express.get('/marketplace/microservice/:id?/:version?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => adp.endpoints.marketplace.getDocumentList(REQ, RES));

  global.express.get('/assets/:assetSlug?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.assets.getAsset(REQ, RES));

  // === ASSEMBLY ENDPOINTS :: BEGIN ======================================================= //
  global.express.post('/assembly',
    global.passport.authenticate('jwt', { session: false }),
    celebrate(microserviceDocumentVersionCpiDefault),
    global.adp.endpoints.assembly.create);

  global.express.get('/assembly/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => global.adp.endpoints.assembly.read(REQ, RES));

  global.express.put('/assembly/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    celebrate(microserviceDocumentVersionCpiDefault),
    global.adp.endpoints.assembly.update);

  global.express.delete('/assembly/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    global.adp.endpoints.assembly.delete);

  global.express.post('/assembly/getComponentServicesFromAssembly',
    global.passport.authenticate('jwt', { session: false }),
    joiValidator(getComponentServicesFromAssemblySchema),
    (REQ, RES) => adp.endpoints.assembly.getComponentServicesFromAssembly(REQ, RES));
  // === ASSEMBLY ENDPOINTS :: END ========================================================= //

  // === PERMISSIONS' ENDPOINTS :: BEGIN ======================================================= //

  global.express.post('/permission',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.permission.postCreate(REQ, RES));

  global.express.get('/permission/:uid?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.permission.getRead(REQ, RES));

  global.express.put('/permission',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.permission.putUpdate(REQ, RES));

  global.express.delete('/permission',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.permission.delete(REQ, RES));

  global.express.put('/permission/changeUserPermissions',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.permission.changeUserPermissions(REQ, RES));

  // === PERMISSIONS' ENDPOINTS :: END ========================================================= //

  // === PROFILES' ENDPOINTS :: BEGIN ======================================================= //

  global.express.get('/profile/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.profile.get(REQ, RES));

  global.express.put('/profile/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => global.adp.endpoints.profile.update(REQ, RES));

  // === PROFILES' ENDPOINTS :: END ========================================================= //

  // === INTEGRATION' ENDPOINTS :: BEGIN ======================================================= //

  global.express.get('/integration/:version/',
    (REQ, RES) => global.adp.endpoints.integration.documentation(REQ, RES));

  global.express.post('/integration/:version/microservice/documentrefresh/:versionTarget?',
    (REQ, RES, NEXT) => {
      const newREQ = REQ;
      // The process is intercepted here to adjust the token position
      // in the headers in case the token comes by "access_token" query parameter.
      // Rule: In case of two, the Token from headers will prevail.
      if (typeof newREQ.query.access_token === 'string' && newREQ.query.access_token.length > 0) {
        if (newREQ.headers.authorization === undefined) {
          newREQ.headers.authorization = (`Bearer ${newREQ.query.access_token}`).trim();
        }
      }
      return global.passport.authenticate('jwt-integration', { session: false })(newREQ, RES, NEXT);
    }, (REQ, RES) => global.adp.endpoints.integration.documentRefresh(REQ, RES));

  // === INTEGRATION' ENDPOINTS :: END ========================================================= //

  // === VALIDATE ARTIFACTORY URLs' ENDPOINTS :: BEGIN ========================================== //

  // global.express.post('/validate/:field?/:updateDb?',
  //   global.passport.authenticate('jwt', { session: false }),
  //   validateField);

  // === VALIDATE ARTIFACTORY URLs' ENDPOINTS :: END ============================================ //
  global.express.get('/tutorialAnalytics',
    (REQ, RES) => global.adp.endpoints.metrics.tutorialAnalytics(REQ, RES));

  global.express.get('/analytics/innersource',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => adp.endpoints.contributions.get(REQ, RES));

  global.express.get('/innersourcelaststatus/:id?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => adp.endpoints.innerSourceLastStatus.get(REQ, RES));

  global.express.get('/contributorsstatistics/:id?',
    (REQ, RES) => adp.endpoints.contributorsStatistics.get(REQ, RES));

  global.express.get('/contributorsstatisticsprogress/:id?',
    (REQ, RES) => adp.endpoints.contributorsstatisticsprogress.get(REQ, RES));

  global.express.get('/report/innersource',
    (REQ, RES) => adp.endpoints.innerSourceReport.get(REQ, RES));

  global.express.get('/innersourceUserHistory/:signum?/:date?',
    (REQ, RES) => adp.endpoints.innersourceUserHistory.get(REQ, RES));

  global.express.delete('/innersourcebydaterangesignummsid',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => isUserInDB(REQ.query.signum, RES, NEXT),
    (REQ, RES, NEXT) => isMicroserviceValidBySlug(REQ.query.msslug, RES, NEXT),
    (REQ, RES) => adp.endpoints.innersourcebydaterangesignummsid.delete(REQ, RES));

  global.express.get('/innersource/contributors',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT, true),
    (REQ, RES, NEXT) => (new adp.middleware
      .RBACContentPermissionAsEndpointPermissionClass([
        '/innersourceContributions/contributors',
        '/innersourceContributions/organisations',
      ]))
      .process(REQ, RES, NEXT),
    joiValidator(innerSourceContributorsSchema, 'query'),
    (REQ, RES) => innerSourceContributions(REQ, RES, 'contributors'));

  global.express.get('/innersource/organisations',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT, true),
    (REQ, RES, NEXT) => (new adp.middleware
      .RBACContentPermissionAsEndpointPermissionClass([
        '/innersourceContributions/contributors',
        '/innersourceContributions/organisations',
      ]))
      .process(REQ, RES, NEXT),
    joiValidator(innerSourceContributorsSchema, 'query'),
    (REQ, RES) => innerSourceContributions(REQ, RES, 'organisations'));

  global.express.get('/wordpress/menus/:slug?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    adp.endpoints.wordpress.getMenus);

  // =================DYNAMIC SITE MAP ENDPOINTS============================== //
  global.express.get('/sitemap',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => adp.endpoints.siteMap.get(REQ, RES));

  // === RBAC ENDPOINTS ======================================================= //
  global.express.post('/rbac/preview',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => adp.endpoints.rbac.preview(REQ, RES));

  global.express.post('/rbac/group',
    global.passport.authenticate('jwt', { session: false }),
    rbac.authenticator,
    (REQ, RES) => adp.endpoints.rbac.post(REQ, RES));

  global.express.post('/rbac/group/duplicate',
    global.passport.authenticate('jwt', { session: false }),
    rbac.authenticator,
    (REQ, RES) => adp.endpoints.rbac.postDuplicate(REQ, RES));

  global.express.get('/rbac/group',
    global.passport.authenticate('jwt', { session: false }),
    rbac.authenticator,
    (REQ, RES) => adp.endpoints.rbac.get(REQ, RES));

  global.express.put('/rbac/group',
    global.passport.authenticate('jwt', { session: false }),
    rbac.authenticator,
    (REQ, RES) => adp.endpoints.rbac.put(REQ, RES));

  global.express.delete('/rbac/group/:groupId',
    global.passport.authenticate('jwt', { session: false }),
    rbac.authenticator,
    (REQ, RES) => adp.endpoints.rbac.delete(REQ, RES));

  global.express.get('/queue/:id?',
    (REQ, RES) => adp.endpoints.queue.check(REQ, RES));

  global.express.get('/queuestatus/',
    (REQ, RES) => adp.endpoints.queue.status(REQ, RES));

  global.express.get('/queuethreadreset/',
    (REQ, RES) => adp.endpoints.queue.thread(REQ, RES));

  global.express.get('/queuestart/',
    (REQ, RES) => adp.endpoints.queue.start(REQ, RES));

  global.express.get('/queueisfree/',
    (REQ, RES) => adp.endpoints.queue.free(REQ, RES));

  // === WP PROXY ENDPOINT ===================================================================== //

  global.express.all('/wpcontent/:wppath?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => (new adp.middleware.RBACContentPreparationClass()).process(REQ, RES, NEXT),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT),
    (REQ, RES) => adp.endpoints.wpcontent.get(REQ, RES));

  // === COMMENTS ENDPOINT ===================================================================== //

  global.express.get('/comments/',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT, true),
    (REQ, RES) => adp.endpoints.comments.get(REQ, RES));

  global.express.post('/comments/',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT, true),
    (REQ, RES) => adp.endpoints.comments.post(REQ, RES));

  global.express.put('/comments/',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT, true),
    (REQ, RES) => adp.endpoints.comments.put(REQ, RES));

  global.express.put('/comments/resolve',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT, true),
    (REQ, RES) => adp.endpoints.comments.resolve(REQ, RES));

  global.express.delete('/comments/',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES, NEXT) => adp.middleware.rbac(REQ, RES, NEXT, true),
    (REQ, RES) => adp.endpoints.comments.delete(REQ, RES));

  // === INTEGRATION ENDPOINT ================================================================== //

  global.express.get('/configForIntegration',
    (REQ, RES) => adp.endpoints.configForIntegration.get(REQ, RES));

  global.express.get('/mimer/updateDocumentMenu/:MSIDORSLUG?',
    (REQ, RES) => adp.endpoints.mimer.updateDocumentMenu(REQ, RES));

  global.express.get('/mimer/mimerGetVersion/:PRODUCTNUMBER?',
    global.passport.authenticate('jwt', { session: false }),
    (REQ, RES) => adp.endpoints.mimer.mimerGetVersion(REQ, RES));

  global.express.post('/mimer/refreshToken',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    (REQ, RES) => adp.endpoints.mimer.token(REQ, RES));

  global.express.get('/mimer/autorefreshtoken',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    (REQ, RES) => adp.endpoints.mimer.autoRefreshToken(REQ, RES));

  global.express.get('/mimer/deleteToken',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    (REQ, RES) => adp.endpoints.mimer.deleteToken(REQ, RES));

  global.express.get('/mimer/mimerSync',
    (REQ, RES) => adp.endpoints.mimer.mimerSync(REQ, RES));

  // =========================================================================================== //

  global.express.get('/egssync/trigger',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    (REQ, RES) => adp.endpoints.egsSync.trigger(REQ, RES));

  // =========== Get versions based on microservice  ====================== //
  global.express.get('/getallversions/:msId?',
    global.passport.authenticate('jwt', { session: false }),
    hasRole(ROLE.ADMIN),
    (REQ, RES) => global.adp.endpoints.microservice.getVersionsByMS(REQ, RES));

  /* eslint-disable no-else-return */
  // eslint-disable-next-line consistent-return
  global.express.post('/msManualSync/trigger', (REQ, RES, NEXT) => {
    const newREQ = REQ;
    const selectedVersion = REQ && REQ.body && REQ.body.selectedVersion
      ? REQ.body.selectedVersion : null;
    newREQ.params.versionTarget = selectedVersion;

    // The process is intercepted here to adjust the accessToken position
    if (typeof newREQ.body.accessToken === 'string' && newREQ.body.accessToken.length > 0) {
      newREQ.headers.authorization = (`Bearer ${newREQ.body.accessToken}`).trim();
    }
    return global.passport.authenticate('jwt-integration', { session: false })(newREQ, RES, NEXT);
  }, (REQ, RES) => {
    global.adp.endpoints.integration.documentRefresh(REQ, RES);
  });

  // === GET ALL ENDPOINT ====================================================================== //

  global.express.all('/*',
    (REQ, RES) => adp.endpoints.notfound.get(REQ, RES));

  // Always should be after definingroutes
  global.express.use(errors());
};
// ============================================================================================= //
