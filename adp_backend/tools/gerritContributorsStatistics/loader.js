// ============================================================================================= //
/**
* gerritContributorsStatistics/loader.js
* @author Armando Dias [zdiaarm]
*
* Load the packages of 3PP and from Backend to avoid COPY/PASTE and multiple versions
* of the same code. Also loads the local packages for gerritContributorsStatistics/start.js
* be able to run.
*/
// ============================================================================================= //
if (global.fs === undefined) {
  global.fs = require('fs');
}
if (global.chalk === undefined) {
  global.chalk = require('chalk');
}
if (global.request === undefined) {
  global.request = require('request');
}
if (global.ldapjs === undefined) {
  global.ldapjs = require('ldapjs');
}
if (global.sizeof === undefined) {
  global.sizeof = require('object-sizeof');
}
if (global.joi === undefined) {
  global.joi = require('joi');
}

// ============================================================================================= //
if (global.adp === undefined) {
  // ------------------------------------------------------------------------------------------- //
  global.adp = {};
  // ------------------------------------------------------------------------------------------- //
  adp.docs = {};
  adp.docs.list = [];
  adp.docs.rest = [];
  adp.cache = {};
  adp.echoDebugConsoleMode = true;
  adp.processExit = global.process.exit;
  // ------------------------------------------------------------------------------------------- //
  adp.config = {};
  adp.config.showPerformanceConsoleLogs = false;
  // ------------------------------------------------------------------------------------------- //
  adp.masterCache = {};
  adp.masterCache.CacheObjectClass = require('../../src/masterCache/CacheObjectClass');
  adp.masterCache.clearBecauseCUD = require('../../src/masterCache/clearBecauseCUD');
  adp.masterCache.clear = require('../../src/masterCache/clear');
  adp.masterCache.get = require('../../src/masterCache/get');
  adp.masterCache.set = require('../../src/masterCache/set');
  adp.masterCache.shortcut = require('../../src/masterCache/shortcut');
  // ------------------------------------------------------------------------------------------- //
  const tempPathArray = __dirname.split('/');
  adp.path = `${tempPathArray.splice(0, tempPathArray.length - 2).join('/')}/src`;
  // ------------------------------------------------------------------------------------------- //
  adp.originalEchoLog = require('./../../src/library/echoLog');
  adp.echoLog = (TXT, OBJ = null, LEVEL = null, PACKNAME = null, DATABASE = null) => {
    let newTXT = TXT;
    if (cs && cs.mode) {
      newTXT = `${cs.mode} :: ${TXT}`;
    }
    adp.originalEchoLog(newTXT, OBJ, LEVEL, PACKNAME, DATABASE);
  };
  // ------------------------------------------------------------------------------------------- //
  adp.setup = {};
  adp.setup.loadFromFile = require('./../../src/setup/loadFromFile');
  adp.setup.dataBaseSetup = require('./../../src/setup/dataBaseSetup.json').dataBaseSetup;
  adp.timeStamp = require('./../../src/library/timeStamp');
  adp.timeStepStart = require('./../../src/library/timerStepStart');
  adp.timeStepNext = require('./../../src/library/timerStepNext');
  adp.dateFormat = require('./../../src/library/dateFormat');
  adp.dateLogSystemFormat = require('./../../src/library/dateLogSystemFormat');
  adp.echoLogSaveDiskLog = require('./../../src/library/echoSaveDiskLog');
  adp.echoDivider = require('./../../src/library/echoDivider');
  adp.echoFirstLine = require('./../../src/library/echoFirstLine');
  adp.echoLogSetDebugConsoleMode = require('./../../src/library/echoSetDebugConsoleMode');
  adp.setHeaders = require('./../../src/library/setHeaders');
  adp.getSizeInMemory = require('../../src/library/getSizeInMemory');
  global.Jsonschema = require('jsonschema').Validator;
  adp.getDefaultRBACGroupID = require('../../src/library/getDefaultRBACGroupID');
  // ------------------------------------------------------------------------------------------- //
  adp.db = {};
  adp.db.checkID = require('./../../src/db/checkID');
  adp.db.Mongo = require('../../src/db/Mongo');
  adp.db.bulk = require('../../src/db/bulk');
  adp.db.find = require('./../../src/db/find');
  adp.db.read = require('./../../src/db/read');
  adp.db.create = require('./../../src/db/create');
  adp.db.update = require('./../../src/db/update');
  adp.db.destroy = require('./../../src/db/destroy');
  adp.db.aggregate = require('./../../src/db/aggregate');
  // ------------------------------------------------------------------------------------------- //
  adp.clone = require('./../../src/library/clone');
  adp.slugIt = require('./../../src/library/slugIt');
  adp.dynamicSort = require('./../../src/library/dynamicSort');
  adp.dateLogSystemFormat = require('./../../src/library/dateLogSystemFormat');
  // ------------------------------------------------------------------------------------------- //
  adp.models = {};
  adp.models.Gitstatus = require('./../../src/models/Gitstatus');
  adp.models.ReleaseSettings = require('./../../src/models/ReleaseSettings');
  adp.models.azure = require('../../src/models/azure');
  adp.models.PeopleFinder = require('../../src/models/PeopleFinder');
  adp.models.TeamHistory = require('./../../src/models/TeamHistory');
  adp.models.Adp = require('./../../src/models/Adp');
  adp.models.AdpLog = require('../../src/models/AdpLog');
  adp.models.EchoLog = require('./../../src/models/EchoLog');
  adp.models.InnersourceUserHistory = require('../../src/models/InnersourceUserHistory');
  adp.models.GitStatusLog = require('./../../src/models/GitStatusLog');
  adp.models.RBACGroups = require('./../../src/models/RBACGroups');
  // ------------------------------------------------------------------------------------------- //
  adp.auditlog = {};
  adp.auditlog.create = require('../../src/auditlog/create');
  // ------------------------------------------------------------------------------------------- //
  adp.login = {};
  adp.login.unbindClient = require('../../src/login/unbindClient');
  // ------------------------------------------------------------------------------------------- //
  adp.ldapNormalizer = {};
  adp.ldapNormalizer.analyse = require('../../src/ldapNormalizer/analyse');
  // ------------------------------------------------------------------------------------------- //
  adp.userbysignum = {};
  adp.userbysignum.search = require('../../src/userbysignum/search');
  // ------------------------------------------------------------------------------------------- //
  adp.user = {};
  adp.user.thisUserShouldBeInDatabase = require('../../src/user/thisUserShouldBeInDatabase');
  adp.user.validateSchema = require('../../src/user/validateSchema');
  // ------------------------------------------------------------------------------------------- //
  adp.microservices = {};
  adp.microservices.getById = require('../../src/microservices/getById');
  // ------------------------------------------------------------------------------------------- //
  adp.peoplefinder = {};
  adp.peoplefinder.BaseOperations = require('../../src/peopleFinder/BaseOperations');
  adp.peoplefinder.BaseOperationsInstance = new adp.peoplefinder.BaseOperations();
  adp.peoplefinder.RecursivePDLMembers = require('../../src/peopleFinder/RecursivePDLMembers');
  // ------------------------------------------------------------------------------------------- //
  adp.teamHistory = {};
  adp.teamHistory.TeamHistoryController = require('../../src/teamHistory/TeamHistoryController');
  adp.teamHistory.LatestSnapshotController = require('../../src/teamHistory/LatestSnapshotController');
  adp.teamHistory.IsExternalContributionClass = require('../../src/teamHistory/IsExternalContribution');
  adp.teamHistory.IsExternalContribution = new adp.teamHistory.IsExternalContributionClass();
  // ------------------------------------------------------------------------------------------- //
  adp.rbac = {};
  adp.rbac.GroupsController = require('../../src/rbac/GroupsController');
}
// ============================================================================================= //
// CS = Contributors Statistics
// ============================================================================================= //
global.cs = {};
cs.gitLog = require('./gitLog');
cs.preparations = require('./preparations');
cs.getAllAssets = require('./getAllAssets');
cs.getAllStats = require('./getAllStats');
cs.SaveThis = require('./SaveThis');
cs.UpdateUserData = require('./UpdateUserData');
cs.finalTimerLine = require('./finalTimerLine');
cs.executionTimer = require('./executionTimer');
cs.logDetails = require('./logDetails');
cs.cleanWrongCommits = require('./cleanWrongCommits');
cs.clearOldData = require('./clearOldData');
// ============================================================================================= //
