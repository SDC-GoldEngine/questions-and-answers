const sql = require('../db');

module.exports.queryQuestionsByProductId = async (productId, count, page) => {
  return await sql`
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
          product_id = ${productId}
          AND reported = FALSE
      ORDER BY date DESC, id ASC
      LIMIT ${count}
      OFFSET ${(page - 1) * count}
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
      ap.id ASC;
  `;
  });

module.exports.queryAnswersByQuestionId = async (questionId, count, page) => sql`
  SELECT 
    json_build_object(
      'question', ${questionId}::text,
      'page', ${page}::integer,
      'count', ${count}::integer,
      'results', COALESCE(
        json_agg(
          json_build_object(
            'answer_id', a.id,
            'body', a.body,
            'date', a.date,
            'answerer_name', a.name,
            'helpfulness', a.helpfulness,
            'photos', COALESCE(p.photos, '[]'::json)
          )
        ),
        '[]'::json
      )
    ) result
  FROM (
    SELECT * FROM answers
    WHERE question_id = ${questionId}
      AND reported = FALSE
    ORDER BY date DESC, id ASC
    LIMIT ${count}
    OFFSET ${(page - 1) * count}
  ) a
  LEFT JOIN (
    SELECT
      ap.answer_id,
      json_agg(
        json_build_object(
          'id', ap.id,
          'url', ap.url
        )
      ) photos
    FROM
      answers_photos ap
    GROUP BY ap.answer_id
  ) p
  ON p.answer_id = a.id;
`.raw();

module.exports.insertQuestion = async (productId, body, name, email) => {
  return await sql`
    INSERT INTO questions (
      product_id,
      body,
      name,
      email
    ) VALUES (${productId}, ${body}, ${name}, ${email});
    `;
};

module.exports.insertAnswer = async (questionId, body, name, email, photos) => {
  return await sql`
    WITH inserted_answer AS (
      INSERT INTO answers (
        question_id,
        body,
        name,
        email
      ) VALUES (${questionId}, ${body}, ${name}, ${email})
      RETURNING id
    )
    INSERT INTO answers_photos (
      answer_id,
      url
    )
    SELECT * FROM
      (SELECT id AS answer_id FROM inserted_answer) ia
      CROSS JOIN
      unnest(${photos}::text[]) url;
  `;
};

module.exports.incrementHelpfulness = async (table, id) => {
  return await sql`
    UPDATE ${sql(table)}
      SET helpfulness = helpfulness + 1
      WHERE id = ${id};
  `;
};

module.exports.report = async (table, id) => {
  return await sql`
    UPDATE ${sql(table)}
      SET reported = TRUE
      WHERE id = ${id};
  `;
};
