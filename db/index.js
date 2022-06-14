const { Pool } = require('pg');
const setupDb = require('./setup.js');

let pool;

(async () => {
  try {
    pool = new Pool();

    // check for existence of tables
    const queryText = 'SELECT $1::regclass';
    await Promise.all(
      ['questions', 'answers', 'answers_photos'].map(
        async (table) => await pool.query(queryText, [table]),
      ),
    );
  } catch (error) {
    console.log(error);

    await pool.end();
    await setupDb();
    pool = new Pool();
  }
})();

module.exports = {
  query: async (text, params) => await pool.query(text, params),
  end: async () => {
    pool.end();
  },
};
