const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/articles/:article_id', () => {
  test('200: Responds with an article object with requested article id', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          comment_count: '11',
        });
      });
  });
  test('400: Responds with "bad request" when given an invalid article id', () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.status).toBe(400);
        expect(body.msg).toBe('bad request');
      });
  });
  test('404: Responds with "article not found" when given an article id that does not exist', () => {
    return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(({ body }) => {
        expect(body.status).toBe(404);
        expect(body.msg).toBe('article not found');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('200: Reponds with the updated article object', () => {
    return request(app)
      .patch('/api/articles/3')
      .send({ inc_votes: 2 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 2,
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test('Works when decrementing votes', () => {
    return request(app)
      .patch('/api/articles/3')
      .send({ inc_votes: -2 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(-2);
      });
  });

  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an invalid article id', () => {
      return request(app)
        .patch('/api/articles/banana')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('404: Responds with "article not found" when passed a valid article id that does not exist', () => {
      return request(app)
        .patch('/api/articles/99999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('article not found');
        });
    });
    test('400: Reponds with "bad request" when passed an invalid value for inc_votes', () => {
      return request(app)
        .patch('/api/articles/3')
        .send({ inc_votes: 'banana' })
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
  });
});

describe('DELETE /api/articles/:article_id', () => {
  test('204: Responds with 204 status code', () => {
    return request(app).delete('/api/articles/1').expect(204);
  });
  test('400: Responds with "bad request" when passed an invalid article id', () => {
    return request(app)
      .delete('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.status).toBe(400);
        expect(body.msg).toBe('bad request');
      });
  });
  test('404: Responds with "resource not found" when passed a valid article id that does not exist', () => {
    return request(app)
      .delete('/api/articles/99999')
      .expect(404)
      .then(({ body }) => {
        expect(body.status).toBe(404);
        expect(body.msg).toBe('resource not found');
      });
  });
});
