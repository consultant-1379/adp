
/**
 * This function is used to get denormalized values of compliance field
 * @param {Array} complinaceArray Compliance fields
 * @returns Array of denormalized compliance values
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const denormalizeFields = (complinaceArray) => {
  const tempCompArray = [];
  const complianceOptions = adp.clone(global.adp.complianceOptions.cache.options)
  || '{"answers":[],"groups":[]}';
  const { groups, answers } = JSON.parse(complianceOptions);
  complinaceArray.forEach((compItem) => {
    const tempObj = {};
    const validGroup = groups.find(group => group.id === compItem.group);
    tempObj.group = validGroup ? validGroup.group : compItem.group;
    tempObj.fields = [];
    compItem.fields.forEach((fieldItem) => {
      const validField = validGroup
        ? validGroup.fields.find(item => item.id === fieldItem.field) : null;
      const validAnswer = answers.find(ans => ans.id === fieldItem.answer);
      tempObj.fields.push({
        field: validField ? validField.name : fieldItem.field,
        answer: validAnswer ? validAnswer.name : fieldItem.answer,
        comment: fieldItem.comment,
      });
    });
    tempCompArray.push(tempObj);
  });
  return tempCompArray;
};

module.exports = {
  denormalizeFields,
};
