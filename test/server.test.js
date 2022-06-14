const axios = require('axios');
const { closeServer } = require('../server.js');

const axiosConfig = {
  baseURL: `http://127.0.0.1:${process.env.PORT}`,
  validateStatus: () => true,
};
const apiClient = axios.create(axiosConfig);

afterAll(async () => {
  await closeServer();
});

describe('Questions and Answers API', () => {
  describe('GET /qa/questions', () => {
    it('when given a valid product ID, should retrieve the appropriate number of questions and send status 200', async () => {
      const productId = 1;
      const page = 1;
      const count = 1;

      const response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=${page}&count=${count}`
      );

      expect(response).toMatchObject({
        status: 200,
        data: {
          product_id: '1',
          results: [
            {
              question_id: 5,
              question_body: 'Can I wash it?',
              question_date: '2020-12-25T00:14:44.662Z',
              asker_name: 'cleopatra',
              question_helpfulness: 7,
              answers: {
                46: {
                  id: 46,
                  body: "I've thrown it in the wash and it seems fine",
                  date: '2020-11-22T05:27:23.272Z',
                  answerer_name: 'marcanthony',
                  helpfulness: 8,
                  photos: [],
                },
                64: {
                  id: 64,
                  body: 'It says not to',
                  date: '2020-05-05T02:15:50.162Z',
                  answerer_name: 'ceasar',
                  helpfulness: 0,
                  photos: [],
                },
                96: {
                  id: 96,
                  body: "I wouldn't machine wash it",
                  date: '2020-05-27T13:03:41.205Z',
                  answerer_name: 'ceasar',
                  helpfulness: 0,
                  photos: [],
                },
                101: {
                  id: 101,
                  body: 'Only if you want to ruin it!',
                  date: '2020-05-27T13:03:41.205Z',
                  answerer_name: 'ceasar',
                  helpfulness: 5,
                  photos: [],
                },
                107: {
                  id: 107,
                  body: 'Yes',
                  date: '2021-01-13T08:47:26.863Z',
                  answerer_name: 'Seller',
                  helpfulness: 4,
                  photos: [],
                },
              },
            },
          ],
        },
      });
    });
  });

  describe('GET /qa/questions/:question_id/answers', () => {
    it('when given a valid question ID, should retrieve the appropriate number of answers and send status 200', async () => {
      const questionId = 1;
      const page = 1;
      const count = 1;

      const response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=${page}&count=${count}`
      );

      expect(response).toMatchObject({
        status: 200,
        data: {
          question: '1',
          page: '1',
          count: '1',
          results: [
            {
              answer_id: 57,
              body: 'Suede',
              date: '2021-04-11T16:51:31.495Z',
              answerer_name: 'metslover',
              helpfulness: 7,
              photos: [],
            },
          ],
        },
      });
    });
  });

  describe('POST /qa/questions', () => {
    it('when sent a valid question, should send status 201 and store the question', async () => {
      const productId = 9999;
      const newQuestion = {
        body: 'This is a question that is being tested?',
        name: 'Tester',
        email: 'test@test.com',
        product_id: productId,
      };

      let response = await apiClient.post('/qa/questions', newQuestion);
      expect(response).toMatchObject({
        status: 201,
      });

      response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=1&count=1`
      );

      expect(response).toMatchObject({
        data: {
          product_id: '9999',
          results: [
            {
              question_body: 'This is a question that is being tested?',
              asker_name: 'Tester',
              question_helpfulness: 0,
              reported: false,
              answers: {},
            },
          ],
        },
      });
    });
  });

  describe('POST /qa/questions/:question_id/answers', () => {
    it('when sent a valid question, should send status 201 and store the answer', async () => {
      const questionId = 1;
      const newAnswer = {
        body: 'This is an answer that is being tested!',
        name: 'Tester',
        email: 'test@test.com',
        photos: ['http://www.picture.com', 'http://www.otherpicture.com'],
      };

      await apiClient.post(`/qa/questions/${questionId}/answers`, newAnswer);
      const response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=1&count=1`
      );

      expect(response).toMatchObject({
        data: {
          question: '1',
          page: '1',
          count: '1',
          results: [
            {
              answer_id: 1000,
              body: 'This is an answer that is being tested!',
              answerer_name: 'Tester',
              helpfulness: 0,
              photos: [
                { id: 100, url: 'http://www.picture.com' },
                { id: 101, url: 'http://www.otherpicture.com' },
              ],
            },
          ],
        },
      });
    });
  });

  describe('POST /qa/questions/:question_id/helpful', () => {});
  describe('POST /qa/questions/:question_id/report', () => {});
  describe('POST /qa/answers/:answer_id/helpful', () => {});
  describe('POST /qa/answers/:answer_id/report', () => {});
});
