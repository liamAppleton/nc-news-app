const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/article-likes', () => {
  test('200: Responds with an array of article-like objects', () => {
    return request(app)
      .get('/api/article-likes')
      .expect(200)
      .then(({ body: { articleLikes } }) => {
        expect(articleLikes.length).not.toBe(0);

        articleLikes.forEach((like) => {
          expect(like).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              article_id: expect.any(Number),
              liked: expect.anything(),
            })
          );
        });
      });
  });
});

describe('PUT /api/article-likes', () => {
  let newLike;
  beforeEach(() => {
    newLike = { username: 'butter_bridge', article_id: 1, liked: false };
  });
  test('200: Responds with the updated article-like object', () => {
    return request(app)
      .put('/api/article-likes')
      .send(newLike)
      .expect(200)
      .then(({ body: { articleLike } }) => {
        expect(articleLike).toEqual({
          username: 'butter_bridge',
          article_id: 1,
          liked: false,
        });
      });
  });
  test('200: Works when passed "null" for liked value', () => {
    newLike.liked = null;
    return request(app)
      .put('/api/article-likes')
      .send(newLike)
      .expect(200)
      .then(({ body: { articleLike } }) => {
        expect(articleLike).toEqual({
          username: 'butter_bridge',
          article_id: 1,
          liked: null,
        });
      });
  });
  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an invalid article_id', () => {
      newLike['article_id'] = 'banana';
      return request(app)
        .put('/api/article-likes')
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
        .put('/api/article-likes')
        .send(newLike)
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
    test('404: Responds with "resource not found" when passed an article_id that does', () => {
      newLike['article_id'] = 9999;
      return request(app)
        .put('/api/article-likes')
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
        .put('/api/article-likes')
        .send(newLike)
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
  });
});

describe('DELETE /api/article-likes/:username/:article_id', () => {
  test('204: Responds with 204 status code', () => {
    return request(app)
      .delete('/api/article-likes/butter_bridge/2')
      .expect(204);
  });
  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an invalid article_id', () => {
      return request(app)
        .delete('/api/article-likes/butter_bridge/banana')
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('404: Responds with "resource not found" when passed a username that does not exist in article_likes', () => {
      return request(app)
        .delete('/api/article-likes/banana/1')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
    test('404: Responds with "resource not found" when passed an article_id that does not exist in article_likes', () => {
      return request(app)
        .delete('/api/article-likes/butter_bridge/9999')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
  });
});
