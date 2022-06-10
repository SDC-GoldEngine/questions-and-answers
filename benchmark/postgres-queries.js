const db = require('./db');
const benchmark = require('./benchmark/benchmark.js');

const sequentialQapWithSequentialSteps = async (productId) => {
  let result = await db.query(`
    SELECT * FROM questions
      WHERE product_id = $1;
  `, [productId]);

  const questions = result.rows;
  for (const question of questions) {
    question.answers = {};
    
    result = await db.query(`
      SELECT * FROM answers
        WHERE question_id = $1;
    `, [question.id]);
    const answers = result.rows;

    for (const answer of answers) {
      result = await db.query(`
        SELECT * FROM answers_photos
          WHERE answer_id = $1;
      `, [answer.id]);
      answer.photos = result.rows;
      question.answers[answer.id] = answer;
    }
  }

  return questions;
};

const sequentialQapWithParallelSteps = async (productId) => {
  let result = await db.query(`SELECT * FROM questions
      WHERE product_id = $1;
    `, [productId]);
  const questions = result.rows;

  await Promise.all(questions.map(async (question) => {
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

  return questions;
};

const singleQuery = async (productId) => {
  const result = await db.query(`
    SELECT * FROM (
      SELECT 
        product_id,
        question_id,
        question_body,
        question_date,
        asker_name,
        question_helpfulness,
        reported
      FROM questions
        WHERE
          product_id = $1
          AND reported = FALSE
    ) q
    INNER JOIN (
      SELECT
        question_id,
        answer_id,
        body,
        date,
        answerer_name,
        helpfulness
      FROM answers
        WHERE reported = FALSE
    ) a
    ON a.question_id = q.question_id
    INNER JOIN
      answers_photos ap
    ON ap.answer_id = a.answer_id
    ORDER BY question_date DESC, date DESC;
  `, [productId]);

  const questions = result.rows
  return questions;
};

const funcs = [
  {
    name: 'Sequential Qs -> As -> Ps with sequential steps',
    func: sequentialQapWithSequentialSteps,
  },
  {
    name: 'Sequential Qs -> As -> Ps with parallel steps',
    func: sequentialQapWithParallelSteps,
  },
  {
    name: 'Single query',
    func: singleQuery,
  },
];

benchmark(funcs, {
  iterations: 10,
  clients: 1000,
});
