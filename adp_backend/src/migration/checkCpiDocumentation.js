/**
* [ global.adp.migration.checkCpiDocumentation ]
* Convert CPI documentation flag / boolean value to false ( ADPPRG-73265 ).
* @author Cein [edaccei] | Ravikiran [zgarsri]
*/
module.exports = MS => new Promise((RESOLVE) => {
  if (typeof MS.check_cpi !== 'undefined') {
    RESOLVE(true);
  } else {
    const updatedMS = MS;

    updatedMS.check_cpi = false;

    RESOLVE(updatedMS);
  }
});
