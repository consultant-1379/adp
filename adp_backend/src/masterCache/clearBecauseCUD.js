/**
* [ global.adp.masterCache.clearBecauseCUD ]
* Reset the minimal of cache based on Create/Update/Delete of microservice.
* Documentation: https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Cache+System
* @author Armando Dias [zdiaarm]
*/

// Necessary for Internal Documentation - https://localhost:9999/doc/
global.adp.docs.list.push(__filename);


module.exports = (ASSETID = null) => {
  // Command Shortcut
  const { clear } = global.adp.masterCache;
  // Clearing the Object with contains Marketplace/innersource contributors results
  clear('MARKETPLACESEARCHS');
  clear('INNERSOURCECONTRIBS');
  // Clearing the Object with contains All Assets
  if (ASSETID === null) {
    clear('ALLASSETS');
    clear('ALLUSERS');
    clear('ALLASSETSNORMALISED');
  } else {
    clear('ALLASSETS', null, ASSETID);
    clear('ALLASSETSNORMALISED', null, ASSETID);
    clear('DOCUMENTS', ASSETID);
    clear('ALLUSERS', null, ASSETID);
  }
  // Clearing the Object with contains the list
  // of Microservices for Administration and
  // trying to call the Garbage Collector
  // (If Available)
  clear('MSGETBYONWER', null, null, true);
};
