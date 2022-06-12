const db = require('../db');

module.exports.queryQuestionsByProductId = async (productId, count, page) => {
  const questions = await db.query(
    `
    SELECT 
      q.product_id,
      q.id AS question_id,
      q.body AS question_body,
      q.date AS question_date,
      q.name AS asker_name,
      q.helpfulness AS question_helpfulness,
      a.id AS answer_id,
      a.body,
      a.date,
      a.name AS answerer_name,
      a.helpfulness,
      ap.id,
      ap.url
    FROM (
      SELECT * FROM questions
        WHERE
          product_id = $1
          AND reported = FALSE
      ORDER BY date DESC, id ASC
      LIMIT $2
      OFFSET $3
    ) q
    LEFT JOIN (
      SELECT * FROM answers
        WHERE reported = FALSE
    ) a
      ON a.question_id = q.id
    LEFT JOIN answers_photos ap
      ON ap.answer_id = a.id
    ORDER BY
      q.date DESC,
      q.id ASC,
      a.date DESC,
      a.id ASC,
      ap.id DESC;
  `,
    [productId, count, (page - 1) * count],
  );

  return questions.rows;
};

module.exports.queryAnswersByQuestionId = async (questionId, count, page) => {
  const answers = await db.query(
    `
    SELECT 
      a.id AS answer_id,
      a.body,
      a.date,
      a.name AS answerer_name,
      a.helpfulness,
      ap.id,
      ap.url
    FROM (SELECT * FROM answers
      WHERE question_id = $1
        AND reported = FALSE
      ORDER BY date DESC, id ASC
      LIMIT $2
      OFFSET $3
    ) a
    LEFT JOIN answers_photos ap
      ON ap.answer_id = a.id
    ORDER BY
      a.date DESC,
      a.id ASC,
      ap.id ASC;
    `,
    [questionId, count, (page - 1) * count],
  );

  return answers.rows;
};

module.exports.insertQuestion = async (productId, body, name, email) => {
  const result = await db.query(
    `
    INSERT INTO questions (
      product_id,
      body,
      name,
      email
    ) VALUES ($1, $2, $3, $4);
    `,
    [productId, body, name, email],
  );

  return result.rowCount;
};

module.exports.insertAnswer = async (questionId, body, name, email, photos) => {
  const result = await db.query(
    `
    WITH inserted_answer AS (
      INSERT INTO answers (
        question_id,
        body,
        name,
        email
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
    )
    INSERT INTO answers_photos (
      answer_id,
      url
    )
    SELECT * FROM
      (SELECT id AS answer_id FROM inserted_answer) ia
      CROSS JOIN
      unnest($5::text[]) url;
    `,
    [questionId, body, name, email, photos],
  );

  return result.rowCount;
};

module.exports.incrementHelpfulness = async (table, id) => {
  const result = await db.query(
    `
    UPDATE ${table}
      SET helpfulness = helpfulness + 1
      WHERE id = $1;
  `,
    [id],
  );

  return result.rowCount;
};

module.exports.report = async (table, id) => {
  const result = await db.query(
    `
    UPDATE ${table}
      SET reported = TRUE
      WHERE id = $1;
  `,
    [id],
  );

  return result.rowCount;
};
