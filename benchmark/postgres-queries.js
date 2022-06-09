const b = require('benny');
const db = require('./db');

const productIds = [...Array(1e3)].map(() => Math.floor(Math.random() * 1e6));

b.suite('Postgres /questions queries',
  b.add('Consecutive queries', async () => {
    for (productId of productIds) {
      let result = await db.query(`SELECT * FROM questions
        WHERE product_id = $1;
      `, [productId]);

      const questions = result.rows;
      for (question of questions) {
        question.answers = {};
        
        result = await db.query(`SELECT * FROM answers
          WHERE question_id = $1;
        `, [question.id]);

        const answers = result.rows;
        for (answer of answers) {
          result = await db.query(`SELECT * FROM answers_photos
            WHERE answer_id = $1;
          `, [answer.id]);
          answer.photos = result.rows;
          question.answers[answer.id] = answer;
        }
      }
    }
  }),

  b.add('Parallel queries', async () => {
    for (productId of productIds) {
      let result = await db.query(`SELECT * FROM questions
        WHERE product_id = $1;
      `, [productId]);

      const questions = result.rows;
      Promise.all(questions.map(async (question) => {
        question.answers = {};
        
        result = await db.query(`SELECT * FROM answers
          WHERE question_id = $1;
        `, [question.id]);

        const answers = result.rows;
        Promise.all(answers.map(async (answer) => {
          result = await db.query(`SELECT * FROM answers_photos
            WHERE answer_id = $1;
          `, [answer.id]);
          answer.photos = result.rows;
          question.answers[answer.id] = answer;
        }));
      }));
    }
  }),

  b.add('Join query', async () => {
    for(productId of product_id) {
    }
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'postgres-queries' , details: true}),
  b.configure({
    maxTime: 300,
    minSamples: 1,
  }),
);
