const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/articles', () => {
  test('200: Responds with an array of article objects in reverse date order and each with a comment_count property', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('created_at', { descending: true });
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

  describe('queries', () => {
    test('200: Responds with an array of article objects sorted by the passed column', () => {
      return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('title');
        });
    });
    test('200: Responds with an array of article objects sorted in ascending order', () => {
      return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('created_at', { descending: false });
        });
    });
    test('200: Articles should be sorted in descending order by default', () => {
      return request(app)
        .get('/api/articles?order')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('created_at', { descending: true });
        });
    });
    test('200: Responds with an array of article objects filtered by the passed topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article.topic).toBe('mitch');
          });
        });
    });

    describe('error handling: queries', () => {
      test('400: Responds with "bad request" when passed an invalid column name for sort_by query', () => {
        return request(app)
          .get('/api/articles?sort_by=banana')
          .expect(400)
          .then(({ body }) => {
            expect(body.status).toBe(400);
            expect(body.msg).toBe('bad request');
          });
      });
      test('400: Responds with "resource not found" when passed a valid topic that does not exist', () => {
        return request(app)
          .get('/api/articles?topic=banana')
          .expect(404)
          .then(({ body }) => {
            expect(body.status).toBe(404);
            expect(body.msg).toBe('resource not found');
          });
      });
    });
  });
});

describe('POST /api/articles', () => {
  let newArticle;
  beforeEach(() => {
    newArticle = {
      author: 'rogersop',
      title: 'Test article title',
      body: 'Test article body',
      topic: 'mitch',
      article_img_url: 'http://test.com',
    };
  });

  test('201: Responds with the posted article', () => {
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            author: 'rogersop',
            title: 'Test article title',
            body: 'Test article body',
            topic: 'mitch',
            article_img_url: 'http://test.com',
            votes: 0,
            created_at: expect.any(String),
            comment_count: '0',
          })
        );
      });
  });
  test('Responds with N/A for article_img_url if one is not provided', () => {
    delete newArticle['article_img_url'];
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article['article_img_url']).toBe('N/A');
      });
  });

  describe('error handling', () => {
    test('400: Responds with "bad request" when passed an author that does not exist', () => {
      newArticle.author = 'banana';
      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
  });
});

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
    test('400: Responds with "bad request" when passed username that does not exist', () => {
      return request(app)
        .post('/api/articles/3/comments')
        .send({
          username: 'banana',
          body: 'Test body 1',
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('400: Responds with "bad request" when post body does not have required fields', () => {
      return request(app)
        .post('/api/articles/3/comments')
        .send({ username: 'rogersop' })
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
  });
});
