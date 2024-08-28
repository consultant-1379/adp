// ============================================================================================= //
/**
* [ global.adp.dateLogSystemFormat ]
* Get the current date/time and return a string for file names or logs.
* @return {str} String with a date written.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (DATE = null) => {
  // ------------------------------------------------------------------------------------------- //
  let dateOBJ;
  if (DATE === null) {
    dateOBJ = new Date();
  } else {
    dateOBJ = DATE;
  }
  const y = `${dateOBJ.getFullYear()}`;
  let m = `${(dateOBJ.getMonth() + 1)}`;
  if (m.length === 1) { m = `0${m}`; }
  let d = `${dateOBJ.getDate()}`;
  if (d.length === 1) { d = `0${d}`; }
  let h = `${dateOBJ.getHours()}`;
  if (h.length === 1) { h = `0${h}`; }
  let mm = `${dateOBJ.getMinutes()}`;
  if (mm.length === 1) { mm = `0${mm}`; }
  let s = `${dateOBJ.getSeconds()}`;
  if (s.length === 1) { s = `0${s}`; }
  let ms = `${dateOBJ.getMilliseconds()}`;
  if (ms.length === 1) { ms = `000${ms}`; }
  if (ms.length === 2) { ms = `00${ms}`; }
  if (ms.length === 3) { ms = `0${ms}`; }
  const retOBJ = {
    y,
    m,
    d,
    simple: `${y}-${m}-${d}`,
    fileName: `${y}-${m}-${d}_${h}-${mm}`,
  };
  return retOBJ;
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
