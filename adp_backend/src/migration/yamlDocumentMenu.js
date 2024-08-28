/**
* [global.adp.migration.yamlDocumentMenu]
* Update all microservices to follow the artifactory yaml file structure
* The layout can be found in design: https://cc-jira.rnd.ki.sw.ericsson.se/browse/ADPPRG-24130
* @param {obj} MS the current microservice object of a service.
* @returns {obj/bool} returns a updated MS object if the object was not changed it returns true
* @author Cein [edaccei]
*/

global.adp.docs.list.push(__filename);

module.exports = MS => new Promise((resolve) => {
  const updatedMSObj = MS;
  let msHasBeenUpdated = false;

  if (typeof updatedMSObj.menu_auto === 'undefined') {
    updatedMSObj.menu_auto = false;
    msHasBeenUpdated = true;
  }

  if (typeof updatedMSObj.repo_urls === 'undefined') {
    updatedMSObj.repo_urls = {
      development: '',
      release: '',
    };
    msHasBeenUpdated = true;
  }

  if (typeof updatedMSObj.menu === 'undefined') {
    updatedMSObj.menu = {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    };
    msHasBeenUpdated = true;
  }

  if (msHasBeenUpdated) {
    resolve(updatedMSObj);
  } else {
    resolve(true);
  }
});
