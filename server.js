require('dotenv').config();
const express = require('express');
const controller = require('./questions');
const closeDbPool = require('./db').end;

const app = express();

app.use(express.json());

// TODO: add validation and defaults
app.get('/qa/questions', async (req, res) => {
  const context = {
    productId: req.query.product_id,
    page: req.query.page,
    count: req.query.count,
  };
  const questions = await controller.getQuestions(context);
  res.status(200).send(questions);
});

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

app.get(`/${process.env.LOADERIO_TOKEN}`, (req, res) => {
  res.sendStatus(100);
});

app.all('*', (req, res) => {
  res.sendStatus(404);
});

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Questions & Answers service listening on port ${process.env.PORT}...`
  );
});

const closeServer = async () => {
  await closeDbPool();
  await new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
};

module.exports.app = app;
module.exports.closeServer = closeServer;
