const dal = require('./questions.dal.js');

const formatQuestions = (rows) => {
  const questions = [];
  let i = -1;

  for (const row of rows) {
    if (questions[i]?.question_id !== row.question_id) {
      i += 1;
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
  return questions;
};

module.exports.getQuestions = async (context) => {
  const rows = await dal.queryQuestionsByProductId(
    context.productId,
    context.count,
    context.page,
  );

  return {
    product_id: context.productId,
    results: formatQuestions(rows),
  };
};

module.exports.getAnswers = async (context) => await dal.queryAnswersByQuestionId(
  context.questionId,
  context.count,
  context.page,
);

module.exports.addQuestion = async (context) => await dal.insertQuestion(
  context.productId,
  context.body,
  context.name,
  context.email,
);

module.exports.addAnswer = async (context) => await dal.insertAnswer(
  context.questionId,
  context.body,
  context.name,
  context.email,
  context.photos,
);
module.exports.markHelpful = async (context) => await dal.incrementHelpfulness(context.table, context.id);

module.exports.markReported = async (context) => await dal.report(context.table, context.id);
