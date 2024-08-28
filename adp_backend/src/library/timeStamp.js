// ============================================================================================= //
/**
* [ global.adp.timeStamp ]
* Returns a timestamp string.
* @param {boolean} V If true, returns a friendly timestamp. If false, returns just a timestamp.
* @param {boolean} setMs include milliseconds
* @return {str} String with the timestamp of the current date/time.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (V, setMs = true) => {
  // ------------------------------------------------------------------------------------------- //
  const dateOBJ = new Date();
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
  if (V) {
    return (`${y}/${m}/${d} ${h}:${mm}:${s}${(setMs ? `:${ms}` : '')}`);
  }
  return (`${y}${m}${d}${h}${mm}${s}${(setMs ? ms : '')}`);
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
