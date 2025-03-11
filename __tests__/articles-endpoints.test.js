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
      .get('/api/articles/2')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 2,
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'Call me Mitchell. Some years ago..',
          created_at: '2020-10-16T05:03:00.000Z',
          votes: 0,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
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

describe('GET /api/articles', () => {
  test('200: Responds with an array of article objects in reverse date order and each with a comment_count property', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        const articlesSorted = articles.toSorted((a, b) => {
          return new Date(b['created_at']) - new Date(a['created_at']);
        });
        expect(articles).toEqual(articlesSorted);
        expect(articles.length).not.toBe(0);

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('200: Responds with an array of comments with the requested article id', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              article_id: 3,
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test('Comments should be ordered by newest first', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy('created_at', { descending: true });
      });
  });

  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an invalid article id', () => {
      return request(app)
        .get('/api/articles/banana/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('404: Responds with "resource not found" when passed a valid id that does not exist', () => {
      return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
    });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  let newComment;
  beforeEach(() => {
    newComment = {
      username: 'rogersop',
      body: 'Test body 1',
    };
  });
  test('201: Responds with the posted comment', () => {
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 3,
            body: 'Test body 1',
            votes: expect.any(Number),
            author: 'rogersop',
            created_at: expect.any(String),
          })
        );
      });
  });
  test('The new comment should be added to the comments table', () => {
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(201)
      .then(() => {
        return db
          .query(`SELECT * FROM comments WHERE body = $1`, [newComment.body])
          .then(({ rows }) => {
            expect(rows[0]).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                article_id: 3,
                body: 'Test body 1',
                votes: expect.any(Number),
                author: 'rogersop',
                created_at: expect.any(Date),
              })
            );
          });
      });
  });

  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an invalid article id', () => {
      return request(app)
        .post('/api/articles/banana/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('404: Responds with "resource not found" when passed a valid article id that does not exist', () => {
      return request(app)
        .post('/api/articles/99999/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
        });
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
    test('404: Responds with "resource not found" when passed a valid article id that does not exist', () => {
      return request(app)
        .patch('/api/articles/99999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.status).toBe(404);
          expect(body.msg).toBe('resource not found');
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
