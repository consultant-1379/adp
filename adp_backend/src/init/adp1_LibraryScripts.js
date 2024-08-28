// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// Library Scripts
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
global.os = require('os');
global.fs = require('fs');
global.chalk = require('chalk');
global.request = require('request');
global.prometheus = require('prom-client');
global.prometheusGcStats = require('prometheus-gc-stats');
global.apiMetrics = require('prometheus-api-metrics');
global.superagent = require('superagent');
adp.timeStamp = require('../library/timeStamp');
adp.timeStepStart = require('../library/timerStepStart');
adp.timeStepNext = require('../library/timerStepNext');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.nodeEvents = require('./../library/nodeEvents');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.processExit = global.process.exit;
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.clone = require('../library/clone');
adp.slugIt = require('../library/slugIt');
adp.slugThisURL = require('../library/slugThisURL');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.urljoin = require('url-join');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.timeStepStart();
adp.dateFormat = require('../library/dateFormat');
adp.dateLogSystemFormat = require('../library/dateLogSystemFormat');
adp.echoLogSaveDiskLog = require('../library/echoSaveDiskLog');
adp.echoLog = require('../library/echoLog');
adp.errorLog = require('../library/errorLog');
adp.echoDivider = require('../library/echoDivider');
adp.echoFirstLine = require('../library/echoFirstLine');
adp.echoLogSetDebugConsoleMode = require('../library/echoSetDebugConsoleMode');
adp.setHeaders = require('../library/setHeaders');
adp.formatBytes = require('../library/formatBytes');
adp.quickTypeErrorMessage = require('../library/quickTypeErrorMessage');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.versionSort = require('../library/versionSort');
adp.dynamicSort = require('../library/dynamicSort');
adp.dynamicSortListOptions = require('../library/dynamicSortListOptions');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.config = {};
adp.setup = {};
adp.setup.loadFromFile = require('../setup/loadFromFile');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.friendlyBytes = require('../library/friendlyBytes');
adp.getSizeInMemory = require('../library/getSizeInMemory');
adp.getSizeStatusToEchoOnLoad = require('../library/getSizeStatusToEchoOnLoad');
adp.getDefaultRBACGroupID = require('../library/getDefaultRBACGroupID');
adp.utils = require('../library/utils');
adp.validations = require('../library/validations');
adp.stopApplication = require('./../library/stopApplication');
adp.stripHtmlTags = require('./../library/stripHtmlTags.js');
adp.getServerStatusErrorMessage = require('./../library/getServerStatusErrorMessage');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.echoLogSetDebugConsoleMode(true);
adp.echoFirstLine();
adp.echoLog(global.version);
adp.echoLog(`[+${adp.timeStepNext()}] Library Scripts loaded...`);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// Param Scripts
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.echoLog(`[+${adp.timeStepNext()}] Param Scripts loaded...`);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// Active Queues
adp.queues = {};


// Pollyfills
adp.promiseAllSettled = require('../library/promiseAllSettledPollyfill');
