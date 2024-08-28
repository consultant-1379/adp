/**
* [ global.adp.migration.checkCpiInMSDocs ]
* Convert CPI documentation flag / boolean value to false in All MS Docs
* @author Ravikiran [zgarsri]
*/
module.exports = MS => new Promise((RESOLVE) => {
  let updatedMS = false;
  Object.keys(MS.menu).forEach((MODE) => {
    MS.menu[MODE].release.forEach((VERSION) => {
      if (typeof VERSION.is_cpi_updated === 'undefined') {
        updatedMS = true;
        const updatedVersion = VERSION;
        updatedVersion.is_cpi_updated = false;
      }
    });
  });
  RESOLVE(updatedMS === true ? MS : true);
});
