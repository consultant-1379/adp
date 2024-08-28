// ============================================================================================= //
/**
* Unit test for [ global.adp.masterCache.clear ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing of [ global.adp.masterCache.clear ] behavior', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};
    global.adp.quickTypeErrorMessage = () => 'mockError';
    global.garbageCollectorCalled = false;
    global.gc = () => {
      global.garbageCollectorCalled = true;
    };
    global.adp.masterCache = {};
    global.adp.masterCache.gcMinimalTimer = 0;
    global.adp.masterCacheTimeOut = {};
    global.adp.masterCacheTimeOut.minimumGarbageCollectorCall = 0;
    // eslint-disable-next-line global-require
    global.adp.masterCache.clear = require('./clear');
  });

  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should clear all the mock cache', async (done) => {
    global.adp.masterCache.cache = { basicMockCache: '123' };
    await global.adp.masterCache.clear();
    if (global.adp.masterCache.cache === undefined) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should clear one specific object from cache', async (done) => {
    global.adp.masterCache.cache = {
      basicMockCache1: 'something',
      basicMockCache2: 'something',
      basicMockCache3: 'something',
    };
    await global.adp.masterCache.clear('basicMockCache2');
    const situationOne = global.adp.masterCache.cache.basicMockCache1 !== undefined;
    const situationTwo = global.adp.masterCache.cache.basicMockCache2 === undefined;
    const situationThree = global.adp.masterCache.cache.basicMockCache3 !== undefined;
    if (situationOne && situationTwo && situationThree) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should clear one specific item inside of an object from cache', async (done) => {
    global.adp.masterCache.cache = {
      basicMockCache1: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
      basicMockCache2: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
      basicMockCache3: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
    };
    await global.adp.masterCache.clear('basicMockCache2', null, 'item2');
    const situationOne = global.adp.masterCache.cache.basicMockCache1 !== undefined;
    const situationTwo = global.adp.masterCache.cache.basicMockCache2.item2 === undefined;
    const situationThree = global.adp.masterCache.cache.basicMockCache3 !== undefined;
    if (situationOne && situationTwo && situationThree) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should clear one specific item inside of an object from cache and call the garbage collector', async (done) => {
    global.adp.masterCache.cache = {
      basicMockCache1: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
      basicMockCache2: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
      basicMockCache3: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
    };
    let gcSituationOne = false;
    if (global.garbageCollectorCalled === false) {
      gcSituationOne = true;
    }
    await global.adp.masterCache.clear('basicMockCache2', null, 'item2', true);
    const situationOne = global.adp.masterCache.cache.basicMockCache1 !== undefined;
    const situationTwo = global.adp.masterCache.cache.basicMockCache2.item2 === undefined;
    const situationThree = global.adp.masterCache.cache.basicMockCache3 !== undefined;
    let gcSituationTwo = false;
    if (global.garbageCollectorCalled === true) {
      gcSituationTwo = true;
    }
    if (gcSituationOne && gcSituationTwo && situationOne && situationTwo && situationThree) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should clear one specific object from cache with shortcut and call the garbage collector', async (done) => {
    global.adp.masterCache.cache = {
      basicMockCache1: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
      basicMockCache2: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
      basicMockCache2SHORTCUT: {
        aWQx: { id: 'item1' },
        aWQy: { id: 'item2' },
        aWQz: { id: 'item3' },
      },
      basicMockCache3: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
    };
    let gcSituationOne = false;
    if (global.garbageCollectorCalled === false) {
      gcSituationOne = true;
    }
    await global.adp.masterCache.clear('basicMockCache2', null, null, true);
    const situationOne = global.adp.masterCache.cache.basicMockCache1 !== undefined;
    const situationTwo = global.adp.masterCache.cache.basicMockCache2 === undefined;
    const situationThree = global.adp.masterCache.cache.basicMockCache3 !== undefined;
    const situationFour = global.adp.masterCache.cache.basicMockCache2SHORTCUT === undefined;
    let gcSituationTwo = false;
    if (global.garbageCollectorCalled === true) {
      gcSituationTwo = true;
    }
    if (gcSituationOne && gcSituationTwo && situationOne
      && situationTwo && situationThree && situationFour) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should clear one specific item inside of an object from cache with shortcut and call the garbage collector', async (done) => {
    global.adp.masterCache.cache = {
      basicMockCache1: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
      basicMockCache2: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
      basicMockCache2SHORTCUT: {
        aWQx: { id: 'item1' },
        aWQy: { id: 'item2' },
        aWQz: { id: 'item3' },
      },
      basicMockCache3: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
    };
    let gcSituationOne = false;
    if (global.garbageCollectorCalled === false) {
      gcSituationOne = true;
    }
    await global.adp.masterCache.clear('basicMockCache2', null, 'item2', true);
    const situationOne = global.adp.masterCache.cache.basicMockCache1 !== undefined;
    const situationTwo = global.adp.masterCache.cache.basicMockCache2['aXRlbTI='] === undefined;
    const situationThree = global.adp.masterCache.cache.basicMockCache3 !== undefined;
    const situationFour = global.adp.masterCache.cache.basicMockCache2SHORTCUT.aWQy === undefined;
    let gcSituationTwo = false;
    if (global.garbageCollectorCalled === true) {
      gcSituationTwo = true;
    }
    if (gcSituationOne && gcSituationTwo && situationOne
      && situationTwo && situationThree && situationFour) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should clear one specific item inside of an subobject from cache and call the garbage collector', async (done) => {
    global.adp.masterCache.cache = {
      basicMockCache1: {
        basicMockCache1SubObject: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
        basicMockCache2SubObject: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
        basicMockCache3SubObject: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
      },
    };
    let gcSituationOne = false;
    if (global.garbageCollectorCalled === false) {
      gcSituationOne = true;
    }
    await global.adp.masterCache.clear('basicMockCache1', 'basicMockCache2SubObject', 'item2', true);
    const situationOne = global.adp.masterCache.cache.basicMockCache1 !== undefined;
    const situationTwo = global.adp
      .masterCache.cache.basicMockCache1.basicMockCache1SubObject !== undefined;
    const situationThree = global.adp
      .masterCache.cache.basicMockCache1.basicMockCache2SubObject['aXRlbTI='] === undefined;
    const situationFour = global.adp
      .masterCache.cache.basicMockCache1.basicMockCache3SubObject !== undefined;
    const situationFive = global.adp
      .masterCache.cache.basicMockCache1.basicMockCache2SubObject['aXRlbTE='] !== undefined;
    const situationSix = global.adp
      .masterCache.cache.basicMockCache1.basicMockCache2SubObject['aXRlbTM='] !== undefined;
    let gcSituationTwo = false;
    if (global.garbageCollectorCalled === true) {
      gcSituationTwo = true;
    }
    if (gcSituationOne && gcSituationTwo && situationOne
      && situationTwo && situationThree && situationFour
      && situationFive && situationSix) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should clear one specific item inside of an subobject from cache with shortcut and call the garbage collector', async (done) => {
    global.adp.masterCache.cache = {
      basicMockCache1: {
        basicMockCache1SubObject: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
        basicMockCache2SubObject: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
        basicMockCache3SubObject: { 'aXRlbTE=': 'something', 'aXRlbTI=': 'something', 'aXRlbTM=': 'something' },
      },
      basicMockCache1SHORTCUT: {
        basicMockCache1SubObject: {
          'aXRlbTE=': { id: 'item1' },
          'aXRlbTI=': { id: 'item2' },
          'aXRlbTM=': { id: 'item3' },
        },
        basicMockCache2SubObject: {
          'aXRlbTE=': { id: 'item1' },
          'aXRlbTI=': { id: 'item2' },
          'aXRlbTM=': { id: 'item3' },
        },
        basicMockCache3SubObject: {
          'aXRlbTE=': { id: 'item1' },
          'aXRlbTI=': { id: 'item2' },
          'aXRlbTM=': { id: 'item3' },
        },
      },
    };
    let gcSituationOne = false;
    if (global.garbageCollectorCalled === false) {
      gcSituationOne = true;
    }
    await global.adp.masterCache.clear('basicMockCache1', 'basicMockCache2SubObject', 'item2', true);
    const situationOne = global.adp.masterCache.cache.basicMockCache1 !== undefined;
    const situationTwo = global.adp
      .masterCache.cache.basicMockCache1.basicMockCache1SubObject !== undefined;
    const situationThree = global.adp
      .masterCache.cache.basicMockCache1.basicMockCache2SubObject['aXRlbTI='] === undefined;
    const situationFour = global.adp
      .masterCache.cache.basicMockCache1.basicMockCache3SubObject !== undefined;
    const situationFive = global.adp
      .masterCache.cache.basicMockCache1.basicMockCache2SubObject['aXRlbTE='] !== undefined;
    const situationSix = global.adp
      .masterCache.cache.basicMockCache1.basicMockCache2SubObject['aXRlbTM='] !== undefined;

    const situationShortcutOne = global.adp
      .masterCache.cache.basicMockCache1SHORTCUT.basicMockCache2SubObject['aXRlbTE='] !== undefined;
    const situationShortcutTwo = global.adp
      .masterCache.cache.basicMockCache1SHORTCUT.basicMockCache2SubObject['aXRlbTI='] === undefined;
    const situationShortcutThree = global.adp
      .masterCache.cache.basicMockCache1SHORTCUT.basicMockCache2SubObject['aXRlbTM='] !== undefined;
    const situationShortcutFour = global.adp
      .masterCache.cache.basicMockCache1SHORTCUT.basicMockCache1SubObject !== undefined;
    const situationShortcutFive = global.adp
      .masterCache.cache.basicMockCache1SHORTCUT.basicMockCache3SubObject !== undefined;
    let gcSituationTwo = false;
    if (global.garbageCollectorCalled === true) {
      gcSituationTwo = true;
    }
    if (gcSituationOne && gcSituationTwo
      && situationOne && situationTwo
      && situationThree && situationFour
      && situationFive && situationSix
      && situationShortcutOne && situationShortcutTwo
      && situationShortcutThree && situationShortcutFour
      && situationShortcutFive) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Wrong parameter: OBJ cannot be null/undefined if SUBOBJ and/or ITEM are not null/undefined', async (done) => {
    global.adp.masterCache.cache = { basicMockCache: '123' };
    const result = await global.adp.masterCache.clear(null, 'subObject', 'item');
    if (typeof result === 'string' && result.length > 0) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Wrong parameter: OBJ is not string/null/undefined', async (done) => {
    global.adp.masterCache.cache = { basicMockCache: '123' };
    const result = await global.adp.masterCache.clear(123);
    if (typeof result === 'string' && result.length > 0) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Wrong parameter: SUBOBJ is not string/null/undefined', async (done) => {
    global.adp.masterCache.cache = { basicMockCache: '123' };
    const result = await global.adp.masterCache.clear('MOCK', []);
    if (typeof result === 'string' && result.length > 0) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Wrong parameter: ITEM is not string/null/undefined', async (done) => {
    global.adp.masterCache.cache = { basicMockCache: '123' };
    const result = await global.adp.masterCache.clear('MOCK', null, []);
    if (typeof result === 'string' && result.length > 0) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Wrong parameter: GC is not boolean/null/undefined', async (done) => {
    global.adp.masterCache.cache = { basicMockCache: '123' };
    const result = await global.adp.masterCache.clear('MOCK', null, 'ITEM', 1);
    if (typeof result === 'string' && result.length > 0) {
      done();
    } else {
      fail();
      done();
    }
  });
  // =========================================================================================== //
});
