const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');

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
});

describe('POST /api/topics', () => {
  let newTopic;
  beforeEach(() => {
    newTopic = {
      slug: 'test topic name',
      description: 'test description',
    };
  });

  test('201: Responds with the posted topic', () => {
    return request(app)
      .post('/api/topics')
      .send(newTopic)
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toEqual(
          expect.objectContaining({
            slug: 'test topic name',
            description: 'test description',
            img_url: null,
          })
        );
      });
  });
  test('400: Responds with "bad request" when slug is not provided', () => {
    delete newTopic.slug;
    return request(app)
      .post('/api/topics')
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.status).toBe(400);
        expect(body.msg).toBe('bad request');
      });
  });
  test('400: Responds with "bad request" when description is not provided', () => {
    delete newTopic.description;
    return request(app)
      .post('/api/topics')
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.status).toBe(400);
        expect(body.msg).toBe('bad request');
      });
  });
});
