/**
* [ global.adp.migration.addTutorialToAdditionalInfo ]
* Add Tutorials to Additional Information inside Microservices ( ADPPRG-80357 )
* @author Ravikiran [zgarsri]
*/

module.exports = MS => new Promise((RESOLVE, REJECT) => {
  const updatedMS = MS;
  let tutorialTitle = 'Service Tutorial';
  if (updatedMS.tutorial) {
    const tutUrlArray = (updatedMS.tutorial || '').split('/');
    const slug = tutUrlArray.pop();
    adp.tutorials.getBySlug(slug, true).then((TITLERESP) => {
      tutorialTitle = TITLERESP && TITLERESP.title ? TITLERESP.title : tutorialTitle;
      const tutorialObj = {
        category: 'tutorial',
        title: tutorialTitle,
        link: updatedMS.tutorial,
      };
      updatedMS.additional_information = [];
      updatedMS.additional_information.push(tutorialObj);
      updatedMS.tutorial = '';
      RESOLVE(updatedMS);
    })
      .catch((error) => {
        const errorObj = {
          message: 'Failed to add additional information',
          code: 500,
          data: {
            MS, error, origin: 'migration.addTutorialToAdditionalInfo',
          },
        };
        REJECT(errorObj);
      });
  } else {
    RESOLVE(MS);
  }
});
