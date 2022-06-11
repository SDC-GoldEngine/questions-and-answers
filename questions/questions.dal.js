const db = require('../db');

module.queryQuestionsByProductId = async (productId, page, count) => {
  const questions = await db.query(
    `
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
      ORDER BY question_date DESC
      LIMIT $2
      OFFSET $3
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
  `,
    [productId, count, (page - 1) * count],
  );

  return questions.rows;
};

module.queryAnswersByQuestionId = async (questionId, page, count) => {
  const answers = await db.query(`
    SELECT * FROM (
      SELECT
        answer_id,
        body,
        date,
        answerer_name,
        helpfulness
      FROM answers
        WHERE question_id = $1
          AND reported = FALSE
      ORDER BY date DESC
      LIMIT $2
      OFFSET $3
    ) a
    INNER JOIN answers_photos ap
      ON ap.answer_id = a.answer_id
    ORDER BY date DESC, id ASC;
  `, [questionId, count, (page - 1) * count]);

  return answers.rows;
};

module.
