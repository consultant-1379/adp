// ============================================================================================= //
/**
* [ global.adp.getSizeStatusToEchoOnLoad ]
* Just print into Terminal Screen and/or in Log files, the size of <b>[ global.adp ]</b> Object.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = async () => {
  // ------------------------------------------------------------------------------------------- //
  let obj = null;
  if (adp.config.displayPackagesSizeOnLoad === true) {
    adp.echoDivider();
    const memory = process.memoryUsage();
    const rssUsed = memory.rss / 1024 / 1024;
    const heapUsed = memory.heapUsed / 1024 / 1024;
    const heapTotal = memory.heapTotal / 1024 / 1024;
    const external = memory.external / 1024 / 1024;
    adp.echoLog(`Resident Set Size (RSS) - ${rssUsed.toFixed(2)} MB`, null, 0, 'process.memoryUsage()');
    adp.echoLog(`Heap Memory (Used) ------ ${heapUsed.toFixed(2)} MB`, null, 0, 'process.memoryUsage()');
    adp.echoLog(`Heap Memory (Total) ----- ${heapTotal.toFixed(2)} MB`, null, 0, 'process.memoryUsage()');
    adp.echoLog(`External Memory --------- ${external.toFixed(2)} MB`, null, 0, 'process.memoryUsage()');
    adp.echoDivider();
    obj = {
      memory: {
        rss: `${rssUsed.toFixed(2)} MB`,
        heapused: `${heapUsed.toFixed(2)} MB`,
        heaptotal: `${heapTotal.toFixed(2)} MB`,
        external: `${external.toFixed(2)} MB`,
      },
    };
  }
  return obj;
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
