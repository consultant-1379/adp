// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// ADP Endpoint Scripts
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints = {};
adp.Answers = require('../answers/AnswerClass');
adp.Answers.answerWith = require('../answers/answerWith');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.doc = {};
adp.endpoints.doc.get = require('../routes/endpoints/doc/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.document = {};
adp.endpoints.document.get = require('../routes/endpoints/document/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.contributorsStatistics = {};
adp.endpoints.contributorsStatistics.get = require('../routes/endpoints/contributorsStatistics/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.contributorsstatisticsprogress = {};
adp.endpoints.contributorsstatisticsprogress.get = require('../routes/endpoints/contributorsStatisticsProgress/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.diskcachefiles = {};
adp.endpoints.diskcachefiles.get = require('../routes/endpoints/diskcachefiles/get');
adp.endpoints.diskcachefiles.clear = require('../routes/endpoints/diskcachefiles/clear');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.html = {};
adp.endpoints.html.get = require('../routes/endpoints/html/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.images = {};
adp.endpoints.images.get = require('../routes/endpoints/images/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.innerSourceLastStatus = {};
adp.endpoints.innerSourceLastStatus.get = require('./../routes/endpoints/innerSourceLastStatus/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.innersourcebytagstatus = {};
adp.endpoints.innersourcebytagstatus.get = require('./../routes/endpoints/innersourcebytagstatus/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.innerSourceReport = {};
adp.endpoints.innerSourceReport.get = require('./../routes/endpoints/innersourceReport/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.login = {};
adp.endpoints.login.post = require('../routes/endpoints/login/post');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.logged = {};
adp.endpoints.logged.get = require('../routes/endpoints/logged/get');
adp.endpoints.logged.post = require('../routes/endpoints/logged/post');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.listOptions = {};
adp.endpoints.listOptions.get = require('../routes/endpoints/listOptions/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.complianceOptions = {};
adp.endpoints.complianceOptions.get = require('../routes/endpoints/complianceOptions/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.microservice = {};
adp.endpoints.microservice.checkname = require('../routes/endpoints/microservice/checkname');
adp.endpoints.microservice.create = require('../routes/endpoints/microservice/create');
adp.endpoints.microservice.read = require('../routes/endpoints/microservice/read');
adp.endpoints.microservice.update = require('../routes/endpoints/microservice/update');
adp.endpoints.microservice.delete = require('../routes/endpoints/microservice/delete');
adp.endpoints.microservice.integrationToken = require('../routes/endpoints/microservice/integrationToken');
adp.endpoints.microservice.getVersionsByMS = require('../routes/endpoints/microservice/getVersionsByMS');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.assembly = {};
adp.endpoints.assembly.create = require('../routes/endpoints/assembly/create');
adp.endpoints.assembly.read = require('../routes/endpoints/assembly/read');
adp.endpoints.assembly.update = require('../routes/endpoints/assembly/update');
adp.endpoints.assembly.delete = require('../routes/endpoints/assembly/delete');
adp.endpoints.assembly.getComponentServicesFromAssembly = require('../routes/endpoints/assembly/getComponentServicesFromAssembly');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.assets = {};
adp.endpoints.assets.getAsset = require('../routes/endpoints/assets/getAsset');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.microservices = {};
adp.endpoints.microservices.get = require('../routes/endpoints/microservices/get');
adp.endpoints.microservices.getMicroserviceList = require('../routes/endpoints/microservices/getMicroserviceList');
adp.endpoints.microservices.getByOwner = require('../routes/endpoints/microservices/getByOwner');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.contentSearch = {};
adp.endpoints.contentSearch.get = require('./../routes/endpoints/contentSearch/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.realtimeContentSearch = {};
adp.endpoints.realtimeContentSearch.get = require('../routes/endpoints/realtimeContentSearch/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.teamHistory = {};
adp.endpoints.teamHistory.checkTeamChanges = require('../routes/endpoints/teamHistory/checkTeamChanges');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.migrationscripts = {};
adp.endpoints.migrationscripts.get = require('../routes/endpoints/migrationscripts/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.auditlog = {};
adp.endpoints.auditlog.get = require('../routes/endpoints/auditlog/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.auditlogs = {};
adp.endpoints.auditlogs.get = require('../routes/endpoints/auditlogs/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.notfound = {};
adp.endpoints.notfound.get = require('../routes/endpoints/notfound/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.playground = {};
adp.endpoints.playground.post = require('../routes/endpoints/playground/post');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.restdoc = {};
adp.endpoints.restdoc.get = require('../routes/endpoints/restdoc/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.root = {};
adp.endpoints.root.get = require('../routes/endpoints/root/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.user = {};
adp.endpoints.user.create = require('../routes/endpoints/user/create');
adp.endpoints.user.read = require('../routes/endpoints/user/read');
adp.endpoints.user.update = require('../routes/endpoints/user/update');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.userProgress = {};
adp.endpoints.userProgress.post = require('../routes/endpoints/userProgress/post');
adp.endpoints.userProgress.delete = require('../routes/endpoints/userProgress/delete');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.tutorialsMenu = {};
adp.endpoints.tutorialsMenu.get = require('../routes/endpoints/tutorialsMenu/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.tutorials = {};
adp.endpoints.tutorials.getBySlug = require('../routes/endpoints/tutorials/getBySlug');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.users = {};
adp.endpoints.users.get = require('../routes/endpoints/users/get');
adp.endpoints.users.getUsersWithPermissions = require('../routes/endpoints/users/getUsersWithPermissions');
adp.endpoints.users.fetchUsersBySignum = require('../routes/endpoints/users/fetchUsersBySignum');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.version = {};
adp.endpoints.version.get = require('../routes/endpoints/version/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.searchLdapUser = {};
adp.endpoints.searchLdapUser.get = require('../routes/endpoints/searchLdapUser/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.userbysignum = {};
adp.endpoints.userbysignum.get = require('../routes/endpoints/userbysignum/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.dump = {};
adp.endpoints.dump.anything = require('../routes/endpoints/dump/anything');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.tags = {};
adp.endpoints.tags.get = require('../routes/endpoints/tags/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.tagsCounter = {};
adp.endpoints.tagsCounter.get = require('../routes/endpoints/tagsCounter/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.microserviceAnalytics = {};
adp.endpoints.microserviceAnalytics.get = require('../routes/endpoints/microserviceAnalytics/get');
adp.endpoints.microserviceAnalytics.getPraVersion = require('../routes/endpoints/microserviceAnalytics/getPraVersion');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.permission = {};
adp.endpoints.permission.postCreate = require('../routes/endpoints/permission/postCreate');
adp.endpoints.permission.getRead = require('../routes/endpoints/permission/getRead');
adp.endpoints.permission.putUpdate = require('../routes/endpoints/permission/putUpdate');
adp.endpoints.permission.delete = require('../routes/endpoints/permission/delete');
adp.endpoints.permission.changeUserPermissions = require('../routes/endpoints/permission/changeUserPermissions');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.report = {};
adp.endpoints.report.getServiceOwners = require('../routes/endpoints/report/getServiceOwners');
adp.endpoints.report.getTeamMembers = require('../routes/endpoints/report/getTeamMembers');
adp.endpoints.report.assets = require('../routes/endpoints/report/assets');
adp.endpoints.report.assembly = require('../routes/endpoints/report/assembly');
adp.endpoints.report.creatorByDomain = require('../routes/endpoints/report/creatorByDomain');
adp.endpoints.report.getErrorsFromContributors = require('../routes/endpoints/report/getErrorsFromContributors');
adp.endpoints.report.innersourceData = require('../routes/endpoints/report/innersourceData');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.cache = {};
adp.endpoints.cache.clear = require('../routes/endpoints/cache/clear');
adp.endpoints.cache.get = require('../routes/endpoints/cache/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.profile = {};
adp.endpoints.profile.get = require('../routes/endpoints/profile/get');
adp.endpoints.profile.update = require('../routes/endpoints/profile/update');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.integration = {};
adp.endpoints.integration.documentation = require('../routes/endpoints/integration/documentation');
adp.endpoints.integration.documentRefresh = require('../routes/endpoints/integration/documentRefresh');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// adp.endpoints.validateField = {};
// adp.endpoints.validateField.validate = require('../routes/endpoints/validateField/validate.js');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.metrics = {};
adp.endpoints.metrics.register = require('../routes/endpoints/metrics/register');
adp.endpoints.metrics.tutorialAnalytics = require('../routes/endpoints/metrics/tutorialAnalytics');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.contributions = {};
adp.endpoints.contributions.get = require('../routes/endpoints/contributions/get');
adp.endpoints.contributions.change = require('../routes/endpoints/contributions/change');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.peopleFinder = {};
adp.endpoints.peopleFinder.getPerson = require('../routes/endpoints/peopleFinder/getPerson');
adp.endpoints.peopleFinder.getFunctionalUser = require('../routes/endpoints/peopleFinder/getFunctionalUser');
adp.endpoints.peopleFinder.getPdlDetails = require('../routes/endpoints/peopleFinder/getPdlDetails');
adp.endpoints.peopleFinder.getPdlMembers = require('../routes/endpoints/peopleFinder/getPdlMembers');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.rbac = {};
adp.endpoints.rbac.post = require('../routes/endpoints/rbac/post');
adp.endpoints.rbac.postDuplicate = require('../routes/endpoints/rbac/postDuplicate');
adp.endpoints.rbac.put = require('../routes/endpoints/rbac/put');
adp.endpoints.rbac.get = require('../routes/endpoints/rbac/get');
adp.endpoints.rbac.delete = require('../routes/endpoints/rbac/delete');
adp.endpoints.rbac.preview = require('../routes/endpoints/rbac/preview');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.innersourceUserHistory = {};
adp.endpoints.innersourceUserHistory.get = require('../routes/endpoints/innersourceUserHistory/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.innersourcebydaterangesignummsid = {};
adp.endpoints.innersourcebydaterangesignummsid.delete = require('../routes/endpoints/innersourcebydaterangesignummsid/delete');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.wordpress = {};
adp.endpoints.wordpress.getMenus = require('../routes/endpoints/wordpress/getMenus');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.wpcontent = {};
adp.endpoints.wpcontent.get = require('./../routes/endpoints/wpcontent/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.queue = {};
adp.endpoints.queue.check = require('./../routes/endpoints/queue/check');
adp.endpoints.queue.status = require('./../routes/endpoints/queue/status');
adp.endpoints.queue.thread = require('./../routes/endpoints/queue/thread');
adp.endpoints.queue.start = require('./../routes/endpoints/queue/start');
adp.endpoints.queue.free = require('./../routes/endpoints/queue/free');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.documentSyncStatus = {};
adp.endpoints.documentSyncStatus.get = require('./../routes/endpoints/documentSyncStatus/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.documentSyncStatusDetails = {};
adp.endpoints.documentSyncStatusDetails.get = require('./../routes/endpoints/documentSyncStatusDetails/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.mimer = {};
adp.endpoints.mimer.updateDocumentMenu = require('./../routes/endpoints/mimer/updateDocumentMenu');
adp.endpoints.mimer.mimerGetVersion = require('./../routes/endpoints/mimer/mimerGetVersion');
adp.endpoints.mimer.token = require('./../routes/endpoints/mimer/token');
adp.endpoints.mimer.deleteToken = require('./../routes/endpoints/mimer/deleteToken');
adp.endpoints.mimer.mimerSync = require('./../routes/endpoints/mimer/mimerSync');
adp.endpoints.mimer.autoRefreshToken = require('./../routes/endpoints/mimer/autoRefreshToken');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.elasticSync = {};
adp.endpoints.elasticSync.msDocForceSync = require('./../routes/endpoints/elasticSync/msDocForceSync');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.clearDocumentsElasticSearch = {};
adp.endpoints.clearDocumentsElasticSearch.clear = require('./../routes/endpoints/clearDocumentsElasticSearch/clear');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.configForIntegration = {};
adp.endpoints.configForIntegration.get = require('./../routes/endpoints/configForIntegration/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.siteMap = {};
adp.endpoints.siteMap.get = require('./../routes/endpoints/siteMap/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.comments = {};
adp.endpoints.comments.get = require('./../routes/endpoints/comments/get');
adp.endpoints.comments.post = require('./../routes/endpoints/comments/post');
adp.endpoints.comments.put = require('./../routes/endpoints/comments/put');
adp.endpoints.comments.delete = require('./../routes/endpoints/comments/delete');
adp.endpoints.comments.resolve = require('./../routes/endpoints/comments/resolve');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.clientDocs = {};
adp.endpoints.clientDocs.login = require('../routes/endpoints/clientDocs/login');
adp.endpoints.clientDocs.getDocumentList = require('./../routes/endpoints/clientDocs/getDocumentList');
adp.endpoints.clientDocs.test = require('./../routes/endpoints/clientDocs/test');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.marketplace = {};
adp.endpoints.marketplace.getDocumentList = require('./../routes/endpoints/marketplace/getDocumentList');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.endpoints.egsSync = {};
adp.endpoints.egsSync.trigger = require('./../routes/endpoints/egsSync/trigger');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.echoLog(`[+${adp.timeStepNext()}] ADP Endpoints loaded...`);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
