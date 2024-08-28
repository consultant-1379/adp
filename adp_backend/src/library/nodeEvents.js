// ============================================================================================= //
/**
* [ adp.nodeEvents ]
* Set Node Events on Backend Start
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable no-console */
// ============================================================================================= //
module.exports = () => {
  const runnerMode = adp && adp.config ? adp.config.runnerMode : 'MAIN';

  const action = (TYPE, REASON, PROMISE) => {
    console.log('----------------------------------------------------------------------------------------------------');
    console.log(' ');
    console.log(' ');
    if (TYPE) { console.log('Error Type:', TYPE); }
    if (REASON) { console.log('Reason:', REASON); }
    if (PROMISE) { console.log('Promise:', PROMISE); }
    console.log(' ');
    console.log(' ');
    console.log('----------------------------------------------------------------------------------------------------');
    if (runnerMode === 'WORKER') {
      process.exit(TYPE);
    }
  };

  process.on('unhandledRejection', (REASON, PROMISE) => {
    action('unhandledRejection', REASON, PROMISE);
  });

  process.on('uncaughtException', (REASON, PROMISE) => {
    action('uncaughtException', REASON, PROMISE);
  });
};
// ============================================================================================= //
