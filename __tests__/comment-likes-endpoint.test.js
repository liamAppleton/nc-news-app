const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/comment-likes/:username/:comment_id', () => {
  test('200: Responds with the comment-like object associated with the requested parameters', () => {
    return request(app)
      .get('/api/comment-likes/butter_bridge/1')
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
        .get('/api/comment-likes/butter_bridge/banana')
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('404: Responds with "like not found" when passed a username that does not exist in comment_likes', () => {
      return request(app)
        .get('/api/comment-likes/banana/1')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('like not found');
        });
    });
    test('404: Responds with "like not found" when passed a comment_id that does not exist in comment_likes', () => {
      return request(app)
        .get('/api/comment-likes/butter_bridge/9999')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('like not found');
        });
    });
    test('404: Responds with "like not found" when passed a comment_id and username that do not exist in comment_likes', () => {
      return request(app)
        .get('/api/comment-likes/lurker/10')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('like not found');
        });
    });
  });
});

describe('PUT: /api/comment-likes/:username/:comment_id', () => {
  test('200: Responds with the updated comment-like object', () => {
    return request(app)
      .put('/api/comment-likes/butter_bridge/1')
      .send({ liked: false })
      .expect(200)
      .then(({ body: { commentLike } }) => {
        expect(commentLike).toEqual({
          username: 'butter_bridge',
          comment_id: 1,
          liked: false,
        });
      });
  });
  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an invalid comment_id', () => {
      return request(app)
        .put('/api/comment-likes/butter_bridge/banana')
        .send({ liked: false })
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('404: Responds with "resource not found" when passed a username that does not exist in comment_likes', () => {
      return request(app)
        .put('/api/comment-likes/banana/1')
        .send({ liked: false })
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
    test('404: Responds with "resource not found" when passed a comment_id that does not exist in comment_likes', () => {
      return request(app)
        .put('/api/comment-likes/butter_bridge/9999')
        .send({ liked: false })
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
    test('400: Responds with "bad request" when passed an invalid send value', () => {
      return request(app)
        .put('/api/comment-likes/butter_bridge/1')
        .send({ liked: 'banana' })
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
  });
});

describe('DELETE: /api/comment-likes/:username/:comment_id', () => {
  test('204: Responds with 204 status code', () => {
    return request(app)
      .delete('/api/comment-likes/butter_bridge/2')
      .expect(204);
  });
  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an invalid comment_id', () => {
      return request(app)
        .delete('/api/comment-likes/butter_bridge/banana')
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('404: Responds with "resource not found" when passed a username that does not exist in comment_likes', () => {
      return request(app)
        .delete('/api/comment-likes/banana/1')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
    test('404: Responds with "resource not found" when passed a comment_id that does not exist in comment_likes', () => {
      return request(app)
        .delete('/api/comment-likes/butter_bridge/9999')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
  });
});
