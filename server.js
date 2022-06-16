require('dotenv').config();
const uWS = require('uWebSockets.js');
const controller = require('./questions');
const sql = require('./db');
//const fastJSON = require('fast-json-stringify');

const app = uWS.App();
const port = Number(process.env.PORT);

app.get('/qa/questions', async (res, req) => {
  // TODO: add validation and defaults
  res.onAborted(() => {
    res.aborted = true;
  });

  const context = {
    productId: req.getQuery('product_id'),
    page: req.getQuery('page'),
    count: req.getQuery('count'),
  };

  const questions = await controller.getQuestions(context);

  if (!res.aborted) {
    res.writeStatus('200').end(JSON.stringify(questions));
  }
});

app.listen(port, () => {
  console.log(
    `uWS Questions & Answers service listening on port ${process.env.PORT}...`
  );
});

/*

app.get('/qa/questions/:question_id/answers', async (req, res) => {
  const context = {
    questionId: req.params.question_id,
    page: req.query.page,
    count: req.query.count,
  };

  const answers = await controller.getAnswers(context);
  res.status(200).send(answers);
});

app.post('/qa/questions', async (req, res) => {
  const context = {
    productId: req.body.product_id,
    body: req.body.body,
    name: req.body.name,
    email: req.body.email,
  };

  const result = await controller.addQuestion(context);
  res.sendStatus(201);
});

app.post('/qa/questions/:question_id/answers', async (req, res) => {
  const context = {
    questionId: req.params.question_id,
    body: req.body.body,
    name: req.body.name,
    email: req.body.email,
    photos: req.body.photos,
  };

  const result = await controller.addAnswer(context);
  res.sendStatus(201);
});

app.post('/qa/questions/:question_id/helpful', async (req, res) => {
  const context = {
    table: 'questions',
    id: req.params.question_id,
  };
  const result = await controller.markHelpful(context);
  res.sendStatus(204);
});

app.post('/qa/questions/:question_id/report', async (req, res) => {
  const context = {
    table: 'questions',
    id: req.params.question_id,
  };
  const result = await controller.markReported(context);
  res.sendStatus(204);
});

app.post('/qa/answers/:answer_id/helpful', async (req, res) => {
  const context = {
    table: 'answers',
    id: req.params.answer_id,
  };
  const result = await controller.markHelpful(context);
  res.sendStatus(204);
});

app.post('/qa/answers/:answer_id/report', async (req, res) => {
  const context = {
    table: 'answers',
    id: req.params.answer_id,
  };
  const result = await controller.markReported(context);
  res.sendStatus(204);
});

app.all('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(process.env.PORT).then(() => {
  console.log(
    `Questions & Answers service listening on port ${process.env.PORT}...`,
  );
});

const closeServer = async () => {
  await sql.end({ timeout: 0.1 });
  await new Promise((resolve) => {
    server.close(resolve);
  });
};

module.exports.app = app;
module.exports.closeServer = closeServer;

*/
