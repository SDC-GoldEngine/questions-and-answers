const isCI = require('is-ci');
const dockerCompose = require('docker-compose');

module.exports = async () => {
  // Check if running CI environment
  if (isCI) {
    dockerCompose.down();
  }
};
