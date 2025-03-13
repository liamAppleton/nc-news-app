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
      .then(
        ({
          body: {
            articles: { rows },
          },
        }) => {
          expect(rows).toBeSortedBy('created_at', { descending: true });
          expect(rows.length).not.toBe(0);

          rows.forEach((article) => {
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
        }
      );
  });

  describe('queries', () => {
    test('200: Responds with an array of article objects sorted by the passed column', () => {
      return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows).toBeSortedBy('title');
          }
        );
    });
    test('200: Responds with an array of article objects sorted in ascending order', () => {
      return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows).toBeSortedBy('created_at', { descending: false });
          }
        );
    });
    test('200: Articles should be sorted in descending order by default', () => {
      return request(app)
        .get('/api/articles?order')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows).toBeSortedBy('created_at', { descending: true });
          }
        );
    });
    test('200: Responds with an array of article objects filtered by the passed topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            rows.forEach((article) => {
              expect(article.topic).toBe('mitch');
            });
          }
        );
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

  describe('pagination', () => {
    test('200: Responds with an array of article objects limited to the value passed', () => {
      return request(app)
        .get('/api/articles?limit=5')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows.length).toBe(5);
          }
        );
    });
    test('When no value passed for limit the array of article objects will default to a length of 10 (or less)', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows.length).toBe(10);
          }
        );
    });
    test('200: Responds with an object including the articles and a total_count property', () => {
      return request(app)
        .get('/api/articles?limit=10')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles['total_count']).toBe(13);
        });
    });
    test('200: Article limit will default to 10 when the value passed is greater than the number of articles returned', () => {
      return request(app)
        .get('/api/articles?limit=99999')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows.length).toBe(10);
          }
        );
    });
    test('total_count property will be the number of articles after a filter is applied', () => {
      return request(app)
        .get('/api/articles?topic=mitch&limit=5')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles['total_count']).toBe(12);
        });
    });
    test('200: Responds with an array of article objects according to value passed for page', () => {
      return request(app)
        .get('/api/articles?limit=3&p=1')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows).toEqual([
              {
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '2',
              },
              {
                article_id: 6,
                title: 'A',
                topic: 'mitch',
                created_at: '2020-10-18T01:00:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '1',
              },
              {
                article_id: 2,
                title: 'Sony Vaio; or, The Laptop',
                topic: 'mitch',
                created_at: '2020-10-16T05:03:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
            ]);
          }
        );
    });
    test('200: Responds with correct page of articles', () => {
      return request(app)
        .get('/api/articles?limit=3&p=2')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows).toEqual([
              {
                article_id: 13,
                title: 'Another article about Mitch',
                topic: 'mitch',
                created_at: '2020-10-11T11:24:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
              {
                article_id: 12,
                title: 'Moustache',
                topic: 'mitch',
                created_at: '2020-10-11T11:24:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
              {
                article_id: 5,
                title: 'UNCOVERED: catspiracy to bring down democracy',
                topic: 'cats',
                created_at: '2020-08-03T13:14:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '2',
              },
            ]);
          }
        );
    });
    test('200: Responds with page 1 of 10 article objects when limit not specified', () => {
      return request(app)
        .get('/api/articles?p=1')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows).toEqual([
              {
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '2',
              },
              {
                article_id: 6,
                title: 'A',
                topic: 'mitch',
                created_at: '2020-10-18T01:00:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '1',
              },
              {
                article_id: 2,
                title: 'Sony Vaio; or, The Laptop',
                topic: 'mitch',
                created_at: '2020-10-16T05:03:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
              {
                article_id: 13,
                title: 'Another article about Mitch',
                topic: 'mitch',
                created_at: '2020-10-11T11:24:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
              {
                article_id: 12,
                title: 'Moustache',
                topic: 'mitch',
                created_at: '2020-10-11T11:24:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
              {
                article_id: 5,
                title: 'UNCOVERED: catspiracy to bring down democracy',
                topic: 'cats',
                created_at: '2020-08-03T13:14:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '2',
              },
              {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '11',
              },
              {
                article_id: 9,
                title: "They're not exactly dogs, are they?",
                topic: 'mitch',
                created_at: '2020-06-06T09:10:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '2',
              },
              {
                article_id: 10,
                title: 'Seven inspirational thought leaders from Manchester UK',
                topic: 'mitch',
                created_at: '2020-05-14T04:15:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
              {
                article_id: 4,
                title: 'Student SUES Mitch!',
                topic: 'mitch',
                created_at: '2020-05-06T01:14:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
            ]);
          }
        );
    });
    test('200: Responds with single article object when passed a value for page and "1" for limit', () => {
      return request(app)
        .get('/api/articles?limit=1&p=4')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows).toEqual([
              {
                article_id: 13,
                title: 'Another article about Mitch',
                topic: 'mitch',
                created_at: '2020-10-11T11:24:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
            ]);
          }
        );
    });
    test('200: Responds with the last page of articles when the value passed to page is too high', () => {
      return request(app)
        .get('/api/articles?limit=5&p=99999')
        .expect(200)
        .then(
          ({
            body: {
              articles: { rows },
            },
          }) => {
            expect(rows).toEqual([
              {
                article_id: 8,
                title: 'Does Mitch predate civilisation?',
                topic: 'mitch',
                created_at: '2020-04-17T01:08:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
              {
                article_id: 11,
                title: 'Am I a cat?',
                topic: 'mitch',
                created_at: '2020-01-15T22:21:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
              {
                article_id: 7,
                title: 'Z',
                topic: 'mitch',
                created_at: '2020-01-07T14:08:00.000Z',
                votes: 0,
                article_img_url:
                  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0',
              },
            ]);
          }
        );
    });

    describe('error handling: pagination', () => {
      test('400: Responds with "bad request" when passed an invalid limit value', () => {
        return request(app)
          .get('/api/articles?limit=banana&p=1')
          .expect(400)
          .then(({ body }) => {
            expect(body.status).toBe(400);
            expect(body.msg).toBe('bad request');
          });
      });
      test('400: Responds with "bad request" when passed an invalid page value', () => {
        return request(app)
          .get('/api/articles?limit=4&p=banana')
          .expect(400)
          .then(({ body }) => {
            expect(body.status).toBe(400);
            expect(body.msg).toBe('bad request');
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
    test('400: Responds with "bad request" when passed a topic that does not exist', () => {
      newArticle.topic = 'banana';
      return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.status).toBe(400);
          expect(body.msg).toBe('bad request');
        });
    });
    test('400: Responds with "bad request" when request body is missing fields', () => {
      delete newArticle.title;
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
