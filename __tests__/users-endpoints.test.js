const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/users', () => {
  test('200: Responds with an array of user objects', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).not.toBe(0);

        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe('GET /api/users/:username', () => {
  test('200: Responds with a user object', () => {
    return request(app)
      .get('/api/users/rogersop')
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: 'rogersop',
          name: 'paul',
          avatar_url:
            'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
        });
      });
  });
  test('400: Responds with "user not found" when a username that does not exist', () => {
    return request(app)
      .get('/api/users/banana')
      .expect(404)
      .then(({ body }) => {
        expect(body.status).toBe(404);
        expect(body.msg).toBe('user not found');
      });
  });
});
