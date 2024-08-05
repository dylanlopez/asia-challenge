const { isValidURL } = require('../utils');

test('validates a correct URL', () => {
  expect(isValidURL('https://www.example.com')).toBe(true);
});

test('invalidates an incorrect URL', () => {
  expect(isValidURL('example')).toBe(false);
});