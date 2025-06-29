// jest.setup.js
// jest.setup.js
require('dotenv').config();

// Mock Request and Response objects for the test environment
Object.defineProperty(global, 'Request', {
  value: class Request {},
});

Object.defineProperty(global, 'Response', {
  value: class Response {},
});