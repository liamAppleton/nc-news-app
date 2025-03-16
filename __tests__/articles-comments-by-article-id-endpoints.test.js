const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

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

  describe('pagination', () => {
    test('200: Responds with an array of comment objects limited to the value passed', () => {
      return request(app)
        .get('/api/articles/1/comments?limit=5')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(5);
        });
    });
    test('When no value passed for limit the array of comment objects will default to a length of 10 (or less)', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(10);
        });
    });
    test('200: Comment limit will default to 10 when the value passed is greater than the number of comments returned', () => {
      return request(app)
        .get('/api/articles/1/comments?limit=9999')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(10);
        });
    });
    test('200: Responds with an array of comment objects according to value passed for page', () => {
      return request(app)
        .get('/api/articles/1/comments?limit=3&p=1')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([
            {
              comment_id: 5,
              article_id: 1,
              body: 'I hate streaming noses',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-11-03T21:00:00.000Z',
            },
            {
              comment_id: 2,
              article_id: 1,
              body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
              votes: 14,
              author: 'butter_bridge',
              created_at: '2020-10-31T03:03:00.000Z',
            },
            {
              comment_id: 18,
              article_id: 1,
              body: 'This morning, I showered for nine minutes.',
              votes: 16,
              author: 'butter_bridge',
              created_at: '2020-07-21T00:20:00.000Z',
            },
          ]);
        });
    });
    test('200: Responds with correct page of comments', () => {
      return request(app)
        .get('/api/articles/1/comments?limit=3&p=2')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([
            {
              comment_id: 13,
              article_id: 1,
              body: 'Fruit pastilles',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-06-15T10:25:00.000Z',
            },
            {
              comment_id: 7,
              article_id: 1,
              body: 'Lobster pot',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-05-15T20:19:00.000Z',
            },
            {
              comment_id: 8,
              article_id: 1,
              body: 'Delicious crackerbreads',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-04-14T20:19:00.000Z',
            },
          ]);
        });
    });
    test('200: Responds with page 1 of up to 10 comment objects when limit not specified', () => {
      return request(app)
        .get('/api/articles/1/comments?p=1')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([
            {
              comment_id: 5,
              article_id: 1,
              body: 'I hate streaming noses',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-11-03T21:00:00.000Z',
            },
            {
              comment_id: 2,
              article_id: 1,
              body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
              votes: 14,
              author: 'butter_bridge',
              created_at: '2020-10-31T03:03:00.000Z',
            },
            {
              comment_id: 18,
              article_id: 1,
              body: 'This morning, I showered for nine minutes.',
              votes: 16,
              author: 'butter_bridge',
              created_at: '2020-07-21T00:20:00.000Z',
            },
            {
              comment_id: 13,
              article_id: 1,
              body: 'Fruit pastilles',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-06-15T10:25:00.000Z',
            },
            {
              comment_id: 7,
              article_id: 1,
              body: 'Lobster pot',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-05-15T20:19:00.000Z',
            },
            {
              comment_id: 8,
              article_id: 1,
              body: 'Delicious crackerbreads',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-04-14T20:19:00.000Z',
            },
            {
              comment_id: 6,
              article_id: 1,
              body: 'I hate streaming eyes even more',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-04-11T21:02:00.000Z',
            },
            {
              comment_id: 12,
              article_id: 1,
              body: 'Massive intercranial brain haemorrhage',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-03-02T07:10:00.000Z',
            },
            {
              comment_id: 3,
              article_id: 1,
              body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
              votes: 100,
              author: 'icellusedkars',
              created_at: '2020-03-01T01:13:00.000Z',
            },
            {
              comment_id: 4,
              article_id: 1,
              body: ' I carry a log — yes. Is it funny to you? It is not to me.',
              votes: -100,
              author: 'icellusedkars',
              created_at: '2020-02-23T12:01:00.000Z',
            },
          ]);
        });
    });
    test('200: Responds with single comment object when passed a value for page and "1" for limit', () => {
      return request(app)
        .get('/api/articles/1/comments?limit=1&p=4')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([
            {
              comment_id: 13,
              article_id: 1,
              body: 'Fruit pastilles',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-06-15T10:25:00.000Z',
            },
          ]);
        });
    });
    test('200: Responds with the last page of comments when the value passed to page is too high', () => {
      return request(app)
        .get('/api/articles/1/comments?limit=3&p=9999')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([
            {
              comment_id: 4,
              article_id: 1,
              body: ' I carry a log — yes. Is it funny to you? It is not to me.',
              votes: -100,
              author: 'icellusedkars',
              created_at: '2020-02-23T12:01:00.000Z',
            },
            {
              comment_id: 9,
              article_id: 1,
              body: 'Superficially charming',
              votes: 0,
              author: 'icellusedkars',
              created_at: '2020-01-01T03:08:00.000Z',
            },
          ]);
        });
    });

    describe('error handling: pagination', () => {
      test('400: Responds with "bad request" when passed an invalid limit value', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=banana&p=2')
          .expect(400)
          .then(({ body }) => {
            expect(body.status).toBe(400);
            expect(body.msg).toBe('bad request');
          });
      });
      test('400: Responds with "bad request" when passed an invalid page value', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=9&p=banana')
          .expect(400)
          .then(({ body }) => {
            expect(body.status).toBe(400);
            expect(body.msg).toBe('bad request');
          });
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
      newComment.username = 'banana';
      return request(app)
        .post('/api/articles/3/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('400: Responds with "bad request" when post body does not have required fields', () => {
      delete newComment.body;
      return request(app)
        .post('/api/articles/3/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
  });
});
