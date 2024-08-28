// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// ADP Kernel Scripts
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.memory.users = [];
adp.access = {};
adp.access.setupPassport = require('../access/setupPassport');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.elasticSearchStart = require('./../elasticSearch/start');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.permission = {};
adp.permission.canDoIt = require('../permission/canDoIt');
adp.permission.canDoItUser = require('../permission/canDoItUser');
adp.permission.getUserFromRequestObject = require('../permission/getUserFromRequestObject');
adp.permission.permissionToSendNotificationList = require('../permission/permissionToSendNotificationList');
adp.permission.fieldListWithPermissions = require('../permission/fieldListWithPermissions');
adp.permission.checkFieldPermission = require('../permission/checkFieldPermission');
adp.permission.checkFieldPermissionCacheIt = require('../permission/checkFieldPermissionCacheIt');
adp.permission.fieldIsEditableByPermissionRules = require('../permission/fieldIsEditableByPermissionRules');
adp.permission.fieldIsEditableByPermissionRulesCacheIt = require('../permission/fieldIsEditableByPermissionRulesCacheIt');
adp.permission.isFieldAdmin = require('../permission/isFieldAdmin');
adp.permission.isFieldAdminByUserID = require('../permission/isFieldAdminByUserID');
adp.permission.crudCreate = require('../permission/crudCreate');
adp.permission.crudRead = require('../permission/crudRead');
adp.permission.crudUpdate = require('../permission/crudUpdate');
adp.permission.crudDelete = require('../permission/crudDelete');
adp.permission.crudLog = require('../permission/crudLog');
adp.permission.changeUserPermissions = require('../permission/changeUserPermissions');
adp.permission.changeUser = require('../permission/changeUser');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.assetValidation = {};
adp.assetValidation.AssetValidationClass = require('./../assetValidation/AssetValidationclass');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.contentSearch = {};
adp.contentSearch.ESearchClass = require('./../contentSearch/ESearchClass');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.assets = {};
adp.assets.BuildAssetSchemaClass = require('./../assets/BuildAssetSchemaClass');
adp.assets.getAssetbyslug = require('./../assets/getAssetBySlug');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.integration = {};
adp.integration.documentation = require('../integration/documentation');
adp.integration.documentRefresh = require('../integration/documentRefresh');
adp.integration.documentRefreshPerVersion = require('../integration/documentRefreshPerVersion');
adp.integration.documentRefreshConsolidation = require('../integration/documentRefreshConsolidation');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.artifactoryRepo = require('../artifactoryRepo/artifactoryRepo');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.masterCache = {};
adp.masterCache.CacheObjectClass = require('../masterCache/CacheObjectClass');
adp.masterCache.clearBecauseCUD = require('../masterCache/clearBecauseCUD');
adp.masterCache.clear = require('../masterCache/clear');
adp.masterCache.get = require('../masterCache/get');
adp.masterCache.set = require('../masterCache/set');
adp.masterCache.shortcut = require('../masterCache/shortcut');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.comments = {};
adp.comments.CommentsClass = require('./../comments/CommentsClass');
adp.comments.InstrumentClass = require('./../comments/InstrumentClass');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.masterQueue = {};
adp.masterQueue.MasterQueue = require('./../masterQueue/MasterQueue');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.playground = {};
adp.playground.cmd = require('../playground/cmd');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.login = {};
adp.login.ldap = require('../login/ldap');
adp.login.checkdb = require('../login/checkdb');
adp.login.unbindClient = require('../login/unbindClient');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.docs.generateDocs = require('../docs/generateDocs');
adp.docs.readDoc = require('../docs/readDoc');
adp.docs.generateDocHTML = require('../docs/generateDocHTML');
adp.docs.getDependencies = require('../docs/getDependencies');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.getPostParameter = require('../library/getPostParameter');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.models = {};
adp.models.Adp = require('../models/Adp');
adp.models.AdpLog = require('./../models/AdpLog');
adp.models.EchoLog = require('./../models/EchoLog');
adp.models.ReleaseSettings = require('../models/ReleaseSettings');
adp.models.Gitstatus = require('../models/Gitstatus');
adp.models.Comments = require('../models/Comments');
adp.models.CommentsDL = require('../models/CommentsDL');
adp.models.PrimeDDTable = require('../models/PrimeDDTable');

let gitStatusSetup = new adp.models.Gitstatus();
gitStatusSetup.synchronizeReleaseSetting()
  .then(() => {
    gitStatusSetup = undefined;
  });

adp.models.azure = require('../models/azure');
adp.models.PeopleFinder = require('../models/PeopleFinder');
adp.models.TeamHistory = require('../models/TeamHistory');
adp.models.Listoption = require('../models/Listoption');
adp.models.Complianceoption = require('../models/Complianceoption');
adp.models.Tag = require('../models/Tag');
adp.models.Migrationscripts = require('../models/Migrationscripts');
adp.models.Permission = require('../models/Permission');
adp.models.Userprogress = require('../models/Userprogress');
adp.models.RBACGroups = require('../models/RBACGroups');
adp.models.InnersourceUserHistory = require('../models/InnersourceUserHistory');
adp.models.RBACGroups = require('../models/RBACGroups');
adp.models.MicroservicesElasticsearchDocumentationSyncReport = require('../models/MicroserviceElasticsearchDocumentationSyncReport');
adp.models.MasterQueue = require('../models/MasterQueue');
adp.models.AssetDocuments = require('./../models/AssetDocumets');
adp.models.AdpSetup = require('../models/AdpSetup');
adp.models.EgsControl = require('./../models/EgsControl');
adp.models.EgsPayload = require('./../models/EgsPayload');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.modelsElasticSearch = {};
adp.modelsElasticSearch.Wordpress = require('./../modelsElasticSearch/Wordpress');
adp.modelsElasticSearch.Microservices = require('./../modelsElasticSearch/Microservices');
adp.modelsElasticSearch.MicroserviceDocumentation = require('../modelsElasticSearch/MicroserviceDocumentation');
adp.modelsElasticSearch.MicroservicesWordpress = require('./../modelsElasticSearch/MicroservicesWordpress');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.feRendering = require('../feRendering/prepareDocStructureForRendering');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.microservice = {};
adp.microservice.create = require('../microservice/create');
adp.microservice.read = require('../microservice/read');
adp.microservice.update = require('../microservice/update');
adp.microservice.delete = require('../microservice/delete');
adp.microservice.validateSchema = require('../microservice/validateSchema');
adp.microservice.validateListOptionSelections = require('../microservice/validateListOptionSelections');
adp.microservice.CRUDLog = require('../microservice/CRUDLog');
adp.microservice.checkName = require('../microservice/checkName');
adp.microservice.checkId = require('../microservice/checkId');
adp.microservice.checkSlug = require('../microservice/checkSlug');
adp.microservice.duplicateUniqueFields = require('../microservice/duplicateUniqueFields');
adp.microservice.integrationToken = require('../microservice/integrationToken');
adp.microservice.updateAssetDocSettings = require('../microservice/updateAssetDocSettings');
adp.microservice.menuBasicStructure = require('../microservice/menuBasicStructure');
adp.microservice.menuPrepareDocumentBeforeProceed = require('../microservice/menuPrepareDocumentBeforeProceed');
adp.microservice.menuCheckIfShouldCallDocumentRefresh = require('../microservice/menuCheckIfShouldCallDocumentRefresh');
adp.microservice.menuApplyRulesOnManual = require('../microservice/menuApplyRulesOnManual');
adp.microservice.synchronizeWithElasticSearch = require('./../microservice/synchronizeWithElasticSearch');
adp.microservice.synchronizeDocumentsWithElasticSearch = require('./../microservice/synchronizeDocumentsWithElasticSearch');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.assembly = {};
adp.assembly.create = require('../assembly/create');
adp.assembly.read = require('../assembly/read');
adp.assembly.getComponentServicesFromAssembly = require('../assembly/getComponentServicesFromAssembly');
adp.assembly.update = require('../assembly/update');
adp.assembly.delete = require('../assembly/delete');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

adp.microserviceAnalytics = {};
adp.microserviceAnalytics.get = require('../microserviceAnalytics/get');
adp.microserviceAnalytics.getPraVersion = require('../microserviceAnalytics/getPraVersion');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.ldapNormalizer = {};
adp.ldapNormalizer.analyse = require('../ldapNormalizer/analyse');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

adp.microservices = {};
adp.microservices.denormalize = require('../microservices/denormalize');
adp.microservices.userTeamFullData = require('./../microservices/userTeamFullData');
adp.microservices.getByOwner = require('../microservices/getByOwner');
adp.microservices.checkIfDontHaveInSchema = require('../microservices/checkIfIDontHaveInSchema');
adp.microservices.getById = require('../microservices/getById');
adp.microservices.MicroservicesController = require('../microservices/MicroservicesController');
adp.microservices.search = require('../microservices/search').search;
adp.microservices.getVersionsForMicroservice = require('../microservices/getVersionsForMicroservice');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.auditlog = {};
adp.auditlog.create = require('../auditlog/create');
adp.auditlog.read = require('../auditlog/read');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.auditlogs = {};
adp.auditlogs.read = require('../auditlogs/read');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.user = {};
adp.user.get = require('../user/get');
adp.user.create = require('../user/create');
adp.user.createFromTeam = require('../user/createFromTeam');
adp.user.read = require('../user/read');
adp.user.update = require('../user/update');
adp.user.validateSchema = require('../user/validateSchema');
adp.user.getUserNameMail = require('../user/getUserNameMail');
adp.user.thisUserShouldBeInDatabase = require('../user/thisUserShouldBeInDatabase');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.users = {};
adp.users.get = require('../users/get');
adp.users.getUsersWithPermissions = require('../users/getUsersWithPermissions');
adp.users.UpdateUsersDataClass = require('../users/UpdateUsersDataClass');
adp.users.UserController = require('../users/Users.controller');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.userProgress = {};
adp.userProgress.save = require('./../userProgress/save');
adp.userProgress.delete = require('./../userProgress/delete');
adp.userProgress.cleaner = require('./../userProgress/cleaner');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.tutorialsMenu = {};
adp.tutorialsMenu.get = require('./../tutorialsMenu/get');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.tutorials = {};
adp.tutorials.getBySlug = require('./../tutorials/getBySlug');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.searchLdapUser = {};
adp.searchLdapUser.search = require('../searchLdapUser/search');

adp.rbac = {};
adp.rbac.GroupsController = require('../rbac/GroupsController');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.userbysignum = {};
adp.userbysignum.search = require('../userbysignum/search');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.cache = {};
adp.cache.document = [];
adp.cache.timeInSeconds = 1;
adp.cache.set = require('../cache/set');
adp.cache.get = require('../cache/get');
adp.cache.clear = require('../cache/clear');
adp.cache.autoclear = require('../cache/autoclear');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.document = {};
adp.document.getDocuments = require('../document/getDocument');
adp.document.getFileFromGerrit = require('../document/getFileFromGerrit');
adp.document.getFileFromArtifactory = require('../document/getFileFromArtifactory');
adp.document.getFileFromArtifactoryJustTheHead = require('../document/getFileFromArtifactoryJustTheHead');
adp.document.getFileFromArtifactoryCompareHeads = require('../document/getFileFromArtifactoryCompareHeads');
adp.document.getFileFromArtifactoryLoadDocument = require('../document/getFileFromArtifactoryLoadDocument');
adp.document.getFileFromArtifactoryLoadZip = require('../document/getFileFromArtifactoryLoadZip');
adp.document.getFileFromArtifactoryLoadHTML = require('../document/getFileFromArtifactoryLoadHTML');
adp.document.getFileFromArtifactoryLoadFromDiskCache = require('../document/getFileFromArtifactoryLoadFromDiskCache');
adp.document.clearArtifactoryCache = require('../document/clearArtifactoryCache');
adp.document.getThatInclude = require('../document/getThatInclude');
adp.document.getIncludesArray = require('../document/getIncludesArray');
adp.document.isJustALink = require('../document/isJustALink');
adp.document.checkLink = require('../document/checkLink');
adp.document.solveHTMLImagePath = require('../document/solveHTMLImagePath');
adp.document.solveHTMLImageSizes = require('../document/solveHTMLImageSizes');
adp.document.solveHTMLExternalLink = require('../document/solveHTMLExternalLink');
adp.document.extractPath = require('../document/extractPath');
adp.document.getImage = require('../document/getImage');
adp.document.clearImage = require('../document/clearImage');
adp.document.asciidoctorHeaderVariables = require('../document/asciidoctorHeaderVariables');
adp.document.checkThisPath = require('../document/checkThisPath');
adp.document.unzipThisFile = require('../document/unzipThisFile');
adp.document.parseTheseFiles = require('../document/parseTheseFiles');
adp.document.parseThisHTML = require('../document/parseThisHTML');
adp.document.deliveryStaticFile = require('../document/deliveryStaticFile');
adp.document.showDiskCache = require('../document/showDiskCache');
adp.document.clearExpiredFilesFromArtifactory = require('../document/clearExpiredFilesFromArtifactory');
adp.document.removeFolderIfEmpty = require('../document/removeFolderIfEmpty');
adp.document.matchDocNameToCategory = require('../document/matchDocNameToCateogory');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.documentMenu = {};
adp.documentMenu.process = require('../documentMenu/process');
adp.documentMenu.rulebook = require('../documentMenu/rulebook');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.documentCategory = {};
adp.documentCategory.matchDocNameToCategory = require('../documentCategory/matchDocNameToCategory');
adp.documentCategory.fetchAutoDocCategoryBySlug = require('../documentCategory/fetchAutoDocCategoryBySlug');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.documentCategory = {};
adp.documentCategory.matchDocNameToCategory = require('../documentCategory/matchDocNameToCategory');
adp.documentCategory.fetchAutoDocCategoryBySlug = require('../documentCategory/fetchAutoDocCategoryBySlug');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.listOptions = {};
adp.listOptions.get = require('../listOptions/get');
adp.listOptions.setDataBaseForListOptions = require('../listOptions/setDataBaseForListOptions');
adp.listOptions.getFieldsWithAdminOnlyFlag = require('../listOptions/getFieldsWithAdminOnlyFlag');
adp.listOptions.ListOptionsController = require('../listOptions/ListOptionsController');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.compliance = {};
adp.compliance.readComplianceOptions = require('../compliance/readComplianceOptions');
adp.compliance.validator = require('../compliance/validator');
adp.compliance.denormalize = require('../compliance/denormalize');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.tags = {};
adp.tags.checkIt = require('../tags/checkIt');
adp.tags.search = require('../tags/search');
adp.tags.reload = require('../tags/reload');
adp.tags.codeToTag = require('../tags/codeToTag');
adp.tags.count = require('../tags/count');
adp.tags.getLabel = require('../tags/getLabel');
adp.tags.newTag = require('../tags/newTag');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.notification = {};
adp.notification.processEmailObject = require('../notification/processEmailObject');
adp.notification.buildAssetData = require('../notification/buildAssetData');
adp.notification.buildAssetHTML = require('../notification/buildAssetHTML');
adp.notification.buildCommentsHTML = require('../notification/buildCommentsHTML');
adp.notification.buildAssetUpdateData = require('../notification/buildAssetUpdateData');
adp.notification.buildAssetAdminUpdateData = require('../notification/buildAssetAdminUpdateData');
adp.notification.getRecipients = require('../notification/getRecipients');
adp.notification.buildMailSchema = require('../notification/buildMailSchema');
adp.notification.sendAssetMail = require('../notification/sendAssetMail');
adp.notification.sendCommentsMail = require('../notification/sendCommentsMail');
adp.notification.sendMail = require('../notification/sendMail');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.profile = {};
adp.profile.get = require('../profile/get');
adp.profile.update = require('../profile/update');
// ============================================================================================= //
adp.migration = {};
adp.migration.clean = require('../migration/clean');
adp.migration.cleanGetAllAssets = require('../migration/cleanGetAllAssets');
adp.migration.cleanGetPermissionToRun = require('../migration/cleanGetPermissionToRun');
adp.migration.cleanRunScripts = require('../migration/cleanRunScripts');
adp.migration.cleanUpdatePermissionToRun = require('../migration/cleanUpdatePermissionToRun');
adp.migration.documentationMenuStructure = require('../migration/documentationMenuStructure');
adp.migration.checkMicroserviceSchema = require('../migration/checkMicroserviceSchema');
adp.migration.slugItNow = require('../migration/slugItNow');
adp.migration.updateTeamRoles = require('../migration/updateTeamRoles');
adp.migration.reusabilityIsNoneIfServiceIsSpecific = require('./../migration/reusabilityIsNoneIfServiceIsSpecific');
adp.migration.createComplianceoptions = require('../migration/createComplianceoptions');
adp.migration.updateListoptionsDocCat = require('../migration/updateListoptionsDocCat');
adp.migration.scriptFromCouchToMongo = require('../migration/scriptFromCouchToMongo');
adp.migration.createDefaultGroups = require('../migration/createDefaultGroups');
adp.migration.assignDefaultPermissionGroup = require('../migration/assignDefaultPermissionGroup');
adp.migration.injectContentPermissionFromWordpress = require('./../migration/injectContentPermissionFromWordpress');
adp.migration.fixRBACGroupsIDOnUsers = require('./../migration/fixRBACGroupsIDOnUsers');
adp.migration.gitStatusAddInnersourceSnapshot = require('./../migration/gitStatusAddInnersourceSnapshot');
adp.migration.synchronizeMicroservicesWithElasticSearch = require('./../migration/synchronizeMicroservicesWithElasticSearch');
adp.migration.checkCpiDocumentation = require('../migration/checkCpiDocumentation');
adp.migration.checkCpiInMSDocs = require('../migration/checkCpiInMSDocs');
adp.migration.xidGroupConversion = require('../migration/xidGroupConversion');
adp.migration.microserviceDocumentationSync = require('../migration/microserviceDocumentationSync');
adp.migration.addCreationDate = require('../migration/addCreationDate');
adp.migration.addTutorialToAdditionalInfo = require('../migration/addTutorialToAdditionalInfo');
// ============================================================================================= //
adp.quickReports = {};
adp.quickReports.XlsxGenerator = require('../quickReports/XlsxGenerator');
adp.quickReports.serviceOwners = require('../quickReports/serviceOwners');
adp.quickReports.teamMembers = require('../quickReports/teamMembers');
adp.quickReports.AssetReportSchema = require('../quickReports/AssetReportSchema');
adp.quickReports.AssemblyReportSchema = require('../quickReports/assembly/AssemblyReportSchema');
adp.quickReports.AssetReportMapHeaders = require('../quickReports/AssetReportMapHeaders');
adp.quickReports.AssemblyReportMapHeaders = require('../quickReports/assembly/AssemblyReportMapHeaders');
adp.quickReports.AssetReports = require('../quickReports/AssetReports');
adp.quickReports.AssemblyReports = require('../quickReports/assembly/AssemblyReports');
adp.quickReports.clearDiskCache = require('./../quickReports/clearDiskCache');
adp.quickReports.creatorByDomain = require('./../quickReports/creatorByDomain');
adp.quickReports.errorsFromContributorsStatistics = require('./../quickReports/errorsFromContributorsStatistics');
adp.quickReports.ExternalContributorsList = require('./../quickReports/ExternalContributorsList');
adp.quickReports.innersourceData = require('./../quickReports/innersourceData');
// ============================================================================================= //
// adp.validateField = {};
// adp.validateField.validate = require('../validateField/validate.js');
// ============================================================================================= //
adp.metrics = {};
adp.metrics.register = require('../metrics/register');
// ============================================================================================= //
adp.tutorialAnalytics = {};
adp.tutorialAnalytics.get = require('../tutorialAnalytics/get');
// ============================================================================================= //
adp.contributions = {};
adp.contributions.get = require('../contributions/get');
adp.contributions.progress = require('../contributions/progress');
// ============================================================================================= //
adp.peoplefinder = {};
adp.peoplefinder.BaseOperations = require('../peopleFinder/BaseOperations');
adp.peoplefinder.RecursivePDLMembers = require('../peopleFinder/RecursivePDLMembers');
// ============================================================================================= //
adp.teamHistory = {};
adp.teamHistory.TeamHistoryController = require('../teamHistory/TeamHistoryController');
adp.teamHistory.IsExternalContribution = require('../teamHistory/IsExternalContribution');
// ============================================================================================= //
adp.innerSource = {};
adp.innerSource.lastAssetStatus = require('./../innerSource/lastAssetStatus');
adp.innerSource.userHistory = require('../innerSource/userHistory');
adp.innerSource.deleteCommits = require('../innerSource/deleteCommits');
// ============================================================================================= //
adp.asciidoctorService = {};
adp.asciidoctorService.AsciidoctorController = require('./../asciidoctorService/AsciidoctorController');
// ============================================================================================= //
adp.middleware = {};
adp.middleware.frontEndVersionSync = require('./../middleware/frontEndVersionSync');
adp.middleware.rbac = require('./../middleware/rbac');
adp.middleware.rbac.cache = require('../middleware/rbac/cache');
adp.middleware.RBACClass = require('./../middleware/RBACClass');
adp.middleware.RBACContentPreparationClass = require('./../middleware/RBACContentPreparationClass');
adp.middleware.RBACContentPermissionAsEndpointPermissionClass = require('./../middleware/RBACContentPermissionAsEndpointPermissionClass');
// ============================================================================================= //
adp.mimer = {};
adp.mimer.MimerControl = require('./../mimer/MimerControl');
adp.mimer.getProduct = require('./../mimer/getProduct');
adp.mimer.getVersion = require('./../mimer/getVersion');

adp.mimer.MimerElasticSearchSync = require('./../mimer/MimerElasticSearchSync');
adp.mimer.mimerElasticSearchSyncAction = require('./../mimer/mimerElasticSearchSyncAction');
adp.mimer.mimerElasticSearchSyncClear = require('./../mimer/mimerElasticSearchSyncClear');

adp.mimer.updateDocumentMenu = require('./../mimer/updateDocumentMenu');
adp.mimer.updateDocumentMenuForSync = require('./../mimer/updateDocumentMenuForSync');
adp.mimer.savingRawMimerMenu = require('./../mimer/savingRawMimerMenu');
adp.mimer.MimerTranslation = require('./../mimer/MimerTranslation');
adp.mimer.mimerTranslationAction = require('./../mimer/mimerTranslationAction');
adp.mimer.RenderMimerArm = require('./../mimer/RenderMimerArm');
adp.mimer.renderMimerArmMenu = require('./../mimer/renderMimerArmMenu');
adp.mimer.renderMimerArmMenuVersion = require('./../mimer/renderMimerArmMenuVersion');
adp.mimer.renderMimerArmMenuFinisher = require('./../mimer/renderMimerArmMenuFinisher');
adp.mimer.loadFullMergedMenu = require('./../mimer/loadFullMergedMenu');
adp.mimer.assetCacheClear = require('./../mimer/assetCacheClear');
adp.mimer.autoRefreshToken = require('./../mimer/autoRefreshToken');
// ============================================================================================= //
adp.releaseSettings = {};
adp.releaseSettings.ReleaseSettingsController = require('./../releaseSettings/ReleaseSettingsController');
// ============================================================================================= //
adp.rbac = {};
adp.rbac.GroupsController = require('../rbac/GroupsController');
adp.rbac.previewRequest = require('./../rbac/previewRequest');
// ============================================================================================= //
adp.wordpress = {};
adp.wordpress.getMenus = require('../wordpress/getMenus');
// ============================================================================================= //
adp.proxy = {};
adp.proxy.ProxyClass = require('./../proxy/ProxyClass');
// ============================================================================================= //
adp.swaggerSetup = {};
adp.swaggerSetup.options = require('./../swaggerSetup/options');
adp.swaggerSetup.clientOptions = require('../swaggerSetup/clientOptions');
// ============================================================================================= //
adp.egsSync = {};
adp.egsSync.EgsSyncClass = require('./../egsSync/EgsSyncClass');
adp.egsSync.egsSyncSetup = require('./../egsSync/egsSyncSetup');
adp.egsSync.egsSyncAction = require('./../egsSync/egsSyncAction');
adp.egsSync.egsSyncCheckGroups = require('./../egsSync/egsSyncCheckGroups');
adp.egsSync.egsSyncSendPayload = require('./../egsSync/egsSyncSendPayload');
// ============================================================================================= //
adp.backendStarted = require('../library/backendStarted');
// ============================================================================================= //
adp.routes = require('../routes/routes');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.echoLog(`[+${adp.timeStepNext()}] ADP Kernel Scripts loaded...`);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
