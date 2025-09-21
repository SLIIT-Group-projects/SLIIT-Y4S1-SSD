const { mockClerk } = require('jest-mock-clerk');

beforeEach(() => {
  mockClerk({
    auth: {
      userId: 'mock-user-id',
    },
  });
});