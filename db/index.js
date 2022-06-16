const postgres = require('postgres');

const sql = postgres({
  max: 10,
});

(async () => {
  try {
    // check for existence of tables
    await Promise.all(
      ['questions', 'answers', 'answers_photos'].map(
        async (table) => sql`SELECT ${table}::regclass`
      )
    );
    console.log('Connected to database!');
  } catch (error) {
    console.log('Unable to connect to database');
    console.log(error);
  }
})();

module.exports = sql;
