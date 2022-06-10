const db = require('./db');

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

