// ============================================================================================= //
/**
* [ cs.executionTimer ]
* @author Armando Dias [zdiaarm]
*
* Calculate the total execution timer. This function uses
* cs.finalTimerLine() to make a more friendly result.
*/
// ============================================================================================= //
module.exports = () => {
// ============================================================================================= //
  if (adp.fullLogStart === undefined) {
    adp.fullLogStart = new Date();
  }
  let startTimer = adp.fullLogStart;
  const nowTimer = new Date();
  const executionTimer = cs.finalTimerLine(startTimer, nowTimer, true);
  return executionTimer;
};
// ============================================================================================= //
