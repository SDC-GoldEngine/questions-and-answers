require('dotenv').config();
const dockerCompose = require('docker-compose');
const path = require('path');
const { Client } = require('pg');

process.env.PGHOST = 'localhost';
process.env.PGPORT = 54310;
process.env.PGDATABASE = 'qa';
process.env.PGUSER = 'postgres';
process.env.PGPASSWORD = 'pw';
process.env.PORT = 3010;

const checkDatabase = async () => {
  let connected = false;
  let timeoutReached = false;

  const getClient = async () => {
    try {
      const client = new Client();
      await client.connect();
      await client.end();
      connected = true;
      console.log('Connected to database!');
    } catch (error) {
      return;
    }
  };

  setTimeout(() => {
    if (!connected) {
      console.log('Unable to connect to database!');
    }
    timeoutReached = true;
  }, 5000);

  console.log('Connecting to database...');
  while (!connected && !timeoutReached) {
    await getClient();
  }
};

module.exports = async () => {
  await dockerCompose.upAll({ cwd: path.join(__dirname), log: true });
  await checkDatabase();
};
