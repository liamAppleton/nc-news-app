const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

// /api/users/:username/:comment_id

describe('GET /api/users/:username/:comment_id', () => {
  test('200: Responds with the comment-like object associated with the requested parameters', () => {
    return request(app)
      .get('/api/users/butter_bridge/1')
      .expect(200)
      .then(({ body: { commentLike } }) => {
        expect(commentLike).toEqual({
          username: 'butter_bridge',
          comment_id: 1,
          liked: true,
        });
      });
  });
  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an invalid comment_id', () => {
      return request(app)
        .get('/api/users/butter_bridge/banana')
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('404: Responds with "like not found" when passed a username that does not exist in comment_likes', () => {
      return request(app)
        .get('/api/users/banana/1')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('like not found');
        });
    });
    test('404: Responds with "like not found" when passed a comment_id that does not exist in comment_likes', () => {
      return request(app)
        .get('/api/users/butter_bridge/9999')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('like not found');
        });
    });
    test('404: Responds with "like not found" when passed a comment_id and username that do not exist in comment_likes', () => {
      return request(app)
        .get('/api/users/lurker/10')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('like not found');
        });
    });
  });
});

// GET:
// 200, 404 user not found, 404 comment not found, 404 like not found, 400 bad request

// POST:
// 201, 404 user not found, 404 comment not found, 404 like not found, 400 bad request

// PATCH:
// 200 etc
