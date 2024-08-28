// ============================================================================================= //
/**
* [ global.adp.getSizeInMemory ]
* Use a <b>3PP Solution</b> to get the size of an Object.
* @param {Object} OBJ Inform the Object to be analysed.
* @param {Boolean} STRINGMODE Could be True/False/Null
* Use <b>true</b> if you want a friendly answer.
* Use <b>false</b> or <b>null</b> to get only numbers in bytes.
* @return A string if <b>STRINGMODE</b> is <b>true</b>. If not, will be a number in bytes.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (OBJ, STRINGMODE) => {
  // ------------------------------------------------------------------------------------------- //
  let size = global.sizeof(OBJ);
  if (STRINGMODE) {
    if (size <= 0) {
      return 'Zero bytes';
    }
    if ((size / 1024) < 1) {
      return `${size} bytes`;
    }
    size /= 1024;
    if ((size / 1024) < 1) {
      return `${size.toFixed(2)} Kbytes`;
    }
    size /= 1024;
    if ((size / 1024) < 1) {
      return `${size.toFixed(2)} Mbytes`;
    }
    size /= 1024;
    if ((size / 1024) < 1) {
      return `${size.toFixed(2)} Gbytes`;
    }
    return `${size.toFixed(2)} Tbytes`;
  }
  return size;
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
