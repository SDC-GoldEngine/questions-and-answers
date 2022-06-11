module.exports = class Question {
  constructor(rows) {
    this.product_id = rows[0].product_id;
    this.question_id = rows[0].question_id;
    this.question_body = rows[0].question_body;
    this.question_date = rows[0].question_date;
    this.asker_name = rows[0].asker_name;
    this.question_helpfulness = rows[0].question_helpfulness;
    this.reported = false;
    this.answers = {};

    for (const row of rows) {
      if (!this.answers[row.answer_id]) {
        this.answers[row.answer_id] = {
          id: row.answer_id,
          body: row.body,
          date: row.date,
          answerer_name: row.answerer_name,
          helpfulness: row.helpfulness,
          photos: [],
        }
      }

      this.answers[row.answer_id].photos.push({
        id: row.id,
        url: row.url,
      })
    }
  }
};
