// ============================================================================================= //
global.fs = require('fs');
global.chalk = require('chalk');
global.request = require('request');
// ============================================================================================= //
global.adp = {};
adp.docs = {};
adp.docs.list = [];
adp.docs.rest = [];
adp.cache = {};
adp.echoDebugConsoleMode = true;
// ============================================================================================= //
adp.config = {};
adp.config.showPerformanceConsoleLogs = false;
// ============================================================================================= //
adp.masterCache = {};
adp.masterCache.clearBecauseCUD = () => {};
// ============================================================================================= //
const tempPathArray = __dirname.split('/');
adp.path = `${tempPathArray.splice(0, tempPathArray.length - 2).join('/')}/src`;
// ============================================================================================= //
adp.setup = {};
adp.setup.loadFromFile = require('./../../src/setup/loadFromFile');
adp.setup.dataBaseSetup = require('./../../src/setup/dataBaseSetup.json').dataBaseSetup;
adp.timeStamp = require('./../../src/library/timeStamp');
adp.timeStepStart = require('./../../src/library/timerStepStart');
adp.timeStepNext = require('./../../src/library/timerStepNext');
adp.dateFormat = require('./../../src/library/dateFormat');
adp.dateLogSystemFormat = require('./../../src/library/dateLogSystemFormat');
adp.echoLogSaveDiskLog = require('./../../src/library/echoSaveDiskLog');
adp.echoLog = require('./../../src/library/echoLog');
adp.clone = require('./../../src/library/clone');
adp.echoDivider = require('./../../src/library/echoDivider');
adp.echoFirstLine = require('./../../src/library/echoFirstLine');
adp.echoLogSetDebugConsoleMode = require('./../../src/library/echoSetDebugConsoleMode');
adp.setHeaders = require('./../../src/library/setHeaders');
// ============================================================================================= //
adp.db = {};
adp.db.checkID = require('./../../src/db/checkID');
adp.db.Mongo = require('./../../src/db/Mongo');
adp.db.start = require('./../../src/db/start');
adp.db.find = require('./../../src/db/find');
adp.db.create = require('./../../src/db/create');
adp.db.read = require('./../../src/db/read');
adp.db.update = require('./../../src/db/update');
adp.db.destroy = require('./../../src/db/destroy');
adp.db.aggregate = require('./../../src/db/aggregate');
// ============================================================================================= //
if (adp.models === undefined) {
  adp.models = {};
}
adp.models.EchoLog = require('./../../src/models/EchoLog');
// ============================================================================================= //
adp.elasticSearchStart = require('../../src/elasticSearch/start');

adp.modelsElasticSearch = {};
adp.modelsElasticSearch.Wordpress = require('./../../src/modelsElasticSearch/Wordpress');
adp.modelsElasticSearch.Microservices = require('./../../src/modelsElasticSearch/Microservices');
adp.modelsElasticSearch.MicroserviceDocumentation = require('./../../src/modelsElasticSearch/MicroserviceDocumentation');
// ============================================================================================= //
adp.action = require('./action');
adp.dynamicData = require('./dynamicData');
adp.restore = require('./restore');
adp.restoreElasticsearch = require('./restoreElasticsearch');
// ============================================================================================= //
adp.slugIt = require('./../../src/library/slugIt');
// ============================================================================================= //
