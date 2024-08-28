const echo = require('./echo.lib');

describe('Echolog lib, ', () => {
  it('log: Should be a function.', () => {
    const { log } = echo;

    expect(typeof log).toBe('function');
  });
});
