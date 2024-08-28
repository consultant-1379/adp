// ============================================================================================= //
/**
* [ global.adp.friendlyBytes ]
* Get a byte number and convert to something easier to be read.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (BYTES) => {
  // ------------------------------------------------------------------------------------------- //
  let size = BYTES;
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
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
