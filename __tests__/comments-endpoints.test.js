const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('DELETE /api/comments/:comment_id', () => {
  test('204: Responds with 204 status code', () => {
    return request(app).delete('/api/comments/2').expect(204);
  });
});
