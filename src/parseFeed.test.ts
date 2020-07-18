import readFile from './readFile';
import parseFeed from './parseFeed';

describe('parseFeed', () => {
  describe('masterok.ru', () => {
    let parsedFeed;

    beforeAll(async () => {
      // arrange
      const feed = readFile('./data/masterokblog.ru.xml');
      // act
      parsedFeed = await parseFeed(feed);
    });

    test('items', () => {
      expect(parsedFeed.items.length).toBe(20);
    });

    test('categories', () => {
      const categories = [ 'Любопытно', 'Психология', 'Творчество' ];
      expect(parsedFeed.items[0].categories).toEqual(categories);
    });

    test('link', () => {
      const link = 'https://masterokblog.ru/?p=63783';
      expect(parsedFeed.items[0].link).toBe(link);
    });

    test('title', () => {
      const title = 'Знаменитости, которые ненавидели свои самые известные творения';
      expect(parsedFeed.items[0].title).toBe(title);
    });

    test('title (post with text, images, and video)', () => {
      const title = 'Ледяной палец смерти';
      expect(parsedFeed.items[3].title).toBe(title);
    });

    test('content', () => {
      expect(parsedFeed.items[0].content.length).toBe(292);
    });

    test('content:encoded', () => {
      expect(parsedFeed.items[0]['content:encoded'].length).toBe(11939);
    });

  });
});