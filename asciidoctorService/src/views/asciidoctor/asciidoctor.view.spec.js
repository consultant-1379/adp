const proxyquire = require('proxyquire');

const mockAciiDoctorControllerResp = {
  res: {
    html: 'test html',
    logs: [],
  },
  rej: {
    message: 'error test',
    code: 500,
    data: [],
  },
};
const mockAciiDoctorController = {
  getHtml: resolveResp => new Promise((res, rej) => {
    if (resolveResp) {
      res(mockAciiDoctorControllerResp.res);
    } else {
      rej(mockAciiDoctorControllerResp.rej);
    }
  }),
};

const mockEchoLib = {
  log: () => {},
};

const mockRes = {
  json: data => data,
  send: data => data,
  status: () => {},
};

const asciiDoctorView = proxyquire('./asciidoctor.view', {
  '../../controllers/asciidoctor/asciidoctor.controller': mockAciiDoctorController,
  '../../lib/echolog/echo.lib': mockEchoLib,
});

describe('asciidoctor View, ', () => {
  it('asciiToHtml: Should return html and logs.', async () => {
    const req = { body: { ascii: true } };
    const result = await asciiDoctorView.asciiToHtml(req, mockRes);
    const expObj = mockAciiDoctorControllerResp.res;

    expect(result.html).toBe(expObj.html);
    expect(result.logs.length).toBe(0);
  });

  it('asciiToHtml: Should reject if the controllers getHtml rejects.', async () => {
    const req = { body: { ascii: false } };
    const result = await asciiDoctorView.asciiToHtml(req, mockRes);
    const expObj = mockAciiDoctorControllerResp.rej;

    expect(result.message).toBe(expObj.message);
    expect(result.code).toBe(expObj.code);
    expect(result.data.length).toBe(expObj.data.length);
  });
});
