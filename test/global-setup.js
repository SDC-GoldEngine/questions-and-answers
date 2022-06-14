const dockerCompose = require('docker-compose');
const path = require('path');

module.exports = async () => {
  await dockerCompose.upAll({ cwd: path.join(__dirname), log: true });
};
