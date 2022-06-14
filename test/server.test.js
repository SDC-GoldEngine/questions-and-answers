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
      console.log(response.data.results[0].answers);

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
              reported: false,
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
              },
            },
          ],
        },
      });
    });

    it.skip('when page and count are missing, should use a value of 1 for page and 5 for count', async () => {
      const productId = 1;

      const response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=${page}&count=${count}`
      );

      expect(response).toMatchObject({});
    });

    it.skip('when given invalid values, should return status 400', async () => {
      let productId = -1;
      let page = 1;
      let count = 1;
      let response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);

      productId = 1;
      page = -1;
      count = 1;
      response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);

      productId = 1;
      page = 1;
      count = -1;
      response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);

      productId = 'wrong';
      page = 1;
      count = 1;
      response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);

      productId = 1;
      page = 'wrong';
      count = 1;
      response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);

      productId = 1;
      page = 1;
      count = 'wrong';
      response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);
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

    it.skip('when page and count are missing, should use a value of 1 for page and 5 for count', async () => {
      const questionId = 1;
      const response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=${page}&count=${count}`
      );

      expect(response).toMatchObject({});
    });

    it.skip('when given invalid values, should return status 400', async () => {
      let questionId = -1;
      let page = 1;
      let count = 1;
      let response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);

      questionId = 1;
      page = -1;
      count = 1;
      response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);

      questionId = 1;
      page = 1;
      count = -1;
      response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);

      questionId = 'wrong';
      page = 1;
      count = 1;
      response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);

      questionId = 1;
      page = 'wrong';
      count = 1;
      response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);

      questionId = -1;
      page = 1;
      count = 'wrong';
      response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=${page}&count=${count}`
      );
      expect(response.status).toEqual(400);
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

    it.skip('when given an invalid question, should return status 400', async () => {
      let productId = 9999;
      let newQuestion = {
        body: 'This is a question that is being tested?',
        name: 'Tester',
        email: 'test@test.com',
      };
      let response = await apiClient.post('/qa/questions', newQuestion);
      expect(response.status).toEqual(400);

      newQuestion = {
        body: 'This is a question that is being tested?',
        name: 'Tester',
        email: 'test@test.com',
        product_id: 'productId',
      };
      response = await apiClient.post('/qa/questions', newQuestion);
      expect(response.status).toEqual(400);

      newQuestion = {
        body: [],
        name: 'Tester',
        email: 'test@test.com',
        product_id: productId,
      };
      response = await apiClient.post('/qa/questions', newQuestion);
      expect(response.status).toEqual(400);

      newQuestion = {
        body: 'This is a question that is being tested?',
        name: 1,
        email: 'test@test.com',
        product_id: productId,
      };
      response = await apiClient.post('/qa/questions', newQuestion);
      expect(response.status).toEqual(400);

      newQuestion = {
        body: 'This is a question that is being tested?',
        name: 'Tester',
        email: { key: 1 },
        product_id: productId,
      };
      response = await apiClient.post('/qa/questions', newQuestion);
      expect(response.status).toEqual(400);
    });
  });

  describe('POST /qa/questions/:question_id/answers', () => {
    it('when sent a valid answer, should send status 201 and store the answer', async () => {
      const questionId = 1;
      const newAnswer = {
        body: 'This is an answer that is being tested!',
        name: 'Tester',
        email: 'test@test.com',
        photos: ['http://www.picture.com', 'http://www.otherpicture.com'],
      };

      let response = await apiClient.post(
        `/qa/questions/${questionId}/answers`,
        newAnswer
      );
      expect(response.status).toEqual(201);

      response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=1&count=1`
      );

      expect(response).toMatchObject({
        data: {
          question: '1',
          page: '1',
          count: '1',
          results: [
            {
              answer_id: 100,
              body: 'This is an answer that is being tested!',
              answerer_name: 'Tester',
              helpfulness: 0,
              photos: [
                { id: 18, url: 'http://www.picture.com' },
                { id: 19, url: 'http://www.otherpicture.com' },
              ],
            },
          ],
        },
      });
    });

    it.skip('when given an invalid answer, should return status 400', async () => {
      let questionId = 1e8;
      let newAnswer = {
        body: 'This is an answer that is being tested!',
        name: 'Tester',
        email: 'test@test.com',
        photos: ['http://www.picture.com', 'http://www.otherpicture.com'],
      };
      let result = await apiClient.post(
        `/qa/questions/${questionId}/answers`,
        newAnswer
      );
      expect(result.status).toEqual(400);

      questionId = 1;
      newAnswer = {
        name: 'Tester',
        email: 'test@test.com',
        photos: ['http://www.picture.com', 'http://www.otherpicture.com'],
      };
      result = await apiClient.post(
        `/qa/questions/${questionId}/answers`,
        newAnswer
      );
      expect(result.status).toEqual(400);

      newAnswer = {
        body: 1,
        name: 'Tester',
        email: 'test@test.com',
        photos: ['http://www.picture.com', 'http://www.otherpicture.com'],
      };
      result = await apiClient.post(
        `/qa/questions/${questionId}/answers`,
        newAnswer
      );
      expect(result.status).toEqual(400);

      newAnswer = {
        body: 'This is an answer that is being tested!',
        name: 1,
        email: 'test@test.com',
        photos: ['http://www.picture.com', 'http://www.otherpicture.com'],
      };
      result = await apiClient.post(
        `/qa/questions/${questionId}/answers`,
        newAnswer
      );
      expect(result.status).toEqual(400);

      newAnswer = {
        body: 'This is an answer that is being tested!',
        name: 'Tester',
        email: {},
        photos: ['http://www.picture.com', 'http://www.otherpicture.com'],
      };
      result = await apiClient.post(
        `/qa/questions/${questionId}/answers`,
        newAnswer
      );
      expect(result.status).toEqual(400);

      newAnswer = {
        body: 'This is an answer that is being tested!',
        name: 'Tester',
        email: 'test@test.com',
        photos: [{}, 'http://www.otherpicture.com'],
      };
      result = await apiClient.post(
        `/qa/questions/${questionId}/answers`,
        newAnswer
      );
      expect(result.status).toEqual(400);

      newAnswer = {
        body: 'This is an answer that is being tested!',
        name: 'Tester',
        email: 'test@test.com',
        photos: ['http://www.picture.com', 'http://www.otherpicture.com', 1],
      };
      result = await apiClient.post(
        `/qa/questions/${questionId}/answers`,
        newAnswer
      );
      expect(result.status).toEqual(400);
    });
  });

  describe('POST /qa/questions/:question_id/helpful', () => {
    it('when sent a valid questionId, should send status 204 and increment the helpfulness', async () => {
      const productId = 9999;
      const newQuestion = {
        body: 'This is a question that is being tested?',
        name: 'Tester',
        email: 'test@test.com',
        product_id: productId,
      };

      await apiClient.post('/qa/questions', newQuestion);

      let response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=1&count=1`
      );
      let question = response.data.results[0];
      const questionId = question.question_id;
      expect(question.question_helpfulness).toEqual(0);

      response = await apiClient.post(`/qa/questions/${questionId}/helpful`);
      expect(response.status).toEqual(204);

      response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=1&count=1`
      );
      question = response.data.results[0];
      expect(question.question_helpfulness).toEqual(1);
    });

    it.skip('when given invalid values, should return status 400', async () => {
      let questionId = -1;
      let response = await apiClient.post(
        `/qa/questions/${questionId}/helpful`
      );
      expect(response.status).toEqual(400);

      productId = 'wrong';
      response = await apiClient.post(`/qa/questions/${questionId}/helpful`);
      expect(response.status).toEqual(400);
    });

    it.skip('when given a nonexistent productId, should return status 404', async () => {
      let questionId = 1e8;
      let response = await apiClient.post(
        `/qa/questions/${questionId}/helpful`
      );
      expect(response.status).toEqual(404);
    });
  });

  describe('POST /qa/questions/:question_id/report', () => {
    it('when sent a valid questionId, should send status 204 and hide the question', async () => {
      const productId = 8888;
      const newQuestion = {
        body: 'This is a question that is being tested?',
        name: 'Tester',
        email: 'test@test.com',
        product_id: productId,
      };

      await apiClient.post('/qa/questions', newQuestion);

      let response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=1&count=1`
      );

      const questionId = response.data.results[0].question_id;

      response = await apiClient.post(`/qa/questions/${questionId}/report`);
      expect(response.status).toEqual(204);

      response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=1&count=1`
      );
      expect(response.data.results).toMatchObject([]);
    });

    it.skip('when given invalid values, should return status 400', async () => {
      let questionId = -1;
      let response = await apiClient.post(`/qa/questions/${questionId}/report`);
      expect(response.status).toEqual(400);

      productId = 'wrong';
      response = await apiClient.post(`/qa/questions/${questionId}/report`);
      expect(response.status).toEqual(400);
    });

    it.skip('when given a nonexistent productId, should return status 404', async () => {
      let questionId = 1e8;
      let response = await apiClient.post(`/qa/questions/${questionId}/report`);
      expect(response.status).toEqual(404);
    });
  });

  describe('POST /qa/answers/:answer_id/helpful', () => {
    it('when sent a valid answerId, should send status 204 and increment the helpfulness', async () => {
      const questionId = 1;
      const newAnswer = {
        body: 'This is an answer that is being tested!',
        name: 'Tester',
        email: 'test@test.com',
        photos: ['http://www.picture.com', 'http://www.otherpicture.com'],
      };

      await apiClient.post(`/qa/questions/${questionId}/answers`, newAnswer);
      let response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=1&count=1`
      );

      let answer = response.data.results[0];
      const answerId = answer.answer_id;
      expect(answer.helpfulness).toEqual(0);

      response = await apiClient.post(`/qa/answers/${answerId}/helpful`);
      expect(response.status).toEqual(204);

      response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=1&count=1`
      );
      answer = response.data.results[0];
      expect(answer.helpfulness).toEqual(1);
    });

    it.skip('when given invalid values, should return status 400', async () => {
      let answerId = -1;
      let response = await apiClient.post(`/qa/answers/${answerId}/helpful`);
      expect(response.status).toEqual(400);

      answerId = 'wrong';
      response = await apiClient.post(`/qa/answers/${answerId}/helpful`);
      expect(response.status).toEqual(400);
    });

    it.skip('when given a nonexistent answerId, should return status 404', async () => {
      let answerId = 1e8;
      let response = await apiClient.post(`/qa/answers/${answerId}/helpful`);
      expect(response.status).toEqual(404);
    });
  });

  describe('POST /qa/answers/:answer_id/report', () => {
    it('when sent a valid answerId, should send status 204 and hide the question', async () => {
      const productId = 7777;
      const newQuestion = {
        body: 'This is a question that is being tested?',
        name: 'Tester',
        email: 'test@test.com',
        product_id: productId,
      };

      await apiClient.post('/qa/questions', newQuestion);
      let response = await apiClient.get(
        `qa/questions?product_id=${productId}&page=1&count=1`
      );
      const questionId = response.data.results[0].question_id;

      const newAnswer = {
        body: 'This is an answer that is being tested!',
        name: 'Tester',
        email: 'test@test.com',
        photos: ['http://www.picture.com', 'http://www.otherpicture.com'],
      };
      await apiClient.post(`/qa/questions/${questionId}/answers`, newAnswer);
      response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=1&count=1`
      );
      const answerId = response.data.results[0].answer_id;

      response = await apiClient.post(`/qa/answers/${answerId}/report`);
      expect(response.status).toEqual(204);

      response = await apiClient.get(
        `qa/questions/${questionId}/answers?page=1&count=1`
      );
      expect(response.data.results).toMatchObject([]);
    });

    it.skip('when given invalid values, should return status 400', async () => {
      let answerId = -1;
      let response = await apiClient.post(`/qa/answers/${answerId}/report`);
      expect(response.status).toEqual(400);

      answerId = 'wrong';
      response = await apiClient.post(`/qa/answers/${answerId}/report`);
      expect(response.status).toEqual(400);
    });

    it.skip('when given a nonexistent answerId, should return status 404', async () => {
      let answerId = 1e8;
      let response = await apiClient.post(`/qa/answers/${answerId}/report`);
      expect(response.status).toEqual(404);
    });
  });

  describe('invalid route', () => {
    it('should return 404', async () => {
      let response = await apiClient.post(`/xa/questions`);
      expect(response.status).toEqual(404);
      expect(response.status).toEqual(404);

      response = await apiClient.post(`/qa/xuestions`);
      expect(response.status).toEqual(404);

      response = await apiClient.post(`/qa/xnswers`);
      expect(response.status).toEqual(404);
    });
  });
});
