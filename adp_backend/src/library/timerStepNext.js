// ============================================================================================= //
/**
* [ global.adp.timeStepNext ]
* After the initialization of [ global.adp.timerStepTimer ] using [ global.adp.timeStepStart ],
* this method returns how many time takes from the last initialization call.
* @return {str} String with 4 digits minimum ( In milliseconds ).
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => {
  // ------------------------------------------------------------------------------------------- //
  const T = new Date();
  let ms = `${Math.abs(T - global.adp.timerStepTimer)}`;
  if (ms.length === 1) { ms = `000${ms}`; }
  if (ms.length === 2) { ms = `00${ms}`; }
  if (ms.length === 3) { ms = `0${ms}`; }
  return ms;
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
