const promiseAllSettled = require('./promiseAllSettledPollyfill');

describe('Testing [ adp.promiseAllSettled ] behavior', () => {
  it('should resolve with a combination of promise resolves and promise rejects', (done) => {
    const resTest = 'testRes';
    const rejTest = 'testRej';
    const testArr = [
      Promise.resolve(resTest),
      Promise.reject(rejTest),
    ];

    promiseAllSettled(testArr).then((result) => {
      const [resolveTest, rejectTest] = result;

      expect(resolveTest.status).toBe('fulfilled');
      expect(resolveTest.value).toBe(resTest);
      expect(rejectTest.status).toBe('rejected');
      expect(rejectTest.reason).toBe(rejTest);
      done();
    }).catch(() => done.fail());
  });

  it('should resolve an empty promise array if an empty array is given', (done) => {
    promiseAllSettled([]).then((result) => {
      expect(result).toEqual([]);
      done();
    }).catch(() => done.fail());
  });

  it('should not replace the existing object key Promise.allSettled', (done) => {
    const testVal = 'Done';
    delete Promise.allSettled;
    Promise.allSettled = () => Promise.resolve(testVal);

    promiseAllSettled([Promise.resolve(true)]).then((result) => {
      expect(result).toBe(testVal);
      done();
    }).catch(() => done.fail());
  });
});
