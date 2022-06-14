const axios = require('axios');
const { server } = require('../server.js');

const axiosConfig = {
  baseURL: `http://127.0.0.1:${process.env.PORT}`,
  validateStatus: () => true,
};
const qaClient = axios.create(axiosConfig);

afterAll(() => {
  server.close();
});

describe('Questions and Answers API', () => {
  describe.only('GET /qa/questions', () => {
    it('should be ok', async () => {
      const questionId = 1;
      const page = 1;
      const count = 1;
      const response = await qaClient.get(
        `qa/questions/${questionId}/answers?page=${page}&count=${count}`,
      );
      console.log(response.data);
    });
  });
  describe('GET /qa/questions/:question_id/answers', () => {});
  describe('POST /qa/questions', () => {});
  describe('POST /qa/questions/:question_id/answers', () => {});
  describe('POST /qa/questions/:question_id/helpful', () => {});
  describe('POST /qa/questions/:question_id/report', () => {});
  describe('POST /qa/answers/:answer_id/helpful', () => {});
  describe('POST /qa/answers/:answer_id/report', () => {});
});
