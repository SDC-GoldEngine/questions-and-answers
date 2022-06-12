module.exports = (rows) => {
    const questions = [];
    const i = -1;

    for (const row of rows) {
      if (questions[i]?.question_id !== row.question_id) {
        i++;
        questions[i] = {
          question_id: row.question_id,
          question_body: row.question_body,
          question_date: row.question_date,
          asker_name: row.asker_name,
          question_helpfulness: row.question_helpfulness,
          reported: false,
          answers: {},
        };
      }

      if (row.answer_id) {
        if (!questions[i].answers[row.answer_id]) {
          questions[i].answers[row.answer_id] = {
            id: row.answer_id,
            body: row.body,
            date: row.date,
            answerer_name: row.answerer_name,
            helpfulness: row.helpfulness,
            photos: [],
          };
        }

        if (row.id) {
          questions[i].answers[row.answer_id].photos.push({
            id: row.id,
            url: row.url,
          });
        }
      }
    }
  }
};
