const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('DELETE /api/comments/:comment_id', () => {
  test('204: Responds with 204 status code', () => {
    return request(app).delete('/api/comments/2').expect(204);
  });

  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an invalid comment id', () => {
      return request(app)
        .delete('/api/comments/banana')
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('404: Responds with "resource not found" when passed a valid comment id that does not exist', () => {
      return request(app)
        .delete('/api/comments/99999')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
  });
});
