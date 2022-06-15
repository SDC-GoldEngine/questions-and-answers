const { Pool } = require('pg');

let pool;

(async () => {
  try {
    pool = new Pool();
    // check for existence of tables
    const queryText = 'SELECT $1::regclass';
    await Promise.all(
      ['questions', 'answers', 'answers_photos'].map(
        async (table) => await pool.query(queryText, [table])
      )
    );
    console.log('Connected to database!');
  } catch (error) {
    console.log('Unable to connect to database');
    console.log(error);
    await pool.end();
  }
})();

module.exports = {
  query: async (text, params) => await pool.query(text, params),
  end: async () => {
    pool.end();
  },
};
