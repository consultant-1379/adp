// ============================================================================================= //
/**
* [ cs.finalTimerLine ]
* @author Armando Dias [zdiaarm]
*
* Enter with two timestamps ((new Date()).getTimer()) and got a string
* with a friendly result to display.
*/
// ============================================================================================= //
module.exports = (FIRSTTIMER, LASTTIMER, JUSTTHETIME = false) => {
// ============================================================================================= //
  const finalTimer = LASTTIMER - FIRSTTIMER;
  let minutes = Math.floor(finalTimer / 60000);
  if (minutes === 0) {
    minutes = '';
  } else if (minutes === 1) {
    minutes = '1 minute';
  } else {
    minutes = `${minutes} minutes`;
  }
  let seconds = ((finalTimer % 60000) / 1000).toFixed(0);
  if (seconds === 0 || seconds === '0') {
    seconds = '';
  } else if (seconds === 1 || seconds === '1') {
    seconds = '1 second';
  } else {
    seconds = `${seconds} seconds`;
  }
  if (minutes !== '') {
    if (seconds !== '') {
      seconds = ` and ${seconds}`;
    }
  }
  let milliseconds = '';
  if ((`${minutes}`).length === 0 && (`${seconds}`).length === 0) {
    milliseconds = `${finalTimer}ms`;
  }
  if (JUSTTHETIME === true) {
    return `${minutes}${seconds}${milliseconds}`;
  }
  return `All process finished in ${minutes}${seconds}${milliseconds}.`;
};
// ============================================================================================= //
