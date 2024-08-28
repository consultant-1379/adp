// ============================================================================================= //
/**
* [ adp.elasticSearchStart ]
* Initialize the connection with the Elastic Search
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => {
  const { Client } = require('@elastic/elasticsearch');
  adp.elasticSearch = new Client({ node: adp.config.elasticSearchAddress });

  const packName = 'adp.elasticSearchStart';
  const timerMSG = `[+${global.adp.timeStepNext()}]`;
  adp.echoLog(`${timerMSG} Loading 'ElasticSearch' and connecting on Database Server...`, null, 200, packName);
};
// ============================================================================================= //
