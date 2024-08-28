// ============================================================================================= //
/**
* [ global.adp.dateFormat ]
* Get a date and return a friendly readable string date.
* @param {date} DT A valid date in JavaScript System Format.
* @return {str} String with a date written.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (DT, TIMESTAMP) => {
  // ------------------------------------------------------------------------------------------- //
  if (DT === null || DT === undefined || DT === '' || Array.isArray(DT) || DT === {}) {
    return '';
  }

  const dateOBJ = new Date(DT);
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

  if (TIMESTAMP !== true) {
    return (`${d}/${m}/${y} at ${h}:${mm}:${s}:${ms}`);
  }
  return (`${y}${m}${d}${h}${mm}${s}${ms}`);
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
