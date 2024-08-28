/* eslint-disable no-restricted-syntax */
// ============================================================================================= //
/**
* [ global.adp.assembly.getComponentServicesFromAssembly ]
* Retrieve an Assembly for reading.
* @param {Array} ids/slug A simple String with the ID of the Assembly.
* @return {JSON} Returns a JSON Object containing the information of the Microservices.
* @author Tirth Pipalia [zpiptir]
*/
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
const assemblyMSBuildup = (ASSEMBLY, MSID) => new Promise((resolve) => {
  const adpModel = new adp.models.Adp(['microservice']);
  adpModel.getMSByIdForAssembly(MSID).then((MS) => {
    const MSASSEMBLY = MS.docs[0];
    MSASSEMBLY.assembly_id = ASSEMBLY._id;
    MSASSEMBLY.assembly_name = ASSEMBLY.name;
    fetchDenormObject(MSASSEMBLY).then((data) => {
      MSASSEMBLY.denorm = data;
      resolve(MSASSEMBLY);
    });
  });
});

/* Returns an object which contains the denormalized fields of the provided microservice */
const fetchDenormObject = MSASSEMBLY => new Promise(async (RESOLVE, REJECT) => {
  await global.adp.microservices.denormalize(MSASSEMBLY)
    .then((DENORMALIZED) => {
      adp.echoLog(`MSASSEMBLY [${MSASSEMBLY.slug}] denormalised`, null, 200);
      RESOLVE(DENORMALIZED);
    })
    .catch(ERROR => REJECT(ERROR));
});
// ============================================================================================= //
module.exports = ASSEMBLYARRAY => new Promise(async (RESOLVE, REJECT) => {
  const denormComponenService = [];
  for (const ASSEMBLY of ASSEMBLYARRAY) {
    if (ASSEMBLY.component_service && ASSEMBLY.component_service.length > 0) {
      for (const MSID of ASSEMBLY.component_service) {
        denormComponenService.push(assemblyMSBuildup(ASSEMBLY, MSID));
      }
    }
  }
  Promise.all(denormComponenService).then((modifiedResp) => {
    RESOLVE(modifiedResp);
  })
    .catch(ERROR => REJECT(ERROR));

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
