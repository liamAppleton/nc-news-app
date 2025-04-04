const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

// /api/users/:username/:comment_id

describe('GET /api/users/:username/:comment_id', () => {
  test('200: Responds with the comment-like object associated with the requested parameters', () => {
    return request(app)
      .get('/api/users/butter_bridge/1')
      .expect(200)
      .then(({ body: { commentLike } }) => {
        expect(commentLike).toEqual({
          username: 'butter_bridge',
          comment_id: 1,
          liked: true,
        });
      });
  });
});

// GET:
// 200, 404 user not found, 404 comment not found, 404 like not found, 400 bad request

// POST:
// 201, 404 user not found, 404 comment not found, 404 like not found, 400 bad request

// PATCH:
// 200 etc
