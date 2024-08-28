/**
 * This function is used to get copied name for an object.
 * Word Copy will be appended after oldName.
 * In case of multiple action, numbers from 1 will be appended
 * @param {string} oldName Name that needs to be copied
 * @param {array} allNames All existing values
 * @return {string} Copied name
 * @author Omkar Sadegaonkar [zsdgmkr]
 */

module.exports = (oldName, allNames) => {
  let i = 1;
  let newName = `${oldName} Copy`;
  while (allNames.includes(newName)) {
    newName = `${oldName} Copy ${i}`;
    i += 1;
  }
  return newName;
};
