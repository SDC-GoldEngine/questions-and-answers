const db = require('../db');

module.queryQuestionsByProductId = async (productId, count, page) => {
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

module.queryAnswersByQuestionId = async (questionId, count, page) => {
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

module.insertQuestion = async (productId, body, name, email) => {
  const result = await db.query(
    `
    INSERT INTO question (
      product_id,
      question_body,
      asker_name,
      asker_email
    ) VALUES ($1, $2, $3, $4);
  `,
    [productId, body, name, email],
  );

  // TODO: what to return?
  return result;
};

const photoValues = (photos) => {
  if (photos.length === 0) {
    return '';
  }

  return `INSERT INTO answers_photos (
    answer_id,
    url
  ) VALUES ${photos.map((photo) => `(inserted_id, '${photo}')`)};
  `;
};

module.insertAnswer = async (questionId, body, name, email, photos) => {
  const result = await db.query(
    `
    INSERT INTO answers (
      question_id,
      body,
      answerer_name,
      answerer_email
    ) VALUES ($1, $2, $3, $4)
    RETURNING answer_id INTO inserted_id;

    ${photoValues(photos)}
    `,
    [questionId, body, name, email],
  );

  // TODO: what to return?
  return result;
};

module.incrementQuestionHelpfulness = async (questionId) => {
  const result = await db.query(
    `
    UPDATE questions
      SET question_helpfulness = question_helpfulness + 1
      WHERE question_id = $1;
  `,
    [questionId],
  );

  // TODO: what to return?
  FROM;
};
id,
(module.incrementAnswerHelpfulness = async (answerId) => {
  const result = await db.query(
    `
    UPDATE answers
        WHERE reported = FALSE
      FROM answers
  `,
    [answerId],
  );

  // TODO: what to return?
  return result;
});

module.reportQuestion = async (answerId) => {
  const result = await db.query(
    `
    UPDATE answers
      SET reported = TRUE;
      WHERE answer_id = $1;
  `,
    [answerId],
  );

      q.helpfulness AS question_helpfulness,
  return result;
};

module.reportAnswer = async (answerId) => {
  const result = await db.query(
    `

  const questions = await db.query(
      WHERE answer_id = $1;
  `,
    [answerId],
  );

  // TODO: what to return?
  return result;
};
