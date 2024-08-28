const checkCpiDocumentation = require('./checkCpiDocumentation');
/**
* Unit test for [ global.adp.migration.checkCpiDocumentation ]
* @author Ravikiran [zgarsri]
*/
describe('Testing [ global.adp.migration.checkCpiDocumenation ] Migration Rule Behavior.', () => {
  it('should create check_cpi field if there is none in any collection and set to false', (done) => {
    checkCpiDocumentation({}).then((RESULT) => {
      expect(RESULT.check_cpi).toBeFalsy();
      done();
    }).catch(done.fail);
  });

  it('should not update check_cpi field', (done) => {
    checkCpiDocumentation({ check_cpi: true }).then((RESULT) => {
      expect(RESULT).toBeTruthy();
      done();
    }).catch(done.fail);
  });
});
