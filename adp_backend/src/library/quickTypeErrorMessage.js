/**
* Exported Method: [ global.adp.quickTypeErrorMessage ]
* Synchronously prepare an small error message to return and print
* a more complete message on console log. Used only when the
* type of variable not match with the expected.
* @author Armando Dias [zdiaarm]
*/


// Necessary for Internal Documentation - https://localhost:9999/doc/
global.adp.docs.list.push(__filename);


/**
* Exported Method: [ global.adp.quickTypeErrorMessage ]
* @param {String} NAME A String with the name of the parameter.
* @param {String} TYPE A String, with the type(s) which the parameter should be.
* @param {Any} VALUE The value of the parameter.
* @param {String} FROM The name of the module which calls this method.
* @return {String} Returns a small error message as string and echo a more
* complete string on console log.
* @author Armando Dias [zdiaarm]
*/
module.exports = (NAME, TYPE, VALUE, FROM) => {
  const errorMessage = `${NAME} should be ${TYPE}`;
  const errorText = `${errorMessage}, instead of "${VALUE}"/"${typeof VALUE}"`;
  const errorOBJ = {
    name: NAME,
    type: TYPE,
    value: VALUE,
    from: FROM,
  };
  adp.echoLog(errorText, errorOBJ, 500, FROM);
  return errorMessage;
};
