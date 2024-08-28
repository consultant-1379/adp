// ============================================================================================= //
/**
* [ npm run gerritContributorsStatistics ]
* gerritContributorsStatistics/start.js
* @author Armando Dias [zdiaarm]
*
* Script to be called by Cron Task a few times per day. It will collect the Gerrit Statistics
* of each microservice ( if the "giturl" follow some rules ) and save it on database.
*/
// ============================================================================================= //

const start = require('./startFunction');

const justThisMicroservice = null;

start('CLASSICMODE', justThisMicroservice)
  .then(() => {
    start('TAGMODE', justThisMicroservice)
      .then(() => {})
      .catch(() => {});
  })
  .catch(() => {});

// ============================================================================================= //
