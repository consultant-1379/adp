// ============================================================================================= //
/**
* [ metrics.register ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const prometheus = require('prom-client');

const packName = 'metrics.register';
const customMetrics = {};
/**
 * This function is used to register the custom metrics
 * @returns {Promise} Promise object represents result of registration
 * @author Omkar [zsdgmkr]
 */
const registerCustomMetrics = () => new Promise((RESOLVE) => {
  adp.echoLog('Running [ registerCustomMetrics ]', null, 200, packName);
  const timer = new Date();
  const gerritRespMonitoringHistogram = new prometheus.Histogram({
    name: 'adp_backend_gerrit_resp_histogram',
    help: 'ADP Portal BE Gerrit Response Histogram',
    buckets: [100, 500, 1000, 5000, 10000, 15000],
  });
  customMetrics.gerritRespMonitoringHistogram = gerritRespMonitoringHistogram;

  const artifactoryRespMonitoringHistogram = new prometheus.Histogram({
    name: 'adp_backend_artifactory_resp_histogram',
    help: 'ADP Portal BE Artifactory Response Histogram',
    buckets: [100, 500, 1000, 5000, 10000, 15000],
  });
  customMetrics.artifactoryRespMonitoringHistogram = artifactoryRespMonitoringHistogram;

  const eridocRespMonitoringHistogram = new prometheus.Histogram({
    name: 'adp_backend_eridoc_resp_histogram',
    help: 'ADP Portal BE Eridoc Response Histogram',
    buckets: [100, 500, 1000, 5000, 10000, 15000],
  });
  customMetrics.eridocRespMonitoringHistogram = eridocRespMonitoringHistogram;

  const documentationRespMonitoringHistogram = new prometheus.Histogram({
    name: 'adp_backend_documentation_resp_histogram',
    help: 'ADP Portal BE Documentation Response Histogram',
    buckets: [100, 500, 1000, 5000, 10000, 15000],
  });
  customMetrics.documentationRespMonitoringHistogram = documentationRespMonitoringHistogram;

  const docCacheHitMonitoringHistogram = new prometheus.Histogram({
    name: 'adp_backend_documentation_cache_hit_histogram',
    help: 'ADP Portal BE Documentation Cache Hit Histogram',
    buckets: [100, 500, 1000, 5000, 10000, 15000],
  });
  customMetrics.docCacheHitMonitoringHistogram = docCacheHitMonitoringHistogram;

  const ciTableauRequestMonitoringHistogram = new prometheus.Histogram({
    name: 'adp_backend_ci_tableau_histogram',
    help: 'ADP Portal BE CI Tableau Histogram',
    buckets: [100, 500, 1000, 5000, 10000, 15000],
  });
  customMetrics.ciTableauRequestMonitoringHistogram = ciTableauRequestMonitoringHistogram;

  const microservicesRequestMonitoringHistogram = new prometheus.Histogram({
    name: 'adp_backend_microservices_endpoint_histogram',
    help: 'ADP Portal BE Microservices Endpoint Histogram',
    buckets: [100, 500, 1000, 5000, 10000, 15000],
    labelNames: ['type'],
  });
  customMetrics.microservicesRequestMonitoringHistogram = microservicesRequestMonitoringHistogram;

  const microservicesErrorCounter = new prometheus.Counter({
    name: 'adp_backend_microservices_endpoint_error_counter',
    help: 'ADP Portal BE Microservices Endpoint Error Counter',
  });
  customMetrics.microservicesErrorCounter = microservicesErrorCounter;

  const emailCounter = new prometheus.Counter({
    name: 'adp_backend_email_counter',
    help: 'ADP Portal BE Email Counter',
  });
  customMetrics.emailCounter = emailCounter;

  const externalErrorCounter = new prometheus.Counter({
    name: 'adp_backend_external_service_error_counter',
    help: 'ADP Portal BE External Service Error Counter',
  });
  customMetrics.externalErrorCounter = externalErrorCounter;

  const itemsInQueueCounter = new prometheus.Gauge({
    name: 'adp_backend_items_in_queue_counter',
    help: 'Total items in MasterQueue for current time',
  });
  customMetrics.itemsInQueueCounter = itemsInQueueCounter;

  const oldestItemInQueue = new prometheus.Gauge({
    name: 'adp_backend_oldest_item_in_queue',
    help: 'Oldest item added in queue',
  });
  customMetrics.oldestItemInQueue = oldestItemInQueue;

  adp.echoLog(`Custom registers created succesfully in ${(new Date()).getTime() - timer.getTime()}ms`, null, 200, packName);

  RESOLVE();
});

/**
 * This function is used to clear the registers
 * @author Omkar Sadegaonkar[zsdgmkr]
 */
const clearRegisters = () => {
  prometheus.register.clear();
};

class TutorialRegistryClass {
  /**
   * This function is used to create tutorial registry and register metrics
   * @returns {Promise} Promise object represents result of registration
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  static createTutorialRegistry() {
    return new Promise((RESOLVE) => {
      const tutorialRegistry = new prometheus.Registry();
      global.customRegisters = {
        tutorialRegistry,
      };
      this.tutorialMetric = new prometheus.Gauge({
        name: 'tutorial_metric',
        help: 'ADP Portal Tutorials Progress',
        registers: [tutorialRegistry],
        labelNames: ['name', 'id'],
      });
      RESOLVE();
    });
  }

  /**
 * This function is used to label the tutorial metrics with given name and id
 * @param {string} name Label - Name of Tutorial
 * @param {string} id of wordpress menu item
 * @param {number} count number of users who completed this tutorial
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
  static addTutorialMetricLabelByName(name, id, count = 0) {
    TutorialRegistryClass.tutorialMetric.set({ name, id }, count);
  }
}

module.exports = {
  registerCustomMetrics,
  customMetrics,
  clearRegisters,
  TutorialRegistryClass,
};
