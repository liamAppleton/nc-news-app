const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/topics', () => {
  test('200: Responds with an array of topic objects', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).not.toBe(0);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test('200: Responds with an array of topics sorted by slug', () => {
    return request(app)
      .get('/api/topics?sort_by=slug')
      .expect(200)
      .then(({ body: { topics } }) => {
        const topicsSorted = topics.toSorted((a, b) => {
          return a.slug.localeCompare(b.slug);
        });
        expect(topics).toEqual(topicsSorted);
      });
  });
  test('400: Responds with "bad request" when query includes invalid column name', () => {
    return request(app)
      .get('/api/topics?sort_by=mug')
      .expect(400)
      .then(({ body }) => {
        expect(body.status).toBe(400);
        expect(body.msg).toBe('bad request');
      });
  });
});
