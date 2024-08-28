// ============================================================================================= //
/**
* Unit test for [ global.adp.AnswerClass ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Creating a class from [ global.adp.answerClass ] and testing... ', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.AnswerClass = require('./AnswerClass'); // eslint-disable-line global-require
    global.test = {};
    global.test.answer = new global.adp.AnswerClass();
    global.test.answer.setCode(200);
    global.test.answer.setPage(1);
    global.test.answer.setLimit(99999);
    global.test.answer.setTotal(99);
    global.test.answer.setTime(1);
    global.test.answer.setSize(1);
    global.test.answer.setCache('Not from cache!');
    global.test.answer.setMessage('Testing Message...');
    global.test.answer.setWarning(['Testing Warning...']);
    global.test.answer.setData({ obj: 'test' });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('getCode() should returns 200.', () => {
    expect(global.test.answer.getCode()).toEqual(200);
  });

  it('getWarning() should returns an array.', () => {
    expect(global.test.answer.getWarning()).toEqual(['Testing Warning...']);
  });

  it('getData() should returns a object.', () => {
    expect(global.test.answer.getData()).toEqual({ obj: 'test' });
  });

  it('getAnswer() should returns a full object.', () => {
    const resultSTR = '{"code":200,"page":1,"limit":99999,"total":99,"time":1,"size":1,"cache":"Not from cache!","message":"Testing Message...","warning":["Testing Warning..."],"data":{"obj":"test"}}';

    expect(global.test.answer.getAnswer()).toEqual(resultSTR);
  });

  it('getAnswer() should returns a full object, but Warning is an empty Array.', () => {
    global.test.answer.setWarning([]);
    const resultSTR = '{"code":200,"page":1,"limit":99999,"total":99,"time":1,"size":1,"cache":"Not from cache!","message":"Testing Message...","data":{"obj":"test"}}';

    expect(global.test.answer.getAnswer()).toEqual(resultSTR);
  });

  it('getAnswer() should returns a full object, but Warning is not an Array.', () => {
    global.test.answer.setWarning(null);
    const resultSTR = '{"code":200,"page":1,"limit":99999,"total":99,"time":1,"size":1,"cache":"Not from cache!","message":"Testing Message...","data":{"obj":"test"}}';

    expect(global.test.answer.getAnswer()).toEqual(resultSTR);
  });

  it('getQueueLink() should returns 200.', () => {
    global.test.answer.setQueueLink(200);

    expect(global.test.answer.getQueueLink()).toEqual(200);
  });
});
// ============================================================================================= //
