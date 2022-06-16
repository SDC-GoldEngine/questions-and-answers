require('dotenv').config();
const dockerCompose = require('docker-compose');
const path = require('path');

process.env.PGHOST = 'localhost';
process.env.PGPORT = 54310;
process.env.PGDATABASE = 'qa';
process.env.PGUSER = 'postgres';
process.env.PGPASSWORD = 'pw';
process.env.PORT = 3010;

const postgres = require('postgres');

const sql = postgres();

const checkDatabase = async () => {
  let connected = false;
  let timeoutReached = false;

  const checkConnection = async () => {
    try {
      await Promise.all(
        ['questions', 'answers', 'answers_photos'].map(async (table) => {
          const result = await sql`SELECT * FROM ${sql(table)} LIMIT 1`;
          if (result.length === 0) {
            throw new Error();
          }
        })
      );
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
  }, 10000);

  console.log('Connecting to database...');
  while (!connected && !timeoutReached) {
    await checkConnection();
  }
};

module.exports = async () => {
  await dockerCompose.upAll({ cwd: path.join(__dirname), log: true });
  await checkDatabase();
};
