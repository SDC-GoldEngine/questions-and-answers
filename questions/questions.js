module.exports = class Questions {
  constructor(rows) {
    for (const row of rows) {
      if (!this[row.question_id]) {
        this[row.question_id] = {
          question_id: row.question_id,
          question_body: row.question_body,
          question_date: row.question_date,
          asker_name: row.asker_name,
          question_helpfulness: row.helpfulness,
          reported: false,
          answers: {},
        };
      }

      if (row.answer_id) {
        if (!this.answers[row.answer_id]) {
          this[row.question_id].answers[row.answer_id] = {
            id: row.answer_id,
            body: row.body,
            date: row.date,
            answerer_name: row.answerer_name,
            helpfulness: row.helpfulness,
            photos: [],
          };
        }

        if (row.id) {
          this[row.question_id].answers[row.answer_id].photos.push({
            id: row.id,
            url: row.url,
          });
        }
      }
    }
  }
};
