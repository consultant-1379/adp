// ============================================================================================= //
/**
* Unit test for [ global.adp.dynamicSort ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.dynamicSort ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.dynamicSort = require('./dynamicSort'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  // =========================================================================================== //
  it('Sorting an Array by "name" property (ASC).', () => {
    const testArray = [
      { name: 'EName' },
      { name: 'FName' },
      { name: 'BName' },
      { name: 'DName' },
      { name: 'AName' },
      { name: 'CName' },
    ];
    const expectedResult = [
      { name: 'AName' },
      { name: 'BName' },
      { name: 'CName' },
      { name: 'DName' },
      { name: 'EName' },
      { name: 'FName' },
    ];
    const resultArray = testArray.sort(global.adp.dynamicSort('name'));
    const isEqual = (resultArray.toString() === expectedResult.toString());

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //
  it('Sorting an Array by "name" property (DESC).', () => {
    const testArray = [
      { name: 'EName' },
      { name: 'FName' },
      { name: 'BName' },
      { name: 'DName' },
      { name: 'AName' },
      { name: 'CName' },
    ];
    const expectedResult = [
      { name: 'FName' },
      { name: 'EName' },
      { name: 'DName' },
      { name: 'CName' },
      { name: 'BName' },
      { name: 'AName' },
    ];
    const resultArray = testArray.sort(global.adp.dynamicSort('-name'));
    const isEqual = (resultArray.toString() === expectedResult.toString());

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //
  it('Sorting an Array by "category" (ASC) and then by "name" (ASC).', () => {
    const testArray = [
      { category: 'catC', name: 'HName' },
      { category: 'catB', name: 'EName' },
      { category: 'catB', name: 'DName' },
      { category: 'catC', name: 'IName' },
      { category: 'catA', name: 'CName' },
      { category: 'catC', name: 'GName' },
      { category: 'catA', name: 'AName' },
      { category: 'catB', name: 'FName' },
      { category: 'catA', name: 'BName' },
    ];
    const expectedResult = [
      { category: 'catA', name: 'AName' },
      { category: 'catA', name: 'BName' },
      { category: 'catA', name: 'CName' },
      { category: 'catB', name: 'DName' },
      { category: 'catB', name: 'EName' },
      { category: 'catB', name: 'FName' },
      { category: 'catC', name: 'GName' },
      { category: 'catC', name: 'HName' },
      { category: 'catC', name: 'IName' },
    ];
    const resultArray = testArray.sort(global.adp.dynamicSort(['category', 'name']));
    const isEqual = (resultArray.toString() === expectedResult.toString());

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //
  it('Sorting an Array by "category" (DESC), by "age" (ASC) and then by "name" (DESC).', () => {
    const testArray = [
      { category: 'catA', age: 20, name: 'SameFirstName SameSurName' },
      { category: 'catB', age: 30, name: 'SameFirstName SameSurName' },
      { category: 'catC', age: 41, name: 'SameFirstName SameSurName' },
      { category: 'catB', age: 31, name: 'SameFirstName SameSurName' },
      { category: 'catA', age: 21, name: 'SameFirstName SameSurName' },
      { category: 'catC', age: 40, name: 'SameFirstName SameSurName' },
      { category: 'catA', age: 20, name: 'SameFirstName DifferentSurName' },
      { category: 'catB', age: 31, name: 'SameFirstName DifferentSurName' },
      { category: 'catC', age: 40, name: 'SameFirstName DifferentSurName' },
    ];
    const expectedResult = [
      { category: 'catC', age: 40, name: 'SameFirstName SameSurName' },
      { category: 'catC', age: 40, name: 'SameFirstName DifferentSurName' },
      { category: 'catC', age: 41, name: 'SameFirstName SameSurName' },
      { category: 'catB', age: 30, name: 'SameFirstName SameSurName' },
      { category: 'catB', age: 31, name: 'SameFirstName DifferentSurName' },
      { category: 'catB', age: 31, name: 'SameFirstName SameSurName' },
      { category: 'catA', age: 20, name: 'SameFirstName SameSurName' },
      { category: 'catA', age: 20, name: 'SameFirstName DifferentSurName' },
      { category: 'catA', age: 21, name: 'SameFirstName SameSurName' },
    ];
    const resultArray = testArray.sort(global.adp.dynamicSort(['-category', 'age', '-name']));
    const isEqual = (resultArray.toString() === expectedResult.toString());

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //
});
// ============================================================================================= //
