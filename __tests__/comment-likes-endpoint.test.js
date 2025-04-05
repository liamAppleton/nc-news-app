const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/comment-likes', () => {
  test('200: Responds with an array of comment-like objects', () => {
    return request(app)
      .get('/api/comment-likes')
      .expect(200)
      .then(({ body: { commentLikes } }) => {
        expect(commentLikes.length).not.toBe(0);

        commentLikes.forEach((like) => {
          expect(like).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              comment_id: expect.any(Number),
              liked: expect.anything(),
            })
          );
        });
      });
  });
});

describe('PUT: /api/comment-likes', () => {
  let newLike;
  beforeEach(() => {
    newLike = { username: 'butter_bridge', comment_id: 1, liked: false };
  });
  test('200: Responds with the updated comment-like object', () => {
    return request(app)
      .put('/api/comment-likes')
      .send(newLike)
      .expect(200)
      .then(({ body: { commentLike } }) => {
        expect(commentLike).toEqual({
          username: 'butter_bridge',
          comment_id: 1,
          liked: false,
        });
      });
  });
  test('200: Works when passed "null" for liked value', () => {
    newLike.liked = null;
    return request(app)
      .put('/api/comment-likes')
      .send(newLike)
      .expect(200)
      .then(({ body: { commentLike } }) => {
        expect(commentLike).toEqual({
          username: 'butter_bridge',
          comment_id: 1,
          liked: null,
        });
      });
  });
  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an invalid comment_id', () => {
      newLike['comment_id'] = 'banana';
      return request(app)
        .put('/api/comment-likes')
        .send(newLike)
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('404: Responds with "resource not found" when passed a username that does not exist', () => {
      newLike.username = 'banana';
      return request(app)
        .put('/api/comment-likes')
        .send(newLike)
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
    test('404: Responds with "resource not found" when passed a comment_id that does', () => {
      newLike['comment_id'] = 9999;
      return request(app)
        .put('/api/comment-likes')
        .send(newLike)
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
    test('400: Responds with "bad request" when passed an invalid send value', () => {
      newLike.liked = 'banana';
      return request(app)
        .put('/api/comment-likes')
        .send(newLike)
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
