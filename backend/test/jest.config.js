module.exports = {
    testEnvironment: 'node',  // Use Node.js environment for testing backend
    verbose: true,  // Shows detailed test information
    setupFilesAfterEnv: ['./jest.setup.js'],  // File to set up testing environment
    testTimeout: 20000, // 20 seconds timeout for tests (adjust if needed)
  };