import readFile from './readFile';
import splitContent from './splitContent';
import getBlocks from './getBlocks';


describe('getBlocks', () => {
  // arrange
  const content = readFile('./data/post.html');
  const fragments = splitContent(content);
  // act
  const blocks = getBlocks(fragments);

  describe('text', () => {
    const textIndex = 2;

    test('type', () => {
      expect(blocks[textIndex].type).toBe('text');
    });

    test('text', () => {
      // TODO: smells very bad 💩
      const startsWith = blocks[textIndex].text.trim()
        .startsWith('<br><html><head></head><body><p></p>');
      expect(startsWith).toBe(true);
    });
  });

  describe('image', () => {
    const imageIndex = 1;

    test('type', () => {
      expect(blocks[imageIndex].type).toBe('image');
    });

    test('rawUrl', () => {
      expect(blocks[imageIndex].rawUrl)
        .toBe('https://img-fotki.yandex.ru/get/225029/137106206.7e7/0_20cfb0_e600127a_orig');
    });
  });

  describe('embed', () => {
    const videoIndex = 7;

    test('type', () => {
      expect(blocks[videoIndex].type).toBe('embed');
    });

    test('rawUrl', () => {
      expect(blocks[videoIndex].rawUrl)
        .toBe('//www.youtube.com/embed/WyWn1XJ9kTE?wmode=opaque');
    });
  });
});