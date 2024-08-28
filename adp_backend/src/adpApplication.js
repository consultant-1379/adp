// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.packageJson = require('../package.json');
  global.version = global.packageJson.version;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.version = `ADP Node.js Server - ${global.version}`;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.adp = {};
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.adp.docs = {};
  global.adp.docs.list = [];
  global.adp.docs.rest = [];
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.adp.memory = {};
  global.adp.memory.connections = [];
  global.adp.path = __dirname;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // Temporary solution to ignore invalid certificates ( Development Server )
  // Have to be removed in Production Server
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  require('./init/adp1_LibraryScripts');
  require('./init/adp2_ThirdPartyScripts');
  require('./init/adp3_CacheScripts');
  require('./init/adp4_DBScripts');
  require('./init/adp5_HTTPHTTPSScripts');
  require('./init/adp6_adpKernelScripts');
  require('./init/adp7_adpEndpoints.js');
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.adp.cpus = global.os.cpus();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // Run Server
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const initSync = async () => {
    await global.prometheus.collectDefaultMetrics();
    await global.prometheusGcStats()();
    await global.adp.metrics.register.registerCustomMetrics();
    await global.adp.metrics.register.TutorialRegistryClass.createTutorialRegistry();
    await global.adp.setup.loadFromFile();
    await global.adp.db.start();
    await adp.elasticSearchStart();

    adp.queue = await new adp.masterQueue.MasterQueue(adp.config.runnerMode);

    await global.adp.httpControls.redirectServer();
    await global.adp.httpControls.httpsServer();
    await adp.echoLog(`[+${global.adp.timeStepNext()}] Using LDAP Server [ ${global.adp.config.ldap.url} ]`);
    await adp.echoLog(`[+${global.adp.timeStepNext()}] Server is online!`);
    await global.adp.tutorialAnalytics.get();
    await global.adp.microservice.duplicateUniqueFields(null, undefined, true)
      .then(() => {})
      .catch(() => {});
    await global.adp.listOptions.setDataBaseForListOptions()
      .then(() => {})
      .catch((err) => {
        adp.echoLog(`[+${global.adp.timeStepNext()}] ${err}`);
      });
    await global.adp.listOptions.setDataBaseForListOptions('ComplianceOption')
      .catch((err) => {
        adp.echoLog(`[+${global.adp.timeStepNext()}] ${err}`);
      });
    await global.adp.listOptions.get();
    await global.adp.compliance.readComplianceOptions.getComplianceOptions();
    await global.adp.tags.reload()
      .then(() => {})
      .catch((err) => {
        adp.echoLog(`[+${global.adp.timeStepNext()}] ${err}`);
      });

    if (!adp.config.workerInstance) {
      await global.adp.migration.clean()
        .then((msg) => {
          adp.echoLog(`[+${global.adp.timeStepNext()}] ${msg}`);
        })
        .catch((err) => {
          adp.echoLog(`[+${global.adp.timeStepNext()}] ${err}`);
        });
    }

    adp.echoLog(`[+${global.adp.timeStepNext()}] adp.config.siteAddress [ ${adp.config.siteAddress} ]`);

    await global.adp.getSizeStatusToEchoOnLoad();
    await global.adp.quickReports.clearDiskCache();
    await adp.nodeEvents();
    await adp.backendStarted();
    await RESOLVE(true);

    const queueProcessForWorker = () => {
      setTimeout(queueProcessForWorker, 2500);
      if (adp.queue.queueInstances === 0) {
        adp.queue.startJobs();
      }
    };

    adp.queue.startJobs(true)
      .then(() => {
        queueProcessForWorker();
      })
      .catch(() => {});
  };
  adp.echoLog(`[+${global.adp.timeStepNext()}] Scripts loaded, starting Server...`);
  try {
    initSync();
  } catch (e) {
    REJECT(e);
  }
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
