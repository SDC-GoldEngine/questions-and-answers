const db = require('./db');
const { performance } = require('perf_hooks');

const calculateMean = (array) => {
  let sum = 0;
  for (const x of array) { sum += x; }
  return sum / array.length;
}

const calculateStandardDeviation = (array) => {
  const mean = calculateMean(array);
  const N = array.length;
  let sum = 0;
  for (const x of array) { sum += (x - mean) ** 2; }
  return (sum / N - 1) ** (1 / 2);
}

const calculcateStandardError = (array) => {
  return calculateStandardDeviation(array) / (array.length ** (1 / 2));
}

benchmark = async (iterations) => {
  const productIds = [...Array(iterations)].map(() => Math.floor(Math.random() * 1e6));
  let times = [0, 0, 0];
  let count = 1;

  for (const productId of productIds) {
    let t0 = performance.now()

    {
      let result = await db.query(`SELECT * FROM questions
        WHERE product_id = $1;
      `, [productId]);

      const questions = result.rows;
      for (const question of questions) {
        question.answers = {};
        
        let result = await db.query(`SELECT * FROM answers
          WHERE question_id = $1;
        `, [question.id]);

        const answers = result.rows;
        for (const answer of answers) {
          result = await db.query(`SELECT * FROM answers_photos
            WHERE answer_id = $1;
          `, [answer.id]);
          answer.photos = result.rows;
          question.answers[answer.id] = answer;
        }
      }
    }
  
    let t1 = performance.now();
    times[0] += t1 - t0;
    t0 = performance.now();

    {
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

    t1 = performance.now();
    times[1] += t1 - t0;
    t0 = performance.now();

    {
      await db.query(`SELECT
      * FROM answers_photos ap
      INNER JOIN LATERAL (
        SELECT
          a.id, q.id AS question_id, a.body, q.body AS question_body
        FROM answers a
        INNER JOIN LATERAL (
          SELECT
            *
          FROM questions
          WHERE product_id = $1
        ) q ON q.id = a.question_id
      ) aq ON aq.id = ap.answer_id;
      `, [productId])
    }

    t1 = performance.now();
    times[2] += t1 - t0;
    console.log(`Iteration ${count}/${iterations} completed`);
    count++;
  }
  times = times.map(time => time / (1000 * iterations));
  console.log(times);
};

benchmark(100);
