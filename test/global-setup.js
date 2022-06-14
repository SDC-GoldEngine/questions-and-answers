require('dotenv').config();
const dockerCompose = require('docker-compose');
const path = require('path');
const { Client } = require('pg');

const checkDatabase = async () => {
  let connected = false;

  const getClient = async () => {
    try {
      const client = new Client();
      await client.connect();
      connected = true;
      await client.end();
    } catch (error) {
      connected = false;
      setTimeout(() => {}, 100);
    }
  };

  while (!connected) {
    console.log('Waiting to connect to database...');
    await getClient();
  }
};

module.exports = async () => {
  await dockerCompose.upAll({ cwd: path.join(__dirname), log: true });
  await checkDatabase();
  console.log('Connected to database!');
};
