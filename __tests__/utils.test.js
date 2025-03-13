const {
  convertTimestampToDate,
  createLookUp,
  formatDataWithId,
  checkExists,
  countArticlesAfterFilter,
} = require('../db/seeds/utils');
const db = require('../db/connection.js');

afterAll(() => {
  db.end();
});

describe('convertTimestampToDate', () => {
  test('returns a new object', () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test('converts a created_at property to a date', () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test('does not mutate the input', () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test('ignores includes any other key-value-pairs in returned object', () => {
    const input = { created_at: 1557572706232, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test('returns unchanged object if no created_at property', () => {
    const input = { key: 'value' };
    const result = convertTimestampToDate(input);
    const expected = { key: 'value' };
    expect(result).toEqual(expected);
  });
});

describe('createLookUp', () => {
  test('should return an object with one property containing a key named after title and a value corresponding to article_id', () => {
    const input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      },
    ];
    const expected = { 'Living in the shadow of a great man': 1 };
    expect(createLookUp(input)).toEqual(expected);
  });

  test('should return an object with two properties containing a keys named after article titles title and a values corresponding to article_ids', () => {
    const input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      },
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1602828180000,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      },
    ];
    const expected = {
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
    };
    expect(createLookUp(input)).toEqual(expected);
  });

  test('should work when passed an array of multiple objects', () => {
    const input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      },
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1602828180000,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      },
      {
        article_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1604394720000,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      },
    ];
    const expected = {
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
      'Eight pug gifs that remind me of mitch': 3,
    };
    expect(createLookUp(input)).toEqual(expected);
  });

  describe('purity tests', () => {
    test('should not mutate original array', () => {
      const input = [
        {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: 1594329060000,
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        },
      ];
      const inputCopy = [
        {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: 1594329060000,
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        },
      ];
      createLookUp(input);
      expect(input).toEqual(inputCopy);
    });
  });
});

describe('formatDataWithId', () => {
  let lookUp;
  beforeEach(() => {
    lookUp = {
      "They're not exactly dogs, are they?": 1,
      'Living in the shadow of a great man': 2,
      'Eight pug gifs that remind me of mitch': 3,
    };
  });

  test("when passed an array containing one object, should return an array with one object's article_id property correctly formatted", () => {
    const input = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        created_at: 1586179020000,
      },
    ];
    const expected = [
      {
        article_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        created_at: 1586179020000,
      },
    ];

    expect(formatDataWithId(input, lookUp)).toEqual(expected);
  });

  test('when passed an array containing two objects, should correctly format them both', () => {
    const input = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        created_at: 1586179020000,
      },
      {
        article_title: 'Living in the shadow of a great man',
        body: 'Delicious crackerbreads',
        votes: 0,
        author: 'icellusedkars',
        created_at: 1586899140000,
      },
    ];
    const expected = [
      {
        article_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        created_at: 1586179020000,
      },
      {
        article_id: 2,
        body: 'Delicious crackerbreads',
        votes: 0,
        author: 'icellusedkars',
        created_at: 1586899140000,
      },
    ];

    expect(formatDataWithId(input, lookUp)).toEqual(expected);
  });

  test('should work when passed an array of multiple objects', () => {
    const input = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        created_at: 1586179020000,
      },
      {
        article_title: 'Living in the shadow of a great man',
        body: 'Delicious crackerbreads',
        votes: 0,
        author: 'icellusedkars',
        created_at: 1586899140000,
      },
      {
        article_title: 'Eight pug gifs that remind me of mitch',
        body: 'git push origin master',
        votes: 0,
        author: 'icellusedkars',
        created_at: 1592641440000,
      },
    ];
    const expected = [
      {
        article_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        created_at: 1586179020000,
      },
      {
        article_id: 2,
        body: 'Delicious crackerbreads',
        votes: 0,
        author: 'icellusedkars',
        created_at: 1586899140000,
      },
      {
        article_id: 3,
        body: 'git push origin master',
        votes: 0,
        author: 'icellusedkars',
        created_at: 1592641440000,
      },
    ];

    expect(formatDataWithId(input, lookUp)).toEqual(expected);
  });

  describe('purity tests', () => {
    test('should not mutate input array', () => {
      const input = [
        {
          article_title: "They're not exactly dogs, are they?",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: 'butter_bridge',
          created_at: 1586179020000,
        },
        {
          article_title: 'Living in the shadow of a great man',
          body: 'Delicious crackerbreads',
          votes: 0,
          author: 'icellusedkars',
          created_at: 1586899140000,
        },
      ];
      const inputCopy = [
        {
          article_title: "They're not exactly dogs, are they?",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: 'butter_bridge',
          created_at: 1586179020000,
        },
        {
          article_title: 'Living in the shadow of a great man',
          body: 'Delicious crackerbreads',
          votes: 0,
          author: 'icellusedkars',
          created_at: 1586899140000,
        },
      ];
      formatDataWithId(input, lookUp);
      expect(input).toEqual(inputCopy);
    });

    test('should not mutate input lookup array', () => {
      const input = [
        {
          article_title: "They're not exactly dogs, are they?",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: 'butter_bridge',
          created_at: 1586179020000,
        },
        {
          article_title: 'Living in the shadow of a great man',
          body: 'Delicious crackerbreads',
          votes: 0,
          author: 'icellusedkars',
          created_at: 1586899140000,
        },
      ];
      const lookUpCopy = {
        "They're not exactly dogs, are they?": 1,
        'Living in the shadow of a great man': 2,
        'Eight pug gifs that remind me of mitch': 3,
      };
      formatDataWithId(input, lookUp);
      expect(lookUp).toEqual(lookUpCopy);
    });

    test('should return an array with a different reference from input array', () => {
      const input = [
        {
          article_title: "They're not exactly dogs, are they?",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: 'butter_bridge',
          created_at: 1586179020000,
        },
        {
          article_title: 'Living in the shadow of a great man',
          body: 'Delicious crackerbreads',
          votes: 0,
          author: 'icellusedkars',
          created_at: 1586899140000,
        },
      ];

      expect(formatDataWithId(input, lookUp)).not.toBe(input);
    });
  });
});

describe('checkExists', () => {
  test('should resolve with true if resource exists', () => {
    return checkExists('topics', 'slug', 'mitch').then((res) => {
      expect(res).toBe(true);
    });
  });
  test('should reject with error object if resource does not exist', () => {
    return checkExists('topics', 'slug', 'banana').catch((err) => {
      expect(err.status).toBe(404);
      expect(err.msg).toBe('resource not found');
    });
  });
});

describe('countArticlesAfterFilter', () => {
  test('should resolve with the total number of articles after a filter has been applied', () => {
    const query = { topic: 'mitch' };
    return countArticlesAfterFilter(query).then((res) => {
      expect(res).toBe(12);
    });
  });
});
