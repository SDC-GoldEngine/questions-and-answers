require('dotenv').config();
const dockerCompose = require('docker-compose');
const path = require('path');
const { Client } = require('pg');

process.env.PGUSER = 'postgres';
process.env.PGPASSWORD = 'pw';
process.env.PGDATABASE = 'qa';
process.env.PGHOST = 'localhost';
process.env.PGPORT = 54310;
process.env.DBPATH = '/data';
process.env.PORT = 3010;

const checkDatabase = async () => {
  const getClient = (count) =>
    new Promise((resolve) => {
      if (count > 10) {
        resolve();
      }

      const client = new Client();
      client
        .connect()
        .then(() => {
          client.end();
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            getClient(count + 1);
          }, 1000);
        });
    });

  console.log('Connecting to database...');
  await getClient(0);
};

module.exports = async () => {
  await dockerCompose.upAll({ cwd: path.join(__dirname), log: true });
  await checkDatabase();
  console.log('Connected to database!');
};
