const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/article-likes', () => {
  test('200: Responds with an array of article-like objects', () => {
    return request(app)
      .get('/api/article-likes')
      .expect(200)
      .then(({ body: { articleLikes } }) => {
        expect(articleLikes.length).not.toBe(0);

        articleLikes.forEach((like) => {
          expect(like).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              article_id: expect.any(Number),
              liked: expect.anything(),
            })
          );
        });
      });
  });
});

// describe('PUT /api/article-likes');

// describe('DELETE /api/article-likes/:username/:article_id');
