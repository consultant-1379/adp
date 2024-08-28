module.exports = {
  resultsReturned: 12,
  limitOfThisResult: 9999999,
  offsetOfThisResult: 0,
  message: 'Search Successful',
  time: '29.998 ms',
  docs: [
    {
      end: '2020-11-13T08:41:27.340Z',
      success: [
        {
          asset_id: '789-MOCK-123',
          asset_slug: 'mock-valid-slug',
          asset_giturl: 'https://mock-gerrit-url/?project=adp/mock-valid-slug/',
          extracted_name: 'adp/mock-valid-slug',
          mode_detected: '"https://mock-gerrit-url/?project=" detected and removed. Slash at the end rule detected and removed.',
          api_url: 'https://mock-gerrit-api/?o=DETAILED_ACCOUNTS&q=status:merged+branch:"master"+after:"2020-11-12+00:00:00"+before:"2020-11-13+23:59:59"+project:"adp%2Fmock-valid-slug"',
          log_date: '2020-11-13T08:40:24.061Z',
          desc: 'success',
        },
      ],
      errors: [
        {
          asset_id: '123-MOCK-456',
          asset_slug: 'mock-valid-slug-error',
          asset_giturl: 'undefined',
          extracted_name: null,
          mode_detected: null,
          api_url: null,
          log_date: '2020-11-13T08:40:22.311Z',
          desc: 'The field giturl is empty.',
        },
      ],
    },
    {
      end: '2020-11-14T09:00:00.000Z',
      success: [
        {
          asset_id: '123-MOCK-456',
          asset_slug: 'mock-valid-slug',
          asset_giturl: 'https://mock-gerrit-url/?project=adp/mock-valid-slug/',
          extracted_name: 'adp/mock-valid-slug',
          mode_detected: '"https://mock-gerrit-url/?project=" detected and removed. Slash at the end rule detected and removed.',
          api_url: 'https://mock-gerrit-api/?o=DETAILED_ACCOUNTS&q=status:merged+branch:"master"+after:"2020-11-12+00:00:00"+before:"2020-11-13+23:59:59"+project:"adp%2Fmock-valid-slug"',
          log_date: '2020-11-14T10:00:00.000Z',
          desc: 'success',
        },
      ],
      errors: [
        {
          asset_id: '789-MOCK-123',
          asset_slug: 'mock-valid-slug-error',
          asset_giturl: 'undefined',
          extracted_name: null,
          mode_detected: null,
          api_url: null,
          log_date: '2020-11-13T08:40:22.311Z',
          desc: 'The field giturl is empty.',
        },
      ],
    },
  ],
};
