require('dotenv').config();
const dockerCompose = require('docker-compose');
const path = require('path');
const { Client } = require('pg');

process.env.PGUSER = 'postgres';
process.env.PGPASSWORD = 'pw';
process.env.PGDATABASE = 'qa';
process.env.PGPORT = 54310;
process.env.DBPATH = '/data';
process.env.PORT = 3010;

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

  console.log('Connecting to database...');
  while (!connected) {
    await getClient();
  }
};

module.exports = async () => {
  await dockerCompose.upAll({ cwd: path.join(__dirname), log: true });
  await checkDatabase();
  console.log('Connected to database!');
};
