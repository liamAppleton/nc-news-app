const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('PATCH /api/comments/:comment_id', () => {
  test('200: Responds with the updated comment object', () => {
    return request(app)
      .patch('/api/comments/2')
      .send({ inc_votes: 2 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 2,
          article_id: 1,
          body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
          votes: 16,
          author: 'butter_bridge',
          created_at: '2020-10-31T03:03:00.000Z',
        });
      });
  });
  test('Works when decrementing votes', () => {
    return request(app)
      .patch('/api/comments/2')
      .send({ inc_votes: -2 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(12);
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('204: Responds with 204 status code', () => {
    return request(app).delete('/api/comments/2').expect(204);
  });
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
